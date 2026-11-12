<?php
/**
 * Plagastop · recepción de formularios del sitio (cotización y contacto).
 *
 * Lo ejecuta /api/enviar.php. Compatible con PHP 7.4 o superior, sin Composer ni Node.js.
 *
 *  GET  /api/enviar.php?accion=token  → { ok: true, token }   (token firmado, requerido para enviar)
 *  POST /api/enviar.php  (JSON)       → { ok: true } | { ok: false, error, code, fields? }
 *
 * Las credenciales SMTP, los destinatarios y la clave de firma viven en un archivo PHP FUERA de public_html
 * (ver server/plagastop-mail.example.php y docs/formularios-produccion.md). Este archivo no contiene secretos.
 *
 * Controles: solo GET/POST, sin CORS, Origin/Referer/Sec-Fetch-Site, Content-Type JSON, límite de tamaño,
 * token firmado con edad mínima y máxima (y de un solo uso), honeypot, límite por IP y global, validación
 * estricta de cada campo, destinatarios desde una lista del servidor, Reply-To validado y registro temporal
 * de cada solicitud (se borra solo tras `retention_days`).
 */

declare(strict_types=1);

namespace Plagastop\Forms;

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

if (!defined('PLAGASTOP_FORMS')) {
    http_response_code(404);
    exit;
}

// PHPMailer incluido en el proyecto (sin Composer). Se carga antes de validar la configuración.
require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

const MAX_BODY_BYTES = 16384;
const TOKEN_MIN_AGE = 3;          // segundos: un humano no completa el formulario más rápido
const TOKEN_MAX_AGE = 14400;      // 4 h
const SENDING_STALE_AFTER = 120;  // un envío "en curso" más antiguo se considera fallido
const DEDUPE_WINDOW = 86400;      // reintentos de la misma solicitud durante 24 h no reenvían el correo
const RECIPIENT_DOMAIN = 'plagastop.cl';
const PLACEHOLDER = 'COMPLETAR';

/** Áreas del formulario de contacto y su ruta en la lista de destinatarios del servidor. */
const CONTACT_AREAS = [
    'comercial' => ['label' => 'Área Comercial', 'route' => 'contacto_comercial'],
    'secretaria' => ['label' => 'Secretaría', 'route' => 'contacto_secretaria'],
];

const ROUTES = ['cotizacion', 'contacto_comercial', 'contacto_secretaria'];

const ATTRIBUTION_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'landing_page',
];

const MSG_UNAVAILABLE = 'El formulario no está disponible en este momento.';
const MSG_GENERIC = 'No pudimos procesar tu solicitud.';

final class HttpError extends \Exception
{
    /** @var int */
    public $status;
    /** @var string */
    public $errorCode;
    /** @var array<string,string> */
    public $fields;
    /** @var array<string,string> */
    public $headers;

    /**
     * @param array<string,string> $fields
     * @param array<string,string> $headers
     */
    public function __construct(int $status, string $errorCode, string $message, array $fields = [], array $headers = [])
    {
        parent::__construct($message);
        $this->status = $status;
        $this->errorCode = $errorCode;
        $this->fields = $fields;
        $this->headers = $headers;
    }
}

/* -------------------------------------------------------------------------------------------------
 * Punto de entrada
 * ----------------------------------------------------------------------------------------------- */

function run(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex, nofollow');
    header('Referrer-Policy: no-referrer');
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
    // Sin Access-Control-Allow-Origin: el navegador bloquea cualquier llamada desde otro dominio.

    $config = null;
    try {
        $method = $_SERVER['REQUEST_METHOD'] ?? '';
        if ($method !== 'GET' && $method !== 'POST') {
            throw new HttpError(405, 'method', 'Método no permitido.', [], ['Allow' => 'GET, POST']);
        }

        $config = load_config();
        check_request_origin($config);
        $store = new Store($config['data_dir']);
        $store->housekeeping((int) $config['retention_days']);
        $ip = client_ip($config);

        if ($method === 'GET') {
            if (($_GET['accion'] ?? '') !== 'token') {
                throw new HttpError(404, 'not_found', 'Recurso no encontrado.');
            }
            $store->rateLimit('token', $ip, $config['limits']['token_per_10min'], 600);
            respond(200, ['ok' => true, 'token' => issue_token($config['secret'])]);
        }

        handle_submit($config, $store, $ip);
    } catch (HttpError $e) {
        foreach ($e->headers as $name => $value) {
            header($name . ': ' . $value);
        }
        $body = ['ok' => false, 'error' => $e->getMessage(), 'code' => $e->errorCode];
        if ($e->fields) {
            $body['fields'] = $e->fields;
        }
        respond($e->status, $body);
    } catch (\Throwable $e) {
        log_error($config, 'interno', get_class($e) . ': ' . $e->getMessage() . ' @' . basename($e->getFile()) . ':' . $e->getLine());
        respond(500, ['ok' => false, 'error' => MSG_GENERIC, 'code' => 'server']);
    }
}

