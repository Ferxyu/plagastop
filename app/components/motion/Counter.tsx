import { useEffect, useRef, useState } from 'react'

/** Cuenta hasta el valor al entrar en pantalla. El HTML prerenderizado ya trae el valor final. */
export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const duration = 1400
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
          if (t < 1) frame = requestAnimationFrame(step)
        }
        setShown(0)
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref} className="tabular">
      {prefix}
      {shown}
      {suffix}
    </span>
  )
}
