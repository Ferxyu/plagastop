# Formularios en producción (BanaHosting · cPanel)

> ## Modo activo: WhatsApp (temporal)
>
> Mientras termina la migración del correo BlueHosting → BanaHosting, **los formularios funcionan por WhatsApp**
> (`VITE_FORM_METHOD=whatsapp` en `.env.production`). Al validar, abren `https://wa.me/56977937824?text=…` con los
> datos preparados. La persona debe presionar **Enviar** en WhatsApp: el sitio no confirma recepción ni redirige a
> `/cotizar/gracias`. En este modo no se llama a `/api/enviar.php`, no se necesitan credenciales SMTP y no es
> obligatorio subir la carpeta `api/`.
>
> - Mensajes: `app/lib/whatsapp.ts` (`quoteMessage`, `contactMessage`). Solo incluyen los campos con valor.
> - Analítica: `quote_whatsapp_click` y `contact_whatsapp_click`. Registran la **intención** de continuar a WhatsApp,
>   no una solicitud recibida, y no llevan datos personales.
>
> **Para volver al correo** (cuando la migración termine y las pruebas de las secciones 2 a 7 pasen): cambia a
> `VITE_FORM_METHOD=api` en `.env.production`, recompila y sube `build/client` completo, incluida `api/`. Los formularios
> no requieren cambios: el envío por correo, la confirmación y `/cotizar/gracias` vuelven a activarse solos.
>
> ### Consentimiento y documentos legales
>
> - Ambos formularios piden **dos casillas obligatorias y separadas**: Términos y condiciones (`/terminos`) y Política de
>   privacidad (`/privacidad`), cada una con su enlace, que abre en una pestaña nueva para no perder lo escrito.
> - Al marcar una casilla se guarda la fecha y hora; al desmarcarla, se borra.
> - **Registro:** la solicitud lleva un bloque «CONSENTIMIENTO» con el documento, su versión y la fecha y hora de
>   aceptación. En modo WhatsApp va dentro del mensaje que envía la persona, que además lleva el sello de hora de WhatsApp.
>   En modo `api` va en el correo y en la copia del servidor, junto con la hora registrada por el servidor.
> - **Versiones:** se definen en `app/content/legal.ts`. Al cambiar el texto de un documento, actualiza su fecha ahí: la
>   página muestra «Última actualización» y las nuevas solicitudes registran la versión nueva.
> - **Cookies:** hoy el sitio no instala cookies (no hay analítica activa), por eso no hay aviso de cookies. Antes de
>   definir `VITE_GTM_ID` u otra herramienta de medición, hay que agregar el aviso de consentimiento y actualizar `/cookies`.
> - Los tres textos están marcados como **pendientes de revisión legal**.
>
> Lo que sigue en este documento describe el modo `api` (correo).

Cómo funcionan los formularios del sitio, qué hay que configurar en el servidor y cómo probarlos antes de publicar.
El sitio sigue siendo estático (`ssr: false`, páginas prerenderizadas): no necesita Node.js en producción.

> **Estado:** el código está listo y probado en local (PHP 7.4 y 8.3, SMTP de prueba, navegador real).
> **Falta, en el servidor:** crear la casilla `web@plagastop.cl`, cargar sus credenciales y hacer las pruebas reales
> de la sección 7. **No publicar** el sitio nuevo hasta que esas pruebas pasen.

---

## 1. Cómo funciona

```
Navegador (React)                         BanaHosting (mismo dominio)
─────────────────                         ───────────────────────────────────────────────
Formulario se abre ── GET  /api/enviar.php?accion=token ──▶ token firmado (válido 3 s – 4 h)
"Enviar"           ── POST /api/enviar.php (JSON)       ──▶ valida → SMTP autenticado (web@) → { ok: true }
                                                            │
  /cotizar/gracias o "Recibimos tu mensaje"  ◀── solo si ───┘  la respuesta es 2xx y { ok: true }
```