/** @param array<string,mixed> $body */
function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/* -------------------------------------------------------------------------------------------------
 * Configuración (fuera de public_html)
 * ----------------------------------------------------------------------------------------------- */

/** @return array<string,mixed> */
function load_config(): array
{
    $candidates = [];
    $env = getenv('PLAGASTOP_MAIL_CONFIG');
    if (is_string($env) && $env !== '') {
        $candidates[] = $env;
    }
    $user = get_current_user();
    if ($user !== '' && preg_match('/^[a-z0-9_.-]+$/i', $user)) {
        $candidates[] = '/home/' . $user . '/plagastop-mail.php';
    }

    $path = null;
    foreach ($candidates as $candidate) {
        if (is_file($candidate) && is_readable($candidate)) {
            $path = $candidate;
            break;
        }
    }
    if ($path === null) {
        log_error(null, 'config', 'No se encontró plagastop-mail.php');
        throw new HttpError(503, 'unavailable', MSG_UNAVAILABLE);
    }
    if (inside_document_root($path)) {
        log_error(null, 'config', 'plagastop-mail.php está dentro del directorio público: no se usa.');
        throw new HttpError(503, 'unavailable', MSG_UNAVAILABLE);
    }

    /** @noinspection PhpIncludeInspection */
    $config = require $path;
    $problem = config_problem($config);
    if ($problem !== null) {
        log_error(null, 'config', $problem);
        throw new HttpError(503, 'unavailable', MSG_UNAVAILABLE);
    }

    $config['limits'] = array_merge([
        'token_per_10min' => 30,
        'submit_per_10min' => 5,
        'submit_per_day' => 15,
        'global_per_hour' => 60,
    ], is_array($config['limits'] ?? null) ? $config['limits'] : []);
    $config['retention_days'] = max(0, min(30, (int) ($config['retention_days'] ?? 7)));

    return $config;
}

/** @param mixed $c */
function config_problem($c): ?string
{
    if (!is_array($c)) {
        return 'El archivo de configuración no devuelve un arreglo.';
    }
    $smtp = $c['smtp'] ?? null;
    if (!is_array($smtp)) {
        return 'Falta la sección smtp.';
    }
    foreach (['host', 'username', 'password'] as $key) {
        if (!is_string($smtp[$key] ?? null) || $smtp[$key] === '' || strpos($smtp[$key], PLACEHOLDER) !== false) {
            return "smtp.$key sin completar.";
        }
    }
    $enc = $smtp['encryption'] ?? 'ssl';
    if (!in_array($enc, ['ssl', 'tls', 'none'], true)) {
        return 'smtp.encryption debe ser ssl, tls o none.';
    }
    if ($enc === 'none' && !in_array($smtp['host'], ['127.0.0.1', 'localhost'], true)) {
        return 'smtp.encryption = none solo se permite para pruebas locales.';
    }
    $port = (int) ($smtp['port'] ?? 0);
    $localTest = $enc === 'none';
    if ($localTest ? ($port < 1 || $port > 65535) : !in_array($port, [25, 465, 587, 2525], true)) {
        return 'smtp.port no válido.';
    }
    $from = $c['from']['email'] ?? '';
    if (!is_string($from) || !is_corporate_address($from)) {
        return 'from.email debe ser una casilla @' . RECIPIENT_DOMAIN . '.';
    }
    $recipients = $c['recipients'] ?? null;
    if (!is_array($recipients)) {
        return 'Falta la lista de destinatarios.';
    }
    foreach (ROUTES as $route) {
        $list = $recipients[$route] ?? null;
        if (!is_array($list) || !$list) {
            return "recipients.$route está vacío.";
        }
        foreach ($list as $address) {
            if (!is_string($address) || !is_corporate_address($address)) {
                return "recipients.$route contiene una dirección no permitida.";
            }
        }
    }
    $secret = $c['secret'] ?? '';
    if (!is_string($secret) || strlen($secret) < 32 || strpos($secret, PLACEHOLDER) !== false) {
        return 'secret debe tener al menos 32 caracteres aleatorios.';
    }
    if (!is_array($c['allowed_origins'] ?? null) || !$c['allowed_origins']) {
        return 'allowed_origins está vacío.';
    }
    $dir = $c['data_dir'] ?? '';
    if (!is_string($dir) || $dir === '' || strpos($dir, PLACEHOLDER) !== false) {
        return 'data_dir sin completar.';
    }
    if (inside_document_root($dir)) {
        return 'data_dir no puede estar dentro del directorio público.';
    }
    return null;
}

function is_corporate_address(string $address): bool
{
    return PHPMailer::validateAddress($address)
        && strtolower(substr($address, -strlen('@' . RECIPIENT_DOMAIN))) === '@' . RECIPIENT_DOMAIN;
}

