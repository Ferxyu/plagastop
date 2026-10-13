import { useEffect, useId, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
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

interface SelectProps {
  id: string
  name?: string
  value: string
  onChange: (e: { target: { value: string } }) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

/**
 * Desplegable con estilo propio (en vez del menú nativo del sistema operativo).
 * Patrón combobox de solo selección: teclado con flechas, Inicio/Fin, Enter, Escape y búsqueda por letra.
 */
export function Select({ id, name, value, onChange, options, placeholder = 'Selecciona', ...aria }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const listId = `${useId().replace(/:/g, '')}-list`
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)))
    setOpen(true)
  }

  const choose = (index: number) => {
    const option = options[index]
    if (option) onChange({ target: { value: option.value } })
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      }
      return
    }
    if (e.key === 'ArrowDown') setActive((i) => Math.min(last, i + 1))
    else if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1))
    else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(last)
    else if (e.key === 'Enter' || e.key === ' ') choose(active)
    else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false)
      return
    } else if (e.key.length === 1) {
      const start = active + 1
      const order = [...options.slice(start), ...options.slice(0, start)]
      const hit = order.find((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()))
      if (hit) setActive(options.indexOf(hit))
      return
    } else return
    e.preventDefault()
  }

  return (
    <div ref={wrap} className={styles.selectWrap} data-open={open || undefined}>
      <button
        type="button"
        id={id}
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={aria['aria-invalid'] || undefined}
        aria-describedby={aria['aria-describedby']}
        aria-required={aria.required || undefined}
        className={`${styles.input} ${styles.select}`}
        data-empty={!selected || undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        <span className={styles.selectValue}>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={styles.chevron} size={18} strokeWidth={2} aria-hidden />
      </button>
      <ul ref={list} id={listId} role="listbox" className={styles.menu} hidden={!open}>
        {options.map((o, i) => (
          <li
            key={o.value}
            id={`${listId}-${i}`}
            role="option"
            data-index={i}
            aria-selected={o.value === value}
            data-active={i === active || undefined}
            className={styles.option2}
            onPointerEnter={() => setActive(i)}
            onClick={() => choose(i)}
          >
            <span>{o.label}</span>
            {o.value === value && <Check size={16} strokeWidth={2.5} aria-hidden />}
          </li>
        ))}
      </ul>
    </div>
  )
}
