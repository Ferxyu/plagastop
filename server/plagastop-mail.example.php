<?php
/**
 * Plagastop · configuración del envío de formularios — PLANTILLA SIN SECRETOS.
 *
 * Cómo usarla (detalle en docs/formularios-produccion.md):
 *  1. En cPanel → Administrador de archivos, crea este archivo en la carpeta de inicio de la cuenta,
 *     FUERA de public_html:   /home/hnsxoqxe/plagastop-mail.php
 *  2. Pega este contenido y reemplaza cada valor marcado con COMPLETAR.
 *  3. Permisos del archivo: 0600 (o 0640 si el servidor lo requiere).
 *
 * Nunca subas el archivo con datos reales al repositorio ni lo copies dentro de public_html:
 * el endpoint se niega a usarlo si está dentro del directorio público.
 */

return [
    // Servidor SMTP de la casilla remitente (cPanel → Cuentas de correo → web@plagastop.cl → Conectar dispositivos).
    'smtp' => [
        'host' => 'mail.plagastop.cl',     // o el nombre del servidor que indique cPanel (ver instructivo)
        'port' => 465,                     // 465 con 'ssl' (recomendado) · 587 con 'tls'
        'encryption' => 'ssl',             // 'ssl' | 'tls'
        'username' => 'web@plagastop.cl',
        'password' => 'COMPLETAR_EN_EL_SERVIDOR',
        'timeout' => 15,                   // segundos por conexión y por comando SMTP
        'verify_peer' => true,             // dejar en true; ver instructivo si el certificado no coincide
    ],

    // Remitente: siempre una casilla propia. El correo del visitante va solo como Reply-To.
    'from' => [
        'email' => 'web@plagastop.cl',
        'name' => 'Sitio web Plagastop',
    ],

    // Lista permitida de destinatarios (solo casillas @plagastop.cl). El visitante nunca elige direcciones:
    // el formulario envía un tipo y un área, y el servidor los traduce con esta tabla.
    'recipients' => [
        'cotizacion' => ['areacomercial@plagastop.cl'],
        'contacto_comercial' => ['areacomercial@plagastop.cl'],
        'contacto_secretaria' => ['secretaria@plagastop.cl'],
    ],

    // Dominios desde los que se aceptan envíos.
    'allowed_origins' => [
        'https://plagastop.cl',
        'https://www.plagastop.cl',
    ],

    // Clave para firmar los tokens del formulario: 64 caracteres aleatorios, distinta en cada instalación.
    // Genérala con el instructivo (no la reutilices ni la publiques).
    'secret' => 'COMPLETAR_CON_64_CARACTERES_ALEATORIOS',

    // Carpeta privada para límites por IP, control de duplicados, registro temporal y log de errores.
    // FUERA de public_html. El endpoint la crea con permisos 0700 si no existe.
    'data_dir' => '/home/hnsxoqxe/plagastop-data',

    // Días que se guarda la copia de cada solicitud (respaldo ante fallos de envío o de entrega).
    // 0 = no guardar copias. Máximo 30.
    'retention_days' => 7,

    'limits' => [
        'token_per_10min' => 30,   // aperturas de formulario por IP
        'submit_per_10min' => 5,   // envíos por IP
        'submit_per_day' => 15,    // envíos por IP en 24 h
        'global_per_hour' => 60,   // correos por hora en total (protege la cuota SMTP del hosting)
    ],

    // Solo si el sitio queda detrás de un proxy (p. ej. Cloudflare): 'CF-Connecting-IP'. Si no, null.
    'client_ip_header' => null,
];
