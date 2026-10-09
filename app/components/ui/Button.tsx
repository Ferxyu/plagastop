import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'inverse'

interface CommonProps {
  variant?: Variant
  size?: 'md' | 'lg'
  arrow?: boolean
  icon?: ReactNode
  block?: boolean
  children: ReactNode
  className?: string
}

function classes({ variant = 'primary', size = 'md', block, className }: CommonProps) {
  return [styles.button, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(' ')
}

function Inner({ icon, arrow, children }: CommonProps) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowRight className={styles.arrow} size={18} strokeWidth={1.75} aria-hidden />}
    </>
  )
}

/** Enlace con aspecto de botón. Rutas internas usan Link; tel:, mailto: y externos usan <a>. */
export function ButtonLink({
  to,
  onClick,
  ...props
}: CommonProps & { to: string; onClick?: () => void }) {
  const className = classes(props)
  if (/^(tel:|mailto:|https?:)/.test(to)) {
    return (
      <a href={to} className={className} onClick={onClick} data-magnetic>
        <Inner {...props} />
      </a>
    )
  }
  return (
    <Link to={to} className={className} onClick={onClick} prefetch="intent" data-magnetic>
      <Inner {...props} />
    </Link>
  )
}

export function Button({
  variant,
  size,
  arrow,
  icon,
  block,
  className,
  children,
  loading,
  ...rest
}: CommonProps & ComponentProps<'button'> & { loading?: boolean }) {
  const common = { variant, size, arrow, icon, block, className, children }
  return (
    <button
      {...rest}
      className={classes(common)}
      data-magnetic
      aria-busy={loading || undefined}
      disabled={rest.disabled || loading}
    >
      {loading && <span className={styles.spinner} aria-hidden />}
      <Inner {...common} />
    </button>
  )
}

/** Enlace de texto con subrayado lima. */
export function TextLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link to={to} className={[styles.textLink, className].filter(Boolean).join(' ')} prefetch="intent">
      <span>{children}</span>
      <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
    </Link>
  )
}
