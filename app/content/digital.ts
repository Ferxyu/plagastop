/**
 * Gestión digital con iGEO ERP, plataforma para empresas de control de plagas (igeoerp.com).
 *
 * Confirmado por Plagastop (octubre 2026): usa iGEO; varios clientes ya están incorporados y consultan en su
 * entorno privado la documentación de los servicios realizados; la incorporación de clientes es progresiva.
 * Gerencia no autorizó un acceso al portal desde este sitio: sin login, sin enlaces al sistema y sin botones de
 * solicitud de acceso. No se mencionan módulos de iGEO que Plagastop no haya confirmado (rutas, IA, trampas
 * conectadas, tiempo real, etc.).
 */

export const DIGITAL_HREF = '/empresa#gestion-digital'

/** Home: despierta el interés. */
export const digitalHome = {
  eyebrow: 'Tecnología y trazabilidad',
  paragraphs: [
    'En Plagastop incorporamos iGEO, una plataforma especializada que nos permite digitalizar procesos, organizar información técnica y fortalecer la gestión de nuestros servicios.',
    'Los clientes habilitados pueden consultar documentación disponible de sus intervenciones a través de un entorno digital privado, facilitando el acceso a la información y su seguimiento.',
  ],
  benefits: [
    { title: 'Gestión digital', text: 'Tecnología especializada para organizar y optimizar procesos de servicio.' },
    { title: 'Trazabilidad', text: 'Información estructurada que facilita el seguimiento de las intervenciones.' },
    {
      title: 'Documentación',
      text: 'Registros e informes disponibles para consulta según la habilitación de cada cliente.',
    },
    { title: 'Acceso a la información', text: 'Mayor autonomía para los clientes incorporados al sistema.' },
  ],
  cta: 'Conoce nuestra gestión digital',
}

/** Empresa: explica el beneficio con más detalle. */
export const digitalCompany = {
  eyebrow: 'Innovación y gestión digital',
  paragraphs: [
    'En Plagastop avanzamos en la digitalización de nuestros servicios mediante iGEO ERP, una plataforma especializada en la gestión de empresas de control de plagas.',
    'Esta tecnología nos permite organizar información y documentación técnica, contribuyendo a una gestión más estructurada y trazable.',
    'Los clientes incorporados al sistema pueden consultar documentación disponible de sus servicios desde un entorno digital privado, facilitando el seguimiento y la consulta de antecedentes.',
  ],
  benefits: [
    {
      icon: 'folder',
      title: 'Organización documental',
      text: 'Registros e informes de los servicios quedan ordenados en un mismo sistema.',
    },
    {
      icon: 'trace',
      title: 'Trazabilidad de servicios',
      text: 'Cada intervención queda registrada, lo que permite revisar su historial cuando se necesita.',
    },
    {
      icon: 'digital',
      title: 'Gestión digital',
      text: 'Una plataforma especializada en control de plagas respalda la organización y el registro del trabajo.',
    },
    {
      icon: 'access',
      title: 'Acceso para clientes habilitados',
      text: 'Los clientes incorporados consultan la documentación disponible en su entorno privado.',
    },
  ],
  /** La incorporación es gradual: se dice en la propia sección para no sugerir que todos los clientes ya acceden. */
  note: 'La incorporación de clientes al sistema es progresiva. Si quieres saber si tu empresa ya está habilitada, consulta con el Área Comercial.',
} as const

/** Referencia breve en servicios que generan registros periódicos (MIP, roedores, insectos). */
export const digitalServiceNote =
  'Nuestra gestión incorpora herramientas digitales para organizar registros y facilitar el seguimiento documental de los servicios. Los clientes habilitados pueden consultar la documentación incorporada al sistema.'