| Formulario | Dónde | Destinatario (definido en el servidor) |
|---|---|---|
| Cotización (2 pasos) | `/cotizar`, `/lp/*` | `areacomercial@plagastop.cl` |
| Contacto · Área Comercial | `/contacto` | `areacomercial@plagastop.cl` |
| Contacto · Secretaría | `/contacto` | `secretaria@plagastop.cl` |

- Remitente SMTP y `From`: `web@plagastop.cl`. El correo del visitante va **solo** en `Reply-To`: al presionar «Responder»
  la respuesta le llega directo.
- El visitante nunca indica direcciones: el formulario envía un tipo (`cotizacion`/`contacto`) y un área
  (`comercial`/`secretaria`), y el servidor los traduce con su lista permitida. Solo se aceptan casillas `@plagastop.cl`.
- Los botones «Solicitar cotización» (encabezado, menú móvil y barra móvil) llevan a `/cotizar`.

### Archivos

| Archivo | Qué es |
|---|---|
| `public/api/enviar.php` | Endpoint público (se copia a `build/client/api/` al compilar) |
| `public/api/lib/handler.php` | Lógica: validación, anti-spam, límites, registro y envío |
| `public/api/lib/PHPMailer/` | PHPMailer 7.2.0 (LGPL 2.1), incluido sin Composer |
| `public/api/.htaccess` | Desactiva reescrituras en `/api`, solo deja accesible `enviar.php` |
| `public/api/lib/.htaccess` | Bloquea todo acceso web a la biblioteca |
| `app/routes/form-options.json.ts` | Genera `api/lib/form-options.json` al compilar: opciones válidas del formulario (las mismas listas del sitio) |
| `server/plagastop-mail.example.php` | **Plantilla** de configuración sin secretos (no se publica) |
| `server/probar-envio.mjs` | Script de prueba de envío real (sección 7) |
| `app/lib/forms.ts` | Envío desde el navegador: token, timeout, `ok: true`, reintento, anti doble clic |
| `.env.production` | `VITE_FORM_ENDPOINT=/api/enviar.php` (público, sin secretos) |

### Protecciones

- Solo `GET` (token) y `POST`; sin cabeceras CORS (otro dominio no puede llamar al endpoint desde un navegador).
- `Content-Type: application/json` obligatorio y cuerpo de máximo 16 KB.
- Origen: rechaza `Sec-Fetch-Site: cross-site` y `Origin`/`Referer` ajenos. Es un control adicional, no el único.
- **Token firmado** (HMAC con la clave del servidor): prueba que se abrió la página, exige al menos 3 s entre abrir y enviar,
  vence a las 4 h y es de un solo uso.
- **Honeypot**: campo oculto `sitio_web`. Si llega con contenido, se rechaza con un error honesto (no se simula éxito).
- **Límites** (archivos con bloqueo, fuera de `public_html`): 30 tokens y 5 envíos por IP cada 10 min, 15 envíos por IP al día
  y 60 correos por hora en total. Responde `429` con `Retry-After`.
- Validación estricta de cada campo en el servidor (tipos, largo, UTF-8, correo, teléfono, opciones permitidas, consentimiento);
  limpieza de caracteres de control y de saltos de línea en encabezados. Errores `422` con el detalle por campo.
- **Duplicados**: cada solicitud lleva un identificador; si la respuesta se pierde y la persona reintenta, no se reenvía.
- Errores internos (SMTP, configuración) **nunca** se muestran: van a `plagastop-data/logs/errores.log`.

Respuestas: `200 { "ok": true }` · error: `{ "ok": false, "error": "mensaje para el visitante", "code": "..." }` con
`400/405/413/415/422/429/500/502/503` según el caso.

---

## 2. Crear la casilla `web@plagastop.cl` en cPanel

1. cPanel → **Cuentas de correo electrónico** → **Crear**.
2. Dominio `plagastop.cl`, usuario `web`, contraseña larga generada por cPanel (guárdala en el gestor de contraseñas
   de la empresa; **no** la envíes por chat ni correo).
