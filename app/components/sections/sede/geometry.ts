/**
 * Maqueta de la sede de Concepción, basada en las fotos reales del edificio.
 * Geometría simplificada con proporciones aproximadas: no es un levantamiento métrico.
 * Ejes: x hacia el costado derecho, y hacia arriba, z hacia el frente.
 */

export type V = [number, number, number]
export type Face = { points: V[]; normal: V; color: string }

export const faces: Face[] = []

function box(x: number, y: number, z: number, w: number, h: number, d: number, color: string, roof = color) {
  const p: V[] = [
    [x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],
    [x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d],
  ]
  const sides: [number[], V, string][] = [
    [[0, 1, 2, 3], [0, 0, -1], color],
    [[5, 4, 7, 6], [0, 0, 1], color],
    [[4, 0, 3, 7], [-1, 0, 0], color],
    [[1, 5, 6, 2], [1, 0, 0], color],
    [[3, 2, 6, 7], [0, 1, 0], roof],
  ]
  for (const [ids, normal, fill] of sides) faces.push({ points: ids.map((i) => p[i]), normal, color: fill })
}

function wheel(x: number, y: number, z: number) {
  const n = 12
  const r = 0.34
  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n
    const b = ((i + 1) * Math.PI * 2) / n
    faces.push({
      points: [
        [x, y + Math.cos(a) * r, z + Math.sin(a) * r],
        [x + 0.16, y + Math.cos(a) * r, z + Math.sin(a) * r],
        [x + 0.16, y + Math.cos(b) * r, z + Math.sin(b) * r],
        [x, y + Math.cos(b) * r, z + Math.sin(b) * r],
      ],
      normal: [0, Math.cos(a), Math.sin(a)],
      color: '#20272b',
    })
  }
  for (const xx of [x, x + 0.16]) {
    for (let i = 0; i < n; i++) {
      const a = (i * Math.PI * 2) / n
      const b = ((i + 1) * Math.PI * 2) / n
      faces.push({
        points: [
          [xx, y, z],
          [xx, y + Math.cos(a) * r, z + Math.sin(a) * r],
          [xx, y + Math.cos(b) * r, z + Math.sin(b) * r],
          [xx, y, z],
        ],
        normal: [xx === x ? -1 : 1, 0, 0],
        color: '#30373a',
      })
    }
  }
  box(x - 0.01, y - 0.14, z - 0.14, 0.18, 0.28, 0.28, '#a5afb4')
}

/** Camioneta de doble cabina con caja abierta. */
function pickup(z: number, color: string) {
  box(-6.85, 0.29, z, 1.65, 0.43, 3.35, color)
  box(-6.7, 0.72, z + 1.25, 1.35, 0.68, 1.25, color)
  box(-6.68, 0.83, z + 2.51, 1.31, 0.43, 0.035, '#28424d')
  box(-6.68, 0.83, z + 1.22, 1.31, 0.4, 0.035, '#28424d')
  for (const x of [-6.72, -5.32]) {
    box(x, 0.84, z + 1.32, 0.035, 0.4, 1.08, '#48606c')
    box(x, 0.82, z + 1.84, 0.05, 0.47, 0.05, color)
  }
  box(-6.69, 0.73, z + 0.12, 1.32, 0.04, 0.98, '#384047')
  box(-6.85, 0.72, z, 0.12, 0.28, 1.22, color)
  box(-5.32, 0.72, z, 0.12, 0.28, 1.22, color)
  box(-6.85, 0.72, z, 1.65, 0.28, 0.12, color)
  for (const x of [-6.96, -5.24]) for (const zz of [z + 0.6, z + 2.72]) wheel(x, 0.38, zz)
  box(-6.77, 0.36, z + 3.36, 1.49, 0.12, 0.08, '#adb5b6')
  box(-6.2, 0.53, z + 3.36, 0.45, 0.16, 0.04, '#263238')
  for (const x of [-6.63, -5.67]) box(x, 0.57, z + 3.37, 0.28, 0.12, 0.04, '#faf1c7')
}

function foliage(x: number, y: number, z: number, r: number) {
  const top: V = [x, y + r, z]
  const bottom: V = [x, y - r * 0.7, z]
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4
    const b = ((i + 1) * Math.PI) / 4
    const p: V = [x + Math.cos(a) * r, y, z + Math.sin(a) * r]
    const q: V = [x + Math.cos(b) * r, y, z + Math.sin(b) * r]
    faces.push({ points: [top, p, q, top], normal: [Math.cos(a) * 0.5, 0.8, Math.sin(a) * 0.5], color: i % 2 ? '#6c894c' : '#829c59' })
    faces.push({ points: [bottom, q, p, bottom], normal: [Math.cos(a) * 0.5, -0.3, Math.sin(a) * 0.5], color: '#527345' })
  }
}

