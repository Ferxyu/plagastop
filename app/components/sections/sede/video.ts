/** Recorrido en video por la sede (vertical 9:16, con audio). */
export const SEDE_VIDEO = `${import.meta.env.BASE_URL}media/sede-video.mp4`
export const SEDE_POSTER = `${import.meta.env.BASE_URL}media/sede-video-poster.jpg`

/** El audio del recorrido viene fuerte: parte a mitad de volumen (el visitante lo ajusta en los controles). */
export const halfVolume = (video: HTMLVideoElement | null) => {
  if (video) video.volume = 0.5
}