3. Almacenamiento: 250 MB o más (recibirá rebotes o respuestas automáticas).
4. Abre la casilla → **Conectar dispositivos** (Connect Devices) y anota la **«Configuración SSL/TLS segura»**:
   servidor saliente (SMTP) y puerto **465**.

### Migración BlueHosting → BanaHosting: revisar antes de probar

- **Servidor SMTP**: mientras el DNS de `mail.plagastop.cl` apunte a BlueHosting, ese nombre no sirve para la casilla nueva.
  Usa el **nombre del servidor de BanaHosting** que muestra «Conectar dispositivos» (algo como `servidorXX.banahosting.com`).
  Ese nombre tiene certificado válido, así que `verify_peer` puede quedar en `true`.
- **Enrutamiento de correo** (cPanel → *Email Routing*): si el dominio está como **«Intercambiador de correo local»** mientras
  los MX siguen en BlueHosting, los correos para `areacomercial@` y `secretaria@` **se quedan en los buzones de BanaHosting**
  y no llegan a donde se leen hoy. El SMTP responde «aceptado» igual. Revisa en qué servidor se leen los correos en este momento
  y, si es necesario, que el enrutamiento corresponda (**«Remoto»** mientras los MX sigan en BlueHosting). **No cambies MX, SPF,
  DKIM, DMARC ni nameservers** desde aquí: eso lo define quien lleva la migración.
- Si el certificado del servidor no coincide con el nombre que uses, primero prueba con el nombre del servidor.
  `verify_peer => false` es el último recurso, y solo temporal.

---

## 3. Plantilla de configuración

La plantilla está en [`server/plagastop-mail.example.php`](../server/plagastop-mail.example.php). Valores que hay que completar:

| Clave | Valor |
|---|---|
| `smtp.host` | Servidor saliente de «Conectar dispositivos» (ver arriba) |
| `smtp.port` / `smtp.encryption` | `465` / `ssl` (o `587` / `tls`) |
| `smtp.username` | `web@plagastop.cl` |
| `smtp.password` | Contraseña de la casilla |
| `secret` | 64 caracteres aleatorios (abajo) |
| `data_dir` | `/home/hnsxoqxe/plagastop-data` (fuera de `public_html`) |

El resto ya trae los valores acordados (destinatarios, remitente, dominios, límites, 7 días de retención).

Para generar `secret` en tu computador, usa uno de estos comandos:

```powershell
# PowerShell
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```
```bash
# Node (cualquier sistema)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 4. Cargar las credenciales de forma segura

1. cPanel → **Administrador de archivos** → carpeta de inicio **`/home/hnsxoqxe`** (la que **contiene** `public_html`,
   no la de adentro).
2. **+ Archivo** → `plagastop-mail.php` → editar → pegar la plantilla → completar los valores → guardar.
3. Clic derecho → **Cambiar permisos** → `600` (lectura y escritura solo para el dueño). Si el sitio muestra
   «El formulario no está disponible», prueba con `640`.
4. No hace falta crear `plagastop-data/`: el endpoint la crea con permisos `700` en el primer uso.
   Si no puede, créala a mano con permisos `700`.
5. Comprueba que **no** exista ninguna copia de `plagastop-mail.php` dentro de `public_html` (el endpoint se niega a usarla).

El endpoint busca la configuración en `/home/<usuario>/plagastop-mail.php` (el usuario dueño de los archivos). Para otra ruta,
define la variable de entorno `PLAGASTOP_MAIL_CONFIG` en el servidor.

**Requisitos de PHP** (cPanel → *Seleccionar versión de PHP*): PHP **7.4 o superior** (recomendado 8.2/8.3) con las extensiones
`openssl`, `mbstring`, `json`, `filter` y `ctype` (vienen activas por defecto en cPanel).

---

## 5. Compilar con `VITE_FORM_ENDPOINT`

El valor de producción ya está en `.env.production`, así que basta con:

```powershell
npm run build
```

Para comprobar que quedó incluido en el sitio compilado:

```powershell
Select-String -Path build\client\assets\*.js -Pattern "/api/enviar.php" -List | Select-Object Path
```

Para usar otro endpoint (por ejemplo, un subdominio de pruebas) sin tocar el archivo:

```powershell
$env:VITE_FORM_ENDPOINT = "/api/enviar.php"; npm run build
```

`VITE_FORM_ENDPOINT` es **pública** (queda en el JavaScript). Nunca pongas credenciales en variables `VITE_`.
En `npm run dev` no hay PHP: los formularios muestran «El formulario aún no está disponible» y no envían nada.

### Qué subir

Todo el contenido de `build/client/` va a `public_html/`, incluida la carpeta `api/` con sus archivos `.htaccess`
(activa «Mostrar archivos ocultos» en el Administrador de archivos para verlos). `server/` y `docs/` **no** se suben.

### `.htaccess` de la raíz

El proyecto no trae un `.htaccess` para la raíz y este cambio no modifica el que exista en el servidor.
`api/.htaccess` ya desactiva las reescrituras dentro de `/api`. Si en la raíz hay reglas que mandan todo al HTML
(fallback de una SPA), agrega esta línea **antes** de esas reglas, como resguardo:

```apache
RewriteRule ^api/ - [L]
```

No toques reglas de otros dominios o subdominios alojados en la misma cuenta.

---

## 6. Antes de publicar el sitio: probar solo el endpoint

Puedes subir **solo la carpeta `build/client/api/`** a `public_html/api/` sin reemplazar el sitio actual: son archivos nuevos
y no sobrescriben nada. Así pruebas el correo real antes de publicar las páginas nuevas.

Revisiones rápidas (desde el navegador o con `curl`):

| URL | Debe responder |
|---|---|
| `https://plagastop.cl/api/enviar.php?accion=token` | `{"ok":true,"token":"..."}` |
| `https://plagastop.cl/api/enviar.php` | `{"ok":false,...,"code":"not_found"}` (404) |
| `https://plagastop.cl/api/lib/handler.php` | 403 o 404, **sin contenido** |
| `https://plagastop.cl/api/lib/form-options.json` | 403 |
| `https://plagastop.cl/plagastop-mail.php` | 404 (el archivo está fuera de `public_html`) |

Si el token responde `503` con «El formulario no está disponible», falta la configuración o tiene algo incompleto.
El motivo exacto está en `/home/hnsxoqxe/plagastop-data/logs/errores.log`, o en el `error_log` de `public_html/api/`
si `data_dir` todavía no existe.

---

## 7. Pruebas de envío real

«Aceptado» por el SMTP **no** garantiza que el correo llegó, sobre todo durante la migración. Cada prueba se da por buena
solo cuando el correo aparece en la bandeja correspondiente.

**A. Script (desde tu computador, con Node instalado):**

```powershell
node server/probar-envio.mjs https://plagastop.cl
```

Envía tres correos marcados `[PRUEBA]`: cotización, contacto comercial y contacto secretaría. Muestra la referencia de cada uno.

**B. En el navegador** (una vez publicado el sitio): completa `/cotizar`, `/contacto` con Área Comercial y `/contacto` con Secretaría.

**Revisar en cada bandeja** (en el webmail o programa donde se leen hoy los correos):

- [ ] Llegó a `areacomercial@` la cotización y el contacto comercial; a `secretaria@` el de Secretaría, y **solo** ahí.
- [ ] El remitente es «Sitio web Plagastop <web@plagastop.cl>».
- [ ] «Responder» abre un correo dirigido al visitante (no a `web@`).
- [ ] Tildes y «ñ» se ven bien en el asunto y en el cuerpo.
- [ ] No llegó a spam. Si llega a spam, revisa con quien lleva el dominio que SPF y DKIM autoricen al servidor de BanaHosting.
      Esto **no** se cambia desde este proyecto.
- [ ] En `/home/hnsxoqxe/plagastop-data/solicitudes/` hay una copia por envío con `"estado": "enviado"`.

**Pruebas de fallo** (opcionales, recomendadas):