function inside_document_root(string $path): bool
{
    $root = $_SERVER['DOCUMENT_ROOT'] ?? '';
    if ($root === '') {
        return false;
    }
    $root = realpath($root);
    $real = realpath($path);
    if ($real === false) {
        // Aún no existe (data_dir): se compara la ruta tal como viene.
        $real = $path;
    }
    if ($root === false) {
        return false;
    }
    $norm = static function (string $p): string {
        return rtrim(str_replace('\\', '/', strtolower($p)), '/') . '/';
    };
    return strpos($norm($real), $norm($root)) === 0;
}

/* -------------------------------------------------------------------------------------------------
 * Origen de la solicitud (complemento: el token y el Content-Type JSON son el control principal)
 * ----------------------------------------------------------------------------------------------- */

/** @param array<string,mixed> $config */
function check_request_origin(array $config): void
{
    $site = strtolower((string) ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? ''));
    if ($site === 'cross-site') {
        throw new HttpError(403, 'origin', MSG_GENERIC);
    }

    $allowed = array_map(static function ($o): string {
        return rtrim(strtolower((string) $o), '/');
    }, $config['allowed_origins']);

    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '') {
        if (!in_array(rtrim(strtolower($origin), '/'), $allowed, true)) {
            throw new HttpError(403, 'origin', MSG_GENERIC);
        }
        return;
    }

    $referer = (string) ($_SERVER['HTTP_REFERER'] ?? '');
    if ($referer !== '') {
        $parts = parse_url($referer);
        $refOrigin = isset($parts['scheme'], $parts['host'])
            ? strtolower($parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : ''))
            : '';
        if (!in_array($refOrigin, $allowed, true)) {
            throw new HttpError(403, 'origin', MSG_GENERIC);
        }
    }
}

/** @param array<string,mixed> $config */
function client_ip(array $config): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    // Solo si el sitio está detrás de un proxy conocido (p. ej. Cloudflare) se toma su encabezado.
    $header = $config['client_ip_header'] ?? null;
    if (is_string($header) && $header !== '') {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $header));
        $candidate = trim(explode(',', (string) ($_SERVER[$key] ?? ''))[0]);
        if (filter_var($candidate, FILTER_VALIDATE_IP)) {
            $ip = $candidate;
        }
    }
    return $ip !== '' ? $ip : 'desconocida';
}

/* -------------------------------------------------------------------------------------------------
 * Token firmado: prueba que la página se cargó, que pasó un tiempo mínimo y que no se reutiliza
 * ----------------------------------------------------------------------------------------------- */

function issue_token(string $secret): string
{
    $payload = time() . '.' . bin2hex(random_bytes(12));
    return $payload . '.' . hash_hmac('sha256', $payload, $secret);
}

/** @return string nonce del token válido */
function verify_token(string $token, string $secret): string
{
    if (!preg_match('/^(\d{10})\.([a-f0-9]{24})\.([a-f0-9]{64})$/', $token, $m)) {
        throw new HttpError(422, 'token_invalid', 'La sesión del formulario no es válida. Vuelve a intentarlo.');
    }
    if (!hash_equals(hash_hmac('sha256', $m[1] . '.' . $m[2], $secret), $m[3])) {
        throw new HttpError(422, 'token_invalid', 'La sesión del formulario no es válida. Vuelve a intentarlo.');
    }
    $age = time() - (int) $m[1];
    if ($age < TOKEN_MIN_AGE) {
        throw new HttpError(422, 'too_fast', 'Espera unos segundos y vuelve a enviar.');
    }
    if ($age > TOKEN_MAX_AGE) {
        throw new HttpError(422, 'token_expired', 'La sesión del formulario expiró. Vuelve a intentarlo.');
    }
    return $m[2];
}

/* -------------------------------------------------------------------------------------------------
 * Envío
 * ----------------------------------------------------------------------------------------------- */

