<?php
/**
 * Plagastop · endpoint de los formularios del sitio. La lógica está en lib/handler.php y la configuración
 * (SMTP, destinatarios, clave) en /home/<usuario>/plagastop-mail.php, fuera de public_html.
 * Ver docs/formularios-produccion.md.
 */

declare(strict_types=1);

define('PLAGASTOP_FORMS', true);

// Ningún error de PHP llega al visitante: se registran en el log del servidor.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

require __DIR__ . '/lib/handler.php';

\Plagastop\Forms\run();