- [ ] Con una contraseña incorrecta en la configuración, el formulario muestra el aviso de error con el teléfono, **no** la
      confirmación, y `errores.log` registra el fallo SMTP. Restaura la contraseña después.
- [ ] Varios clics seguidos en «Enviar» producen **un** solo correo.
- [ ] Más de 5 envíos en 10 minutos desde la misma conexión muestran «Recibimos varias solicitudes seguidas».

---

## 8. Checklist de seguridad y funcionamiento

**Seguridad**
- [ ] `plagastop-mail.php` está en `/home/hnsxoqxe/`, fuera de `public_html`, con permisos `600`/`640`.
- [ ] El repositorio no tiene contraseñas: `plagastop-mail.php` y `plagastop-data/` están en `.gitignore` y solo se versiona la plantilla.
- [ ] `secret` es único, de 64 caracteres, y no se reutiliza en otros sistemas.
- [ ] `/api/lib/*` responde 403/404 sin contenido; `/api/` no lista archivos.
- [ ] `plagastop-data/` está fuera de `public_html` (el endpoint se niega a usarla si no).
- [ ] La respuesta del endpoint no trae `Access-Control-Allow-Origin`.
- [ ] `verify_peer` está en `true`.
- [ ] Los errores del endpoint no muestran detalles internos al visitante.

**Funcionamiento**
- [ ] `npm run build` incluye `/api/enviar.php` en el JavaScript (sección 5).
- [ ] Se subió `api/` completa, con sus dos `.htaccess`.
- [ ] Token responde `200` en `https://plagastop.cl` **y** en `https://www.plagastop.cl` (ambos están en `allowed_origins`).
- [ ] Los tres destinos reciben su correo (sección 7) en la bandeja que realmente se lee.
- [ ] `/cotizar/gracias` aparece solo después de un envío exitoso.
- [ ] Los botones «Solicitar cotización» llevan a `/cotizar`.
- [ ] La landing `/lp/control-de-plagas-empresas` trae precargado «Manejo Integrado de Plagas».

**Mantención**
- Copias de solicitudes: se borran solas a los `retention_days` (7). Para revisar una que falló, abre
  `plagastop-data/solicitudes/` y busca `"estado": "error"`. Responde al cliente desde el correo comercial.
- Spam: si empiezan a llegar envíos automáticos, el siguiente paso es Cloudflare Turnstile (gratuito, sección 9).

---

## 9. Decisiones y pendientes

- **Cloudflare Turnstile: no se incorporó por ahora.** El token firmado con edad mínima, el honeypot, los límites por IP y el
  límite global cubren el spam habitual de un formulario B2B, sin agregar un servicio externo ni scripts de terceros.
  Si llega spam real, se agrega el widget en los dos formularios y la verificación obligatoria en `handler.php`, con la clave
  secreta en `plagastop-mail.php`.
- **Registro temporal de solicitudes:** cada envío queda 7 días en `plagastop-data/solicitudes/` (fuera de la web, permisos
  `600`) como respaldo ante fallos de SMTP o de entrega durante la migración. Se borra solo. Con `retention_days => 0` se desactiva.
  Conviene mencionarlo en `/privacidad` («conservamos una copia de respaldo por un máximo de 7 días»). **Pendiente de aprobar.**
- **`/cotizar/gracias`** es una página estática con `noindex` y fuera del sitemap. Si alguien abre la URL directamente la ve, pero
  la conversión se mide con el evento `quote_submit`, que solo se registra tras la confirmación del servidor. Si se configura
  Google Ads o GA4, usa ese evento y no la visita a la página.
- **Analítica:** los eventos (`quote_submit`, `quote_error`, `contact_submit`, `contact_error`) solo llevan servicio,
  instalación, área o código de error. No llevan nombre, correo ni teléfono.
- `QuickQuote` (inicio rápido de cotización) no se usa en ninguna página. Si se vuelve a usar, solo redirige a `/cotizar` con
  datos precargados y no envía nada por sí mismo.
