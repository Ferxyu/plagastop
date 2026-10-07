import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Mail, Phone } from 'lucide-react'
import { salesArea } from '~/content/company'
import { mailHref, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import styles from './MobileActionBar.module.css'

/** Barra fija en móvil: aparece tras el primer scroll y se oculta mientras se escribe en un formulario. */
export function MobileActionBar() {
  const [visible, setVisible] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)
    const onFocusIn = (e: FocusEvent) => setTyping(isField(e.target))
    const onFocusOut = () => setTyping(false)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  return (
    <div className={styles.bar} data-visible={visible && !typing} aria-hidden={!visible || typing}>
      <Link
        to="/cotizar"
        className={styles.quote}
        tabIndex={visible ? 0 : -1}
        onClick={() => track('cta_click', { location: 'mobile_bar' })}
      >
        Solicitar cotización
      </Link>
      <a
        href={telHref(salesArea.phone)}
        className={styles.icon}
        tabIndex={visible ? 0 : -1}
        onClick={() => track('tel_click', { location: 'mobile_bar' })}
      >
        <Phone size={20} strokeWidth={1.75} aria-hidden />
        <span>Llamar</span>
      </a>
      <a
        href={mailHref(salesArea.email!, 'Solicitud de información')}
        className={styles.icon}
        tabIndex={visible ? 0 : -1}
        onClick={() => track('email_click', { location: 'mobile_bar' })}
      >
        <Mail size={20} strokeWidth={1.75} aria-hidden />
        <span>Correo</span>
      </a>
    </div>
  )
}