/** @param array<string,mixed> $config */
function handle_submit(array $config, Store $store, string $ip): void
{
    $type = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
    if ($type !== 'application/json') {
        throw new HttpError(415, 'content_type', MSG_GENERIC);
    }
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > MAX_BODY_BYTES) {
        throw new HttpError(413, 'too_large', 'El mensaje es demasiado largo.');
    }

    $store->rateLimit('submit10', $ip, $config['limits']['submit_per_10min'], 600, 'Recibimos varias solicitudes seguidas. Espera unos minutos o llámanos.');
    $store->rateLimit('submitday', $ip, $config['limits']['submit_per_day'], 86400, 'Alcanzaste el máximo de solicitudes por hoy. Llámanos o escríbenos directamente.');

    $input = fopen('php://input', 'rb');
    $raw = $input ? (string) stream_get_contents($input, MAX_BODY_BYTES + 1) : '';
    if (strlen($raw) > MAX_BODY_BYTES) {
        throw new HttpError(413, 'too_large', 'El mensaje es demasiado largo.');
    }
    $data = json_decode($raw, true, 4);
    if (!is_array($data)) {
        throw new HttpError(400, 'bad_json', MSG_GENERIC);
    }

    // Honeypot: campo oculto que una persona no ve ni completa. Respuesta honesta, sin simular éxito.
    $trap = $data['sitio_web'] ?? '';
    if (!is_string($trap) || trim($trap) !== '') {
        throw new HttpError(422, 'rejected', 'No pudimos validar el envío. Llámanos o escríbenos directamente.');
    }

    $nonce = verify_token(is_string($data['ps_token'] ?? null) ? $data['ps_token'] : '', $config['secret']);

    $id = $data['ps_id'] ?? '';
    if (!is_string($id) || !preg_match('/^[A-Za-z0-9-]{16,64}$/', $id)) {
        throw new HttpError(400, 'bad_id', MSG_GENERIC);
    }

    $kind = $data['kind'] ?? '';
    if ($kind === 'cotizacion') {
        $lead = validate_quote($data);
        $route = 'cotizacion';
    } elseif ($kind === 'contacto') {
        $lead = validate_contact($data);
        $route = CONTACT_AREAS[$lead['area']]['route'];
    } else {
        throw new HttpError(400, 'bad_kind', MSG_GENERIC);
    }
    $lead['attribution'] = validate_attribution($data);

    // Reintento de una solicitud ya enviada (p. ej. se cortó la conexión antes de la respuesta): no se reenvía.
    $claim = $store->claim($id);
    if ($claim === 'sent') {
        respond(200, ['ok' => true]);
    }
    if ($claim === 'busy') {
        throw new HttpError(409, 'in_progress', 'Tu solicitud se está procesando. Espera unos segundos.');
    }

    if ($store->tokenUsed($nonce)) {
        $store->release($id);
        throw new HttpError(422, 'token_invalid', 'La sesión del formulario no es válida. Vuelve a intentarlo.');
    }

    try {
        $store->rateLimit('global', 'todas', $config['limits']['global_per_hour'], 3600, 'El formulario está recibiendo muchas solicitudes. Llámanos o escríbenos directamente.');
    } catch (HttpError $e) {
        $store->release($id);
        throw $e;
    }

    $recipients = array_values($config['recipients'][$route]);
    $record = $store->saveRecord($id, [
        'estado' => 'pendiente',
        'recibido' => date('c'),
        'tipo' => $kind,
        'destinatarios' => $recipients,
        'datos' => $lead,
    ], (int) $config['retention_days']);

    try {
        send_mail($config, $kind, $lead, $recipients, $id);
    } catch (\Throwable $e) {
        $store->release($id);
        $store->updateRecord($record, ['estado' => 'error', 'error' => 'Fallo SMTP (ver logs/errores.log)']);
        log_error($config, 'smtp', $e->getMessage() . ' · ref ' . substr($id, 0, 8));
        throw new HttpError(502, 'send_failed', 'El servidor de correo tuvo un problema temporal. Inténtalo de nuevo en unos minutos.');
    }

    $store->markSent($id);
    $store->markTokenUsed($nonce);
    $store->updateRecord($record, ['estado' => 'enviado', 'enviado' => date('c')]);
    respond(200, ['ok' => true]);
}

/* -------------------------------------------------------------------------------------------------
 * Validación
 * ----------------------------------------------------------------------------------------------- */

/**
 * Texto limpio: UTF-8 válido, sin caracteres de control (salvo saltos de línea si es multilínea),
 * espacios normalizados y con largo máximo.
 *
 * @param mixed $value
 * @param array<string,string> $errors
 */
function text($value, string $field, int $max, bool $multiline, array &$errors): string
{
    if ($value === null) {
        return '';
    }
    if (!is_string($value)) {
        $errors[$field] = 'Valor no válido.';
        return '';
    }
    if (!mb_check_encoding($value, 'UTF-8')) {
        $errors[$field] = 'Contiene caracteres no válidos.';
        return '';
    }
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    if ($multiline) {
        $value = (string) preg_replace('/[^\P{C}\n\t]/u', '', $value);
        $value = (string) preg_replace("/\n{3,}/", "\n\n", $value);
        $value = trim($value);
    } else {
        $value = (string) preg_replace('/\p{C}/u', ' ', $value);
        $value = trim((string) preg_replace('/\s+/u', ' ', $value));
    }
    if (mb_strlen($value, 'UTF-8') > $max) {
        $errors[$field] = "Usa como máximo $max caracteres.";
        return '';
    }
    return $value;
}

/**
 * @param array<string,mixed> $d
 * @param array<string,string> $errors
 */
function require_text(array $d, string $field, int $max, string $message, array &$errors, bool $multiline = false): string
{
    $value = text($d[$field] ?? null, $field, $max, $multiline, $errors);
    if ($value === '' && !isset($errors[$field])) {
        $errors[$field] = $message;
    }
    return $value;
}

