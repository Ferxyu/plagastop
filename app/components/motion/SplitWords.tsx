import type { CSSProperties } from 'react'

/**
 * Divide un texto en palabras enmascaradas que suben al aparecer el bloque [data-reveal] que las contiene
 * (o con la animación de carga del hero). El texto sigue completo en el HTML para lectores y buscadores.
 */
export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="split-w">
            <span style={{ '--i': start + i } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}

/** Titular dividido en palabras con una parte resaltada por el marcador lima. */
export function SplitTitle({ lead, mark, after }: { lead?: string; mark: string; after?: string }) {
  const leadCount = lead ? lead.split(' ').length : 0
  const markCount = mark.split(' ').length
  return (
    <>
      {lead && (
        <>
          <SplitWords text={lead} />{' '}
        </>
      )}
      <mark>
        <SplitWords text={mark} start={leadCount} />
      </mark>
      {after && <SplitWords text={after} start={leadCount + markCount} />}
    </>
  )
}
