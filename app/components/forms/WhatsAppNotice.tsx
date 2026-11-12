import styles from './forms.module.css'

/** Aclaración bajo el botón. Abrir WhatsApp no envía el mensaje: la persona lo envía desde la aplicación. */
export function WhatsAppHint() {
  return <p className={styles.waHint}>Se abrirá WhatsApp con tus datos preparados. Solo tendrás que presionar Enviar.</p>
}

/**
 * Aviso tras abrir WhatsApp. No confirma recepción (no hay forma de verificarla): recuerda presionar Enviar y
 * ofrece el enlace por si la aplicación no se abrió.
 */
export function WhatsAppOpened({ url }: { url: string | null }) {
  return (
    <div className={styles.waNotice} role="status" aria-live="polite">
      {url && (
        <p>
          Abrimos WhatsApp con tu mensaje preparado. <strong>Para que nos llegue, presiona Enviar en WhatsApp.</strong>{' '}
          ¿No se abrió?{' '}
          <a href={url} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp
          </a>
          .
        </p>
      )}
    </div>
  )
}