/**
 * @param array<string,mixed> $d
 * @param array<string,string> $errors
 */
function email(array $d, array &$errors): string
{
    $value = text($d['correo'] ?? null, 'correo', 254, false, $errors);
    if ($value === '' && !isset($errors['correo'])) {
        $errors['correo'] = 'Ingresa tu correo.';
    } elseif ($value !== '' && (!filter_var($value, FILTER_VALIDATE_EMAIL) || !PHPMailer::validateAddress($value))) {
        $errors['correo'] = 'Revisa el correo: debe tener el formato nombre@empresa.cl.';
    }
    return $value;
}

/**
 * @param array<string,mixed> $d
 * @param array<string,string> $errors
 */
function phone(array $d, bool $required, array &$errors): string
{
    $value = text($d['telefono'] ?? null, 'telefono', 30, false, $errors);
    if ($value === '') {
        if ($required && !isset($errors['telefono'])) {
            $errors['telefono'] = 'Ingresa un teléfono para contactarte.';
        }
        return '';
    }
    $digits = strlen((string) preg_replace('/\D/', '', $value));
    if (!preg_match('/^[0-9+()\s.-]+$/', $value) || $digits < 8 || $digits > 12) {
        $errors['telefono'] = 'Revisa el teléfono: por ejemplo +56 9 1234 5678.';
    }
    return $value;
}

/**
 * Opción de una lista: debe existir en las opciones publicadas por el sitio (api/lib/form-options.json).
 *
 * @param array<string,mixed> $d
 * @param array<string,string> $errors
 * @return array{0:string,1:string} [valor, etiqueta]
 */
function option(array $d, string $field, string $group, bool $required, string $message, array &$errors): array
{
    $value = $d[$field] ?? '';
    if (!is_string($value) || $value === '') {
        if ($required) {
            $errors[$field] = $message;
        }
        return ['', ''];
    }
    $options = form_options();
    if (isset($options[$group])) {
        if (!isset($options[$group][$value])) {
            $errors[$field] = 'Selecciona una opción de la lista.';
            return ['', ''];
        }
        return [$value, (string) $options[$group][$value]];
    }
    // Sin el catálogo (despliegue incompleto) se acepta solo un identificador simple.
    if (!preg_match('/^[a-z0-9-]{1,80}$/', $value)) {
        $errors[$field] = 'Selecciona una opción de la lista.';
        return ['', ''];
    }
    return [$value, $value];
}

/** @return array<string,array<string,string>> */
function form_options(): array
{
    static $options = null;
    if ($options === null) {
        $raw = @file_get_contents(__DIR__ . '/form-options.json');
        $decoded = $raw !== false ? json_decode($raw, true) : null;
        $options = is_array($decoded) ? $decoded : [];
    }
    return $options;
}

/**
 * Registro del consentimiento: dos casillas obligatorias y separadas (Términos y condiciones y Política de
 * privacidad). Cada una llega con el instante ISO en que se marcó en el navegador y la versión del documento.
 * El servidor agrega su propia hora de registro, que es la que no depende del reloj del equipo del visitante.
 *
 * @param array<string,mixed> $d
 * @param array<string,string> $errors
 * @return array<string,array<string,string>>
 */
function consent(array $d, array &$errors): array
{
    $docs = [
        'terminos' => ['Términos y condiciones', 'Debes aceptar los Términos y condiciones para continuar.'],
        'privacidad' => ['Política de privacidad', 'Debes aceptar la Política de privacidad para continuar.'],
    ];
    $record = [];
    foreach ($docs as $key => $doc) {
        $at = $d[$key] ?? '';
        $version = $d['version_' . $key] ?? '';
        $ts = is_string($at) && preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/', $at) ? strtotime($at) : false;
        if ($ts === false || !is_string($version) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $version)) {
            $errors[$key] = $doc[1];
            continue;
        }
        $record[$key] = [
            'documento' => $doc[0],
            'version' => $version,
            'aceptado_segun_navegador' => gmdate('c', $ts),
            'registrado_por_servidor' => gmdate('c'),
        ];
    }
    return $record;
}

function chile_time(string $iso): string
{
    try {
        $date = new \DateTimeImmutable($iso);
        return $date->setTimezone(new \DateTimeZone('America/Santiago'))->format('d-m-Y H:i') . ' (hora de Chile)';
    } catch (\Exception $e) {
        return $iso;
    }
}

/**
 * @param array<string,string> $errors
 */
function fail_if_errors(array $errors): void
{
    if ($errors) {
        throw new HttpError(422, 'invalid', 'Revisa los datos del formulario.', $errors);
    }
}

/**
 * @param array<string,mixed> $d
 * @return array<string,mixed>
 */