// Terreno y volumen principal.
box(-8, -0.35, -10, 13, 0.35, 21, '#a1aa9a', '#c0ccb0')
box(-3.1, 0, -6.7, 6.2, 4.7, 13.3, '#424c51', '#c7cdce')
// Fachada verde, con paño central oscuro y acceso por la izquierda.
box(-1.65, 0, 6.62, 4.8, 4.95, 0.18, '#62b943', '#73c64b')
box(-0.8, 1.5, 6.82, 3.2, 2.55, 0.05, '#303d40')
box(-0.9, 4.05, 6.82, 3.4, 0.12, 0.35, '#344941')
box(-3, 0.15, 6.64, 1.1, 2.2, 0.12, '#a1b4b3')
box(-3.13, 2.5, 6.64, 1.36, 1.7, 0.09, '#9cadaa')
box(-3.3, 2.42, 6.6, 1.75, 0.12, 1, '#333f43')
// Ventanas y banda verde del costado izquierdo.
box(-3.16, 2.05, -5.6, 0.07, 0.42, 10.7, '#8fa7a8')
box(-3.17, 2.49, -5.6, 0.08, 0.19, 10.7, '#69b847')
box(-3.16, 2.7, -5.6, 0.07, 0.4, 10.7, '#a1b5b6')
for (let z = -5.5; z < 5.1; z += 1.2) box(-3.2, 2.05, z, 0.09, 1.08, 0.045, '#394448')
// Costado derecho: paños acristalados protegidos y remate verde.
box(3.12, 1, -5.8, 0.07, 2.9, 11.6, '#6d8284')
box(3.15, 4.05, -6.6, 0.1, 1.05, 13.2, '#67b748')
for (let z = -5.8; z < 5.9; z += 0.27) box(3.22, 1, z, 0.04, 2.9, 0.035, '#b0b8b4')
// Juntas verticales de los revestimientos.
for (let z = -6.5; z < 6.5; z += 0.42) box(-3.12, 0.08, z, 0.025, 4.5, 0.018, '#5c666b')
for (let x = -1.55; x < 3.1; x += 0.3) {
  box(x, 0.05, 6.83, 0.016, 1.4, 0.016, '#75c254')
  box(x, 4.2, 6.83, 0.016, 0.66, 0.016, '#75c254')
}
// Contenedores al fondo del patio lateral (baños y casino).
box(-7.65, 0, -9.45, 3.7, 2.1, 3.2, '#326487', '#69818c')
box(-7.65, 2.15, -9.45, 3.7, 2.1, 3.2, '#4d748c', '#a5adb0')
for (let x = -7.55; x < -4; x += 0.19) box(x, 0.08, -6.22, 0.028, 4.1, 0.025, '#96a6ad')
box(-7.2, 2.9, -6.18, 2.8, 0.75, 0.035, '#bbc8cb')
box(-7.25, 2.85, -6.16, 2.9, 0.055, 0.05, '#394951')
box(-7.25, 3.65, -6.16, 2.9, 0.055, 0.05, '#394951')
// Sendero y franja lateral.
box(-3.1, 0.01, 6.9, 1.3, 0.025, 3.1, '#b7b8ae')
box(-4.5, 0.01, -6.5, 1.3, 0.025, 13.4, '#a5aaa8')
// Cerco frontal.
for (let x = -4.8; x <= 4.9; x += 1.6) box(x, 0, 9.6, 0.055, 1.35, 0.055, '#34423f')
box(-4.8, 1.25, 9.6, 9.65, 0.055, 0.055, '#34423f')
// Patio lateral con camionetas.
box(-7.8, 0.015, -9.6, 4.55, 0.03, 18.9, '#999f9e', '#b1b6b4')
for (let z = -9; z < 9; z += 0.7) box(-3.55, 0.05, z, 0.22, 0.015, 0.35, '#d3b958')
pickup(-4.9, '#d7dfe0')
pickup(-0.7, '#a1433c')
pickup(3.5, '#e7ebe9')
for (let z = -9.5; z < 10; z += 1.5) box(-7.85, 0, z, 0.055, 1.35, 0.055, '#34423f')
box(-7.85, 1.25, -9.5, 0.055, 0.055, 19.2, '#34423f')
// Perfiles, bajada de aguas y reja de acceso.
box(-3.19, 0, 6.5, 0.09, 4.8, 0.1, '#2a373c')
for (let y = 0.22; y < 4.3; y += 0.5) box(-3.11, y, 6.79, 1.22, 0.045, 0.035, '#536263')
for (let x = -3.02; x < -1.93; x += 0.11) box(x, 0.2, 6.91, 0.025, 2.13, 0.025, '#c0c9c5')
for (let z = -5.6; z < 5.9; z += 1.3) box(3.27, 0.9, z, 0.05, 3.08, 0.055, '#485653')
// Juntas de pavimento y cerco de malla.
for (let z = -5.8; z < 9; z += 0.6) box(-7.7, 0.051, z, 4, 0.008, 0.012, '#929b99')
for (let x = -7.6; x < -3.7; x += 0.65) box(x, 0.051, -5.9, 0.012, 0.008, 15, '#929b99')
for (let x = -7.8; x < 5; x += 0.24) box(x, 0, 9.62, 0.018, 1.34, 0.018, '#47534b')
box(-7.8, 0.63, 9.62, 12.7, 0.025, 0.025, '#37443d')
box(-7.8, 1.32, 9.62, 12.7, 0.05, 0.05, '#37443d')
for (let z = -6.3; z < 9.6; z += 0.28) box(4.8, 0, z, 0.02, 1.3, 0.02, '#47534b')
box(4.8, 1.3, -6.3, 0.04, 0.04, 16, '#37443d')
// Árboles.
for (const z of [-4.5, 0.5, 5.2]) {
  box(3.85, 0, z, 0.12, 2, 0.12, '#74664c')
  foliage(3.9, 2.3, z, 0.73)
  foliage(3.85, 1.75, z, 0.62)
}
foliage(2.7, 0.52, 8.7, 0.42)
foliage(-0.5, 0.5, 8.7, 0.45)
