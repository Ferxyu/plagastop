import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { company } from '~/content/company'
import { facilityOptions, needOptions } from '~/content/quote'
import { track } from '~/lib/analytics'
import { Button } from '~/components/ui/Button'
import { Field, Select } from './Field'
import styles from './forms.module.css'

/** Primer paso de la cotización. Continúa en /cotizar con los datos precargados. */
export function QuickQuote({ location = 'hero', className }: { location?: string; className?: string }) {
  const navigate = useNavigate()
  const [facility, setFacility] = useState('')
  const [need, setNeed] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (facility) params.set('instalacion', facility)
    if (need) params.set('necesidad', need)
    track('quote_start', { location, facility, need })
    navigate(`/cotizar${params.size ? `?${params}` : ''}`)
  }

  return (
    <form
      className={[styles.quick, className].filter(Boolean).join(' ')}
      onSubmit={onSubmit}
      aria-labelledby="quick-quote-title"
    >
      <div className={styles.quickHead}>
        <p id="quick-quote-title" className={styles.quickTitle}>
          Cotiza en dos pasos
        </p>
        <p className={styles.quickText}>Área Comercial · {company.hours.label}</p>
      </div>
      <div className={styles.quickFields}>
        <Field id="qq-instalacion" label="Tu instalación">
          <Select
            id="qq-instalacion"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            options={facilityOptions}
            placeholder="Selecciona"
          />
        </Field>
        <Field id="qq-necesidad" label="Qué necesitas">
          <Select
            id="qq-necesidad"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            options={needOptions}
            placeholder="Selecciona"
          />
        </Field>
      </div>
      <Button type="submit" size="lg" arrow>
        Solicitar cotización
      </Button>
    </form>
  )
}