function validate_quote(array $d): array
{
    $e = [];
    $instalacion = option($d, 'instalacion', 'facility', true, 'Selecciona el tipo de instalación.', $e);
    $servicio = option($d, 'servicio', 'service', true, 'Selecciona un servicio o elige "No lo sé".', $e);
    $urgencia = option($d, 'urgencia', 'urgency', false, '', $e);
    $lead = [
        'instalacion' => $instalacion[1],
        'servicio' => $servicio[1],
        'comuna' => require_text($d, 'comuna', 100, 'Indica la comuna o ciudad de la instalación.', $e),
        'urgencia' => $urgencia[1],
        'nombre' => require_text($d, 'nombre', 100, 'Ingresa tu nombre.', $e),
        'empresa' => require_text($d, 'empresa', 150, 'Ingresa el nombre de la empresa (o "Particular").', $e),
        'cargo' => text($d['cargo'] ?? null, 'cargo', 100, false, $e),
        'correo' => email($d, $e),
        'telefono' => phone($d, true, $e),
        'mensaje' => text($d['mensaje'] ?? null, 'mensaje', 3000, true, $e),
        'pagina' => text($d['page'] ?? null, 'page', 200, false, $e),
    ];
    $lead['consentimiento'] = consent($d, $e);
    unset($e['page']);
    fail_if_errors($e);
    return $lead;
}

/**
 * @param array<string,mixed> $d
 * @return array<string,mixed>
 */
function validate_contact(array $d): array
{
    $e = [];
    $area = $d['area'] ?? '';
    if (!is_string($area) || !isset(CONTACT_AREAS[$area])) {
        $e['area'] = 'Selecciona un área de la lista.';
        $area = '';
    }
    $lead = [
        'area' => $area,
        'area_nombre' => $area !== '' ? CONTACT_AREAS[$area]['label'] : '',
        'nombre' => require_text($d, 'nombre', 100, 'Ingresa tu nombre.', $e),
        'correo' => email($d, $e),
        'telefono' => phone($d, false, $e),
        'mensaje' => require_text($d, 'mensaje', 3000, 'Escribe tu consulta.', $e, true),
        'pagina' => text($d['page'] ?? null, 'page', 200, false, $e),
    ];
    $lead['consentimiento'] = consent($d, $e);
    unset($e['page']);
    fail_if_errors($e);
    return $lead;
}

/**
 * Atribución de campaña: opcional; lo que no cumpla el formato simplemente se descarta.
 *
 * @param array<string,mixed> $d
 * @return array<string,string>
 */
function validate_attribution(array $d): array
{
    $out = [];
    foreach (ATTRIBUTION_KEYS as $key) {
        $ignored = [];
        $value = text($d[$key] ?? null, $key, 200, false, $ignored);
        if ($value !== '' && !$ignored) {
            $out[$key] = $value;
        }
    }
    return $out;
}

/* -------------------------------------------------------------------------------------------------
 * Correo
 * ----------------------------------------------------------------------------------------------- */

/**
 * @param array<string,mixed> $config
 * @param array<string,mixed> $lead
 * @param string[] $recipients
 */
function send_mail(array $config, string $kind, array $lead, array $recipients, string $id): void
{
    $smtp = $config['smtp'];
    $timeout = max(5, min(30, (int) ($smtp['timeout'] ?? 15)));
    @set_time_limit($timeout * 3 + 10);

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = (string) $smtp['host'];
    $mail->Port = (int) $smtp['port'];
    $mail->SMTPAuth = true;
    $mail->Username = (string) $smtp['username'];
    $mail->Password = (string) $smtp['password'];
    $enc = $smtp['encryption'] ?? 'ssl';
    if ($enc === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($enc === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mail->SMTPSecure = '';
        $mail->SMTPAutoTLS = false;
    }
    if (($smtp['verify_peer'] ?? true) === false) {
        // Solo si el certificado del servidor de correo no coincide con el host (ver instructivo).
        $mail->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]];
    }
    $mail->Timeout = $timeout;
    $mail->getSMTPInstance()->Timelimit = $timeout;
    $mail->SMTPDebug = 0;
    $mail->SMTPKeepAlive = false;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_QUOTED_PRINTABLE;
    $mail->XMailer = ' ';

    $fromEmail = (string) $config['from']['email'];
    $fromName = clean_header((string) ($config['from']['name'] ?? 'Sitio web Plagastop'));
    $mail->setFrom($fromEmail, $fromName, true);
    $mail->Sender = $fromEmail;
    foreach ($recipients as $address) {
        $mail->addAddress($address);
    }
    // El correo del visitante solo como Reply-To (ya validado), nunca como remitente.
    $mail->addReplyTo((string) $lead['correo'], clean_header((string) $lead['nombre']));

    $mail->Subject = clean_header(subject($kind, $lead), 140);
    $mail->isHTML(false);
    $mail->Body = body($kind, $lead, $id);
    $mail->addCustomHeader('X-Plagastop-Formulario', $kind);

    try {
        $mail->send();
    } catch (MailException $e) {
        throw new \RuntimeException($mail->ErrorInfo !== '' ? $mail->ErrorInfo : $e->getMessage(), 0, $e);
    }
}

