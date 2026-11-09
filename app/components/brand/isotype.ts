/**
 * Geometría del isotipo de Plagastop, medida sobre el logo oficial (plagastop-logo.png, 1182 × 427 px):
 * tres círculos lima (r ≈ 62 px) unidos por un tallo vertical y dos brazos diagonales que convergen
 * en un nodo (oculto en el logo detrás de la "O"). Coordenadas trasladadas a un lienzo de 318 × 408.
 */

export const ISO_VIEWBOX = '0 0 318 408'
export const ISO_LIME = '#cce70b'

/** Ancho de los enlaces (igual que el tallo del logo). */
export const ISO_BOND = 29

export const ISO_ATOMS = [
  { id: 'top', cx: 158.5, cy: 62, r: 62.5 },
  { id: 'left', cx: 62, cy: 346, r: 62 },
  { id: 'right', cx: 255.5, cy: 346, r: 62.5 },
] as const

/** Nodo donde se unen los tres enlaces. */
export const ISO_NODE = { x: 158.5, y: 176 }
