/**
 * Empresas que han confiado en Plagastop (logos entregados por el cliente, carpeta "Logos").
 * dark: el logo es blanco y necesita fondo oscuro.
 */

const files = import.meta.glob<string>('../assets/logos/*.{svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const url = (file: string) => files[`../assets/logos/${file}`]

interface ClientDef {
  name: string
  file: string
  dark?: boolean
}

const defs: ClientDef[] = [
  { name: 'Universidad de Concepción', file: 'UdeC.webp' },
  { name: 'Molinos Cunaco', file: 'molinoscunaco.webp' },
  { name: 'Empresas Socovesa', file: 'empresas_socovesa.webp' },
  { name: 'Mayekawa Mycom', file: 'MAYEKAWAMYCOM.webp' },
  { name: 'Buses Bío Bío', file: 'busesbiobio.svg', dark: true },
  { name: 'Lavín Fire Protection', file: 'Lavin.webp' },
  { name: 'Sitrans', file: 'SITRANS.svg' },
  { name: 'Cheddar’s', file: 'cheddars.webp' },
  { name: 'Terramar', file: 'terramar.webp', dark: true },
  { name: 'Aister', file: 'Aister.svg' },
  { name: 'Consorcio Maderero', file: 'consorciomaderero.webp' },
  { name: 'Empresas Valmar', file: 'VALMAR.webp', dark: true },
  { name: 'Distrelec', file: 'distrelec.webp' },
  { name: 'Curimapu Semillas', file: 'curimapusemillas.webp' },
  { name: 'Moller & Pérez-Cotapos', file: 'Molleryperezcotapos.webp' },
  { name: 'Winpack', file: 'winpack.webp' },
  { name: 'Embosur', file: 'embosur.svg', dark: true },
  { name: 'Aitue', file: 'Aitue.webp' },
  { name: 'Terramet', file: 'TERRAMET.webp' },
  { name: 'Integral Inmobiliaria', file: 'integralinmobiliaria.webp', dark: true },
  { name: 'Orbitec', file: 'orbitec.svg' },
  { name: 'Buffet Express', file: 'buffetexpress.webp' },
  { name: 'Mansermin', file: 'mansermin.webp', dark: true },
  { name: 'Cosesa', file: 'cosesa.webp' },
  { name: 'CSI', file: 'csi.webp' },
  { name: 'Himce', file: 'himce.webp', dark: true },
  { name: 'Fulghum Fibres', file: 'fulghumfibres.webp' },
  { name: 'Sendero', file: 'Sendero.webp' },
  { name: 'Rodotrans', file: 'rodotrans.webp' },
  { name: 'Furai Sushi', file: 'furaisushi.webp' },
  { name: 'Serfocol', file: 'serfocol.webp', dark: true },
  { name: 'Costdela', file: 'costdela.webp' },
  { name: 'Urbasan', file: 'Urbasan.webp' },
  { name: 'Gespania', file: 'gespania.svg' },
  { name: 'Cadetech', file: 'cadetech.webp' },
  { name: 'Vellatrix', file: 'vellatrix.svg', dark: true },
  { name: 'Ingelec', file: 'Ingelec.webp' },
  { name: 'Agrocultura', file: 'agroculturaspa.webp' },
  { name: 'Bio-Steryl', file: 'biosteryl.svg', dark: true },
  { name: 'Efesur', file: 'efesur.webp' },
  { name: 'Keymatter', file: 'keymatter.webp' },
  { name: 'Patagual Home', file: 'patagualhome.svg' },
  { name: 'Cacefi', file: 'CACEFI.webp' },
  { name: 'Catim', file: 'catim.webp' },
  { name: 'Cosalpa', file: 'cosalpa.webp' },
  { name: 'Maritano Ebensperger', file: 'maritanoebensperger.webp' },
  { name: 'Antalis Abitek', file: 'AntalisABITEK.svg' },
  { name: 'Vain', file: 'vain.svg' },
  { name: 'Mamba Negra Bar', file: 'mambanegrabar.webp' },
]

export const clients = defs.map((c) => ({ ...c, src: url(c.file) })).filter((c) => c.src)