function clean_header(string $value, int $max = 80): string
{
    $value = trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value));
    return mb_substr($value, 0, $max, 'UTF-8');
}

/** @param array<string,mixed> $lead */
function subject(string $kind, array $lead): string
{
    if ($kind === 'cotizacion') {
        return 'Cotización web: ' . $lead['servicio'] . ' · ' . $lead['empresa'];
    }
    return 'Contacto web (' . $lead['area_nombre'] . '): ' . $lead['nombre'];
}

/** @param array<string,mixed> $lead */
function body(string $kind, array $lead, string $id): string
{
    $line = static function (string $label, string $value): string {
        return $label . ': ' . ($value !== '' ? $value : '—') . "\n";
    };

    $out = $kind === 'cotizacion'
        ? "Nueva solicitud de cotización desde el sitio web.\n\n"
        : "Nuevo mensaje desde el formulario de contacto del sitio web.\n\n";

    $out .= "DATOS DE CONTACTO\n";
    $out .= $line('Nombre', $lead['nombre']);
    if ($kind === 'cotizacion') {
        $out .= $line('Empresa', $lead['empresa']);
        $out .= $line('Cargo', $lead['cargo']);
    }
    $out .= $line('Correo', $lead['correo']);
    $out .= $line('Teléfono', $lead['telefono']);

    if ($kind === 'cotizacion') {
        $out .= "\nSOLICITUD\n";
        $out .= $line('Tipo de instalación', $lead['instalacion']);
        $out .= $line('Servicio', $lead['servicio']);
        $out .= $line('Comuna o ciudad', $lead['comuna']);
        $out .= $line('Urgencia', $lead['urgencia'] !== '' ? $lead['urgencia'] : 'No indicada');
        $out .= "\nMensaje:\n" . ($lead['mensaje'] !== '' ? $lead['mensaje'] : '—') . "\n";
    } else {
        $out .= $line('Área', $lead['area_nombre']);
        $out .= "\nMensaje:\n" . $lead['mensaje'] . "\n";
    }

    $out .= "\nORIGEN\n";
    $out .= $line('Página', $lead['pagina']);
    $attribution = $lead['attribution'] ?? [];
    if ($attribution) {
        foreach ($attribution as $key => $value) {
            $out .= $line($key, $value);
        }
    } else {
        $out .= "Campaña: sin datos de campaña\n";
    }
    try {
        $now = new \DateTimeImmutable('now', new \DateTimeZone('America/Santiago'));
        $out .= $line('Recibido', $now->format('d-m-Y H:i') . ' (hora de Chile)');
    } catch (\Exception $e) {
        $out .= $line('Recibido', date('c'));
    }
    $out .= $line('Referencia', strtoupper(substr($id, 0, 8)));
    $out .= "\nCONSENTIMIENTO (casillas marcadas por el remitente)\n";
    foreach ($lead['consentimiento'] ?? [] as $c) {
        $out .= $c['documento'] . ' (versión ' . $c['version'] . '): aceptado el '
            . chile_time($c['aceptado_segun_navegador']) . ' según su navegador; registrado por el servidor el '
            . chile_time($c['registrado_por_servidor']) . ".\n";
    }
    $out .= "\nPara responder, usa «Responder»: la respuesta va directo al correo del cliente.\n";

    return $out;
}

/* -------------------------------------------------------------------------------------------------
 * Almacenamiento fuera de public_html: límites, duplicados, tokens usados y registro temporal
 * ----------------------------------------------------------------------------------------------- */

final class Store
{
    /** @var string */
    private $dir;

    public function __construct(string $dir)
    {
        $this->dir = rtrim($dir, '/\\');
        foreach (['', '/limites', '/envios', '/solicitudes', '/logs'] as $sub) {
            $path = $this->dir . $sub;
            if (!is_dir($path) && !@mkdir($path, 0700, true) && !is_dir($path)) {
                throw new \RuntimeException('No se pudo crear ' . $sub . ' en data_dir');
            }
        }
        $deny = $this->dir . '/.htaccess';
        if (!is_file($deny)) {
            // Por si data_dir quedara accesible por error: se niega todo acceso web.
            @file_put_contents($deny, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
        }
    }

    /** Límite de solicitudes por ventana deslizante, con bloqueo de archivo (válido en hosting compartido). */
    public function rateLimit(string $bucket, string $key, int $max, int $window, string $message = 'Demasiadas solicitudes. Espera unos minutos.'): void
    {
        $file = $this->dir . '/limites/' . $bucket . '-' . hash('sha256', $bucket . '|' . $key) . '.json';
        $fh = fopen($file, 'c+');
        if ($fh === false) {
            throw new \RuntimeException('No se pudo abrir el archivo de límites');
        }
        try {
            flock($fh, LOCK_EX);
            $now = time();
            $hits = json_decode((string) stream_get_contents($fh), true);
            $hits = is_array($hits) ? array_values(array_filter($hits, static function ($t) use ($now, $window): bool {
                return is_int($t) && $t > $now - $window;
            })) : [];
            if (count($hits) >= $max) {
                $retry = max(1, (int) min($hits) + $window - $now);
                throw new HttpError(429, 'rate_limited', $message, [], ['Retry-After' => (string) $retry]);
            }
            $hits[] = $now;
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, json_encode($hits));
        } finally {
            flock($fh, LOCK_UN);
            fclose($fh);
        }
    }

