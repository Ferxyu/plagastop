import type { ComponentProps, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './forms.module.css'

interface FieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}

export function Field({ id, label, error, hint, optional, children }: FieldProps) {
  return (
    <div className={styles.field} data-invalid={error ? true : undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (opcional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}


export function Input(props: ComponentProps<'input'>) {
  return <input {...props} className={styles.input} />
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return <textarea {...props} className={`${styles.input} ${styles.textarea}`} />
}

export function Select({
  options,
  placeholder,
  ...props
}: ComponentProps<'select'> & { options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <div className={styles.selectWrap}>
      <select {...props} className={`${styles.input} ${styles.select}`}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.chevron} size={18} strokeWidth={1.75} aria-hidden />
    </div>
  )
}