    /**
     * Reserva el identificador de la solicitud de forma atómica.
     * @return string 'new' | 'sent' (ya enviada) | 'busy' (otro envío en curso)
     */
    public function claim(string $id): string
    {
        $file = $this->idFile($id);
        $fh = fopen($file, 'c+');
        if ($fh === false) {
            throw new \RuntimeException('No se pudo abrir el registro de envíos');
        }
        try {
            flock($fh, LOCK_EX);
            $state = trim((string) stream_get_contents($fh));
            $now = time();
            if (preg_match('/^(sent|sending):(\d+)$/', $state, $m)) {
                $age = $now - (int) $m[2];
                if ($m[1] === 'sent' && $age < DEDUPE_WINDOW) {
                    return 'sent';
                }
                if ($m[1] === 'sending' && $age < SENDING_STALE_AFTER) {
                    return 'busy';
                }
            }
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, 'sending:' . $now);
            return 'new';
        } finally {
            flock($fh, LOCK_UN);
            fclose($fh);
        }
    }

    public function markSent(string $id): void
    {
        file_put_contents($this->idFile($id), 'sent:' . time(), LOCK_EX);
    }

    public function release(string $id): void
    {
        @unlink($this->idFile($id));
    }

    public function tokenUsed(string $nonce): bool
    {
        return is_file($this->dir . '/envios/token-' . hash('sha256', $nonce));
    }

    public function markTokenUsed(string $nonce): void
    {
        file_put_contents($this->dir . '/envios/token-' . hash('sha256', $nonce), (string) time(), LOCK_EX);
    }

    /**
     * Copia temporal de la solicitud (respaldo ante fallos de SMTP o de entrega durante la migración del
     * correo). Con retention_days = 0 no se guarda nada.
     *
     * @param array<string,mixed> $record
     */
    public function saveRecord(string $id, array $record, int $retentionDays): ?string
    {
        if ($retentionDays <= 0) {
            return null;
        }
        $file = $this->dir . '/solicitudes/' . date('Ymd-His') . '-' . substr(hash('sha256', $id), 0, 12) . '.json';
        file_put_contents($file, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
        @chmod($file, 0600);
        return $file;
    }

    /** @param array<string,mixed> $changes */
    public function updateRecord(?string $file, array $changes): void
    {
        if ($file === null || !is_file($file)) {
            return;
        }
        $record = json_decode((string) file_get_contents($file), true);
        if (!is_array($record)) {
            return;
        }
        file_put_contents($file, json_encode(array_merge($record, $changes), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
    }

    /** Limpieza ocasional: borra solicitudes vencidas y registros de límites/envíos antiguos. */
    public function housekeeping(int $retentionDays): void
    {
        if (random_int(1, 50) !== 1) {
            return;
        }
        $now = time();
        $this->purge('/solicitudes/*.json', $now - $retentionDays * 86400);
        $this->purge('/limites/*.json', $now - 2 * 86400);
        $this->purge('/envios/*', $now - 2 * DEDUPE_WINDOW);
    }

    private function purge(string $pattern, int $olderThan): void
    {
        foreach (glob($this->dir . $pattern) ?: [] as $file) {
            if (is_file($file) && filemtime($file) < $olderThan) {
                @unlink($file);
            }
        }
    }

    private function idFile(string $id): string
    {
        return $this->dir . '/envios/' . hash('sha256', 'id|' . $id);
    }

    public function logFile(): string
    {
        return $this->dir . '/logs/errores.log';
    }
}

/**
 * Registro interno sin datos del visitante. Nunca se muestra al público.
 *
 * @param array<string,mixed>|null $config
 */
function log_error(?array $config, string $type, string $message): void
{
    $line = '[' . date('c') . "] $type: " . str_replace(["\r", "\n"], ' ', $message) . "\n";
    $dir = is_array($config) && is_string($config['data_dir'] ?? null) ? rtrim($config['data_dir'], '/\\') . '/logs' : null;
    if ($dir !== null && is_dir($dir) && @file_put_contents($dir . '/errores.log', $line, FILE_APPEND | LOCK_EX) !== false) {
        return;
    }
    error_log('plagastop-forms ' . trim($line));
}
