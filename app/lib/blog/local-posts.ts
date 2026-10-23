/**
 * Artículos editoriales publicados desde el código del sitio. Contenido real, redactado a partir de
 * fuentes oficiales y técnicas citadas al final de cada artículo (octubre 2026). No atribuyen a
 * Plagastop certificaciones, cifras ni resultados: describen normativa y buenas prácticas.
 *
 * Al conectar WordPress se publican junto con los de WordPress (ver lib/cms.ts). Para corregir o
 * retirar uno, editar o borrar su entrada aquí.
 */

import type { BlogPost, BlogSource } from './types'
import { readingMinutes, truncate } from './utils'

type Input = Omit<BlogPost, 'readingMinutes' | 'seo' | 'source'> & { seo?: Partial<BlogPost['seo']> }

/** Categorías de WordPress (mismo slug): los filtros del blog usan una sola taxonomía. El nombre lo toma de WordPress. */
const cat = {
  normativas: { slug: 'normativas-y-cumplimiento', name: 'Normativas y cumplimiento' },
  tratamientos: { slug: 'tratamientos-especializados', name: 'Tratamientos especializados' },
  prevencion: { slug: 'prevencion-y-manejo-de-plagas', name: 'Prevención y manejo de plagas' },
}

/** Lista de fuentes al final de cada artículo; los enlaces externos abren en otra pestaña. */
function sources(items: [string, string][]) {
  return `<h2>Fuentes</h2>
<ul>
${items.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join('\n')}
</ul>`
}

const inputs: Input[] = [
  {
    slug: 'control-de-plagas-en-plantas-de-alimentos-que-exige-la-ley',
    title: 'Control de plagas en plantas de alimentos: qué exige el Reglamento Sanitario',
    excerpt:
      'El Reglamento Sanitario de los Alimentos exige un programa preventivo continuo, inspecciones periódicas y que los tratamientos los realicen empresas autorizadas. Esto es lo que dice la norma.',
    date: '2026-10-20T12:00:00Z',
    category: cat.normativas,
    image: { photo: 'monitoreo-trampas-uv', alt: 'Técnico revisa la lámina de una trampa de luz ultravioleta' },
    relatedService: 'manejo-integrado-de-plagas',
    relatedIndustry: 'industria-alimentaria',
    seo: { title: 'Control de plagas en plantas de alimentos: lo que exige la ley en Chile' },
    html: `<p>En Chile, el control de plagas en establecimientos de alimentos no es opcional ni queda a criterio de cada empresa. El <strong>Reglamento Sanitario de los Alimentos</strong> (Decreto Supremo N° 977 de 1996, del Ministerio de Salud) define obligaciones concretas, y el <strong>Código Sanitario</strong> establece las sanciones cuando no se cumplen.</p>
<h2>Un programa preventivo, no reactivo</h2>
<p>El artículo 47 del reglamento es directo: «Deberá aplicarse un programa preventivo eficaz y continuo de lucha contra las plagas». Agrega que los establecimientos y sus zonas circundantes deben inspeccionarse periódicamente para cerciorarse de que no exista infestación.</p>
<p>Dos ideas se desprenden de este artículo:</p>
<ul>
<li><strong>Continuidad:</strong> no basta con tratar cuando aparece un problema. El programa debe funcionar todo el año.</li>
<li><strong>Perímetro incluido:</strong> la inspección alcanza también las zonas que rodean la planta, por donde suelen llegar roedores e insectos.</li>
</ul>
<h2>Si aparece una plaga: tratamiento por empresas autorizadas</h2>
<p>El artículo 48 indica que, si una plaga invade el establecimiento, deben adoptarse medidas de erradicación. Y precisa que el tratamiento con agentes químicos, físicos o biológicos solo puede aplicarse de acuerdo a la reglamentación vigente y <strong>por empresas autorizadas por la autoridad sanitaria</strong>.</p>
<p>Las empresas aplicadoras se rigen además por el Reglamento de Pesticidas de Uso Sanitario y Doméstico (D.S. N° 157 de 2005), que regula la aplicación de estos productos, y su autorización se tramita ante la SEREMI de Salud.</p>
<h2>Plaguicidas como último recurso</h2>
<p>El artículo 49 establece que solo deben emplearse plaguicidas «si no pueden aplicarse con eficacia otras medidas de prevención». Antes de aplicarlos hay que proteger los alimentos, equipos y utensilios, y después limpiarlos a fondo para eliminar residuos antes de volver a usarlos.</p>
<p>Este criterio coincide con el enfoque de <a href="/blog/manejo-integrado-de-plagas-que-es">manejo integrado de plagas</a>: primero prevenir y monitorear, y usar productos químicos solo cuando hacen falta.</p>
<h3>Los desechos también cuentan</h3>
<p>El artículo 40 exige impedir el acceso de las plagas a los desechos. Contenedores sin tapa o acumulación de residuos cerca de los accesos son puntos que una fiscalización suele observar.</p>
<h2>Qué arriesga una planta que no cumple</h2>
<p>El artículo 174 del Código Sanitario sanciona las infracciones al Código y a sus reglamentos con multas desde un décimo de UTM hasta 1.000 UTM, que pueden llegar al doble en caso de reincidencia. Además, la autoridad puede disponer la clausura del establecimiento, la cancelación de su autorización de funcionamiento o la paralización de faenas.</p>
<h2>Cómo prepararse</h2>
<ul>
<li>Contar con un programa escrito de control de plagas, con su plano de estaciones de monitoreo.</li>
<li>Exigir y archivar los registros y certificados de cada servicio.</li>
<li>Verificar que la empresa de control de plagas esté autorizada por la SEREMI de Salud.</li>
<li>Revisar periódicamente el perímetro y el manejo de desechos.</li>
</ul>
${sources([
  ['Decreto 977 de 1996, Reglamento Sanitario de los Alimentos (Biblioteca del Congreso Nacional)', 'https://www.bcn.cl/leychile/navegar?i=71271'],
  ['Reglamento Sanitario de los Alimentos, artículo 48 (IURA, texto de la BCN)', 'https://iura.cl/dto-977-minsal/48'],
  ['Código Sanitario, artículo 174 (IURA)', 'https://iura.cl/csan/174'],
  ['Decreto 157 de 2005, Reglamento de Pesticidas de Uso Sanitario y Doméstico (FAOLEX)', 'https://faolex.fao.org/docs/pdf/chi147971.pdf'],
])}`,
  },
  {
    slug: 'embalajes-de-madera-nimf-15-exportacion',
    title: 'Embalajes de madera para exportar: qué exige la NIMF 15 en Chile',
    excerpt:
      'Pallets, bins, cajas y madera de estiba deben ir tratados y marcados según la NIMF 15. Te explicamos qué certifica la marca, cómo se compone y qué embalajes quedan exentos.',
    date: '2026-10-16T12:00:00Z',
    category: cat.normativas,
    image: { photo: 'pallets-bajo-cobertor', alt: 'Pallets de mercadería bajo cobertor en una bodega' },
    relatedService: 'tratamientos-fitosanitarios-sag',
    relatedIndustry: 'puertos-y-comercio-exterior',
    seo: { title: 'NIMF 15 en Chile: embalajes de madera para exportación' },
    html: `<p>La madera en bruto puede transportar plagas de un país a otro. Por eso el comercio internacional se rige por la <strong>NIMF N° 15</strong>, la Norma Internacional para Medidas Fitosanitarias de la Convención Internacional de Protección Fitosanitaria (CIPF), que busca reducir el riesgo de introducción y dispersión de plagas asociadas al embalaje de madera.</p>
<p>En Chile, el Servicio Agrícola y Ganadero (SAG) es la autoridad que aplica esta norma.</p>
<h2>Qué embalajes están reglamentados</h2>
<p>La norma alcanza a los embalajes de madera en bruto, de coníferas y no coníferas. Entre los que deben certificarse están los <strong>pallets, bins, parrillas, cajas, jabas y la madera de estiba</strong>. El SAG explica que, como estos embalajes suelen reutilizarse o refabricarse, muchas veces no es posible determinar su origen ni su condición fitosanitaria.</p>
<h3>Embalajes exentos</h3>
<p>Quedan exentos, entre otros, los embalajes fabricados con madera de 6 mm de espesor o menos, y los hechos con tableros derivados de la madera, como contrachapado, aglomerado o fibra. Aun así, el SAG recomienda confirmar las exigencias del país de destino antes de despachar.</p>
<h2>Qué certifica la marca NIMF 15</h2>
<p>La marca acredita que la madera fue <strong>descortezada y tratada</strong> con un método aprobado por la norma. Se compone de:</p>
<ul>
<li>El símbolo de la CIPF, a la izquierda.</li>
<li>El código ISO del país: <strong>CL</strong> para Chile.</li>
<li>El código de la cámara de tratamiento del tercero acreditado, asignado por el SAG.</li>
<li>El código del tratamiento aplicado.</li>
</ul>
<table>
<caption>Códigos de tratamiento de la marca NIMF 15</caption>
<thead><tr><th scope="col">Código</th><th scope="col">Tratamiento</th></tr></thead>
<tbody>
<tr><td>HT</td><td>Tratamiento térmico (calor)</td></tr>
<tr><td>DH</td><td>Calentamiento dieléctrico</td></tr>
<tr><td>MB</td><td>Bromuro de metilo</td></tr>
<tr><td>SF</td><td>Fluoruro de sulfurilo</td></tr>
</tbody>
</table>
<h3>Dónde y quién la aplica</h3>
<p>La marca debe estamparse en un lugar visible, en al menos dos caras laterales externas y opuestas de cada embalaje. Solo pueden aplicarla empresas autorizadas por el SAG, después del tratamiento y en su área de resguardo.</p>
<h2>El marco normativo en Chile</h2>
<ul>
<li><strong>Resolución SAG N° 133 de 2005</strong>, modificada por las resoluciones N° 2.859/2007, N° 7.008/2013 y N° 4.782/2023: regula el ingreso de embalajes de madera al país y alcanza a las empresas que tratan embalajes de exportación.</li>
<li><strong>Resolución SAG N° 3.301 de 2006</strong>: reglamenta la acreditación de terceros que ejecutan tratamientos y timbrado de maderas y embalajes de exportación.</li>
</ul>
<p>Los embalajes que llegan a Chile desde el extranjero también deben cumplir la NIMF 15.</p>
<h2>Recomendaciones antes de exportar</h2>
<ul>
<li>Verificar que el proveedor de embalajes sea un tercero autorizado por el SAG.</li>
<li>Revisar que la marca esté completa y legible en cada pallet o caja.</li>
<li>Confirmar los requisitos del país de destino, que puede tener exigencias adicionales.</li>
</ul>
${sources([
  ['SAG: Embalajes de madera', 'https://www.sag.gob.cl/ambitos-de-accion/embalajes-de-madera'],
  ['SAG: La marca NIMF N° 15', 'https://www.sag.gob.cl/ambitos-de-accion/la-marca-nimf-ndeg15'],
  ['SAG: Embalajes reglamentados', 'https://www.sag.gob.cl/ambitos-de-accion/embalajes-reglamentados'],
  ['SAG: Embalajes exentos de la certificación', 'https://www.sag.gob.cl/ambitos-de-accion/embalajes-exentos-de-la-certificacion'],
])}`,
  },
  {
    slug: 'contenedores-fumigados-medicion-de-gases-residuales',
    title: 'Contenedores fumigados: por qué medir gases antes de abrirlos',
    excerpt:
      'Fosfina y bromuro de metilo pueden quedar atrapados dentro de un contenedor. En 2018, casi la mitad de las mediciones del SAG en Iquique superó el límite legal. Así se evita el riesgo.',
    date: '2026-10-09T12:00:00Z',
    category: cat.tratamientos,
    image: { photo: 'gas-free-contenedor', alt: 'Monitoreo de gas residual en un contenedor de importación' },
    relatedService: 'medicion-de-gases-gas-free',
    relatedIndustry: 'puertos-y-comercio-exterior',
    seo: { title: 'Contenedores fumigados: medición de gases residuales antes de abrir' },
    html: `<p>Muchas mercancías llegan al país en contenedores fumigados en origen para cumplir exigencias fitosanitarias. El problema es que el gas puede seguir dentro al momento de abrir las puertas. Para quienes trabajan en la descarga, la inspección o el aforo, ese gas residual es un riesgo serio para la salud.</p>
<h2>Los gases más habituales</h2>
<ul>
<li><strong>Bromuro de metilo:</strong> es incoloro, inodoro y más denso que el aire, por lo que puede acumularse en zonas bajas.</li>
<li><strong>Fosfina:</strong> tiene un olor característico a ajo y también es más densa que el aire.</li>
</ul>
<p>Que un gas no tenga olor significa que los sentidos no sirven para detectarlo. Además, la Comisión Europea advierte que los síntomas de una intoxicación por bromuro de metilo pueden tardar varias horas en aparecer: sentirse bien al salir del contenedor no garantiza que no hubo exposición.</p>
<h2>Un riesgo documentado en Chile</h2>
<p>En 2018, la Empresa Portuaria Iquique convocó a los servicios públicos del puerto para explicar nuevas exigencias sobre contenedores importados fumigados. Desde el 10 de abril hasta el 22 de mayo de ese año, el SAG realizó 75 mediciones de gases al interior de contenedores: <strong>36 estuvieron sobre el límite permitido por el D.S. N° 594</strong>, que la autoridad citó en 1 ppm.</p>
<p>La autoridad marítima también ha advertido que se han detectado gases fumigantes en unidades que <strong>no estaban declaradas como fumigadas</strong>. Las cintas o etiquetas de advertencia ayudan, pero su ausencia no garantiza que el contenedor esté libre de gas.</p>
<h2>Qué hacer antes de abrir un contenedor</h2>
<ol>
<li><strong>Medir antes de entrar.</strong> La concentración se mide con equipos de detección adecuados para cada gas, sin ingresar al contenedor.</li>
<li><strong>Ventilar si se supera el límite.</strong> Si la concentración excede la norma, el contenedor debe ventilarse antes de que el personal trabaje en él, en un área habilitada para ello.</li>
<li><strong>Volver a medir.</strong> La ventilación debe confirmarse con una nueva medición antes de autorizar el ingreso.</li>
<li><strong>Registrar.</strong> Dejar constancia de cada medición y de su resultado.</li>
</ol>
<h3>El certificado Gas Free</h3>
<p>Cuando la medición confirma que la concentración está bajo el límite permitido, se puede emitir un certificado que acredita que el contenedor está libre de gases y que es seguro trabajar en él. Es un respaldo tanto para el importador como para el personal que manipula la carga.</p>
${sources([
  ['MundoMarítimo (2018): EPI explica la normativa de fumigación de contenedores importados', 'https://www.mundomaritimo.cl/noticias/epi-explica-la-normativa-de-fumigacion-de-contenedores-importados'],
  ['Directemar: Resolución 12.000/754 sobre seguridad en fumigación con fosfina y bromuro de metilo', 'https://prontus.directemar.cl/directemar/site/docs/20180809/20180809123103/22__12000_754_publ.pdf'],
  ['Comisión Europea: riesgos de gases en contenedores', 'https://ec.europa.eu/taxation_customs/dds2/SAMANCTA/ES/Safety/FumesMists_ES.htm'],
])}`,
  },
  {
    slug: 'fumigacion-de-granos-con-fosfina-hermeticidad',
    title: 'Fumigación de granos con fosfina: por qué la hermeticidad lo decide todo',
    excerpt:
      'Una fumigación con fosfina solo funciona si el gas se mantiene en la concentración y el tiempo necesarios. La investigación muestra que las fugas son la principal causa de fallas y de resistencia.',
    date: '2026-10-02T12:00:00Z',
    category: cat.tratamientos,
    image: { photo: 'medicion-fosfina-graneles', alt: 'Técnico mide gas fosfina residual sobre la carga de graneles' },
    relatedService: 'fumigacion-de-granos-almacenados',
    relatedIndustry: 'agroindustria-y-granos',
    seo: { title: 'Fumigación de granos con fosfina: hermeticidad, tiempo y resistencia' },
    html: `<p>La fosfina es uno de los fumigantes más utilizados para controlar insectos en granos almacenados. Su eficacia, sin embargo, no depende solo del producto: depende de que el gas permanezca en el silo o la bodega con la <strong>concentración suficiente y durante el tiempo necesario</strong> para alcanzar todos los estados de desarrollo de los insectos.</p>
<h2>Concentración y tiempo</h2>
<p>Los huevos y las pupas son los estados más difíciles de controlar. Un estudio en Queensland (Australia), difundido por la Grains Research and Development Corporation (GRDC), concluyó que un silo debía mantener <strong>más de 300 ppm de fosfina durante siete días</strong> para controlar todos los estados de vida, incluidos huevos y pupas. Un silo con sellos levemente deteriorados no logró sostener ese nivel.</p>
<p>La duración exacta depende del producto, la especie de insecto, la temperatura y la humedad del grano, por lo que siempre deben respetarse las indicaciones de la etiqueta.</p>
<h2>La hermeticidad se mide, no se supone</h2>
<p>Antes de fumigar, la recomendación técnica es hacer una <strong>prueba de presión</strong> al silo para detectar fugas. La GRDC describe el procedimiento: se presuriza el silo a 250 Pa y se mide cuánto tarda la presión en caer a la mitad, 125 Pa.</p>
<table>
<caption>Referencia de la prueba de presión (GRDC, norma australiana AS 2628-2010)</caption>
<thead><tr><th scope="col">Tipo de silo</th><th scope="col">Tiempo mínimo para caer de 250 a 125 Pa</th></tr></thead>
<tbody>
<tr><td>Silo hermético nuevo</td><td>5 minutos</td></tr>
<tr><td>Silo existente</td><td>3 minutos (adecuado según la investigación)</td></tr>
</tbody>
</table>
<p>La misma fuente advierte que incluso silos que aprobaron la prueba presentaron fugas en la puerta de acceso inferior, un punto que conviene revisar siempre.</p>
<h2>Fugas y resistencia</h2>
<p>Cuando el gas se escapa, los insectos quedan expuestos a dosis insuficientes: muchos sobreviven, y con el tiempo se seleccionan poblaciones resistentes a la fosfina. La GRDC reporta que, con una fumigación en un silo hermético y a la dosis de la etiqueta, también se controlan insectos con resistencia fuerte. La excepción es el gorgojo plano oxidado (<em>Cryptolestes ferrugineus</em>), que requirió prolongar el tratamiento o recircular el gas.</p>
<h2>Recomendaciones prácticas</h2>
<ul>
<li>Limpiar el silo antes de llenarlo, para no dejar poblaciones de la temporada anterior.</li>
<li>Verificar la hermeticidad antes de cada fumigación.</li>
<li>Respetar el tiempo de exposición completo, sin abrir antes de tiempo.</li>
<li>Medir la concentración durante el tratamiento y antes de reingresar.</li>
<li>Confiar la aplicación a personal especializado: la fosfina es un gas altamente tóxico.</li>
</ul>
${sources([
  ['GRDC: When to open sealed silos', 'https://groundcover.grdc.com.au/grain-storage/management/when-to-open-sealed-silos'],
  ['GRDC: To seal or not to seal', 'https://groundcover.grdc.com.au/grain-storage/management/to-seal-or-not-to-seal'],
  ['GRDC: Successful fumigation, gas-tight and just right', 'https://groundcover.grdc.com.au/grain-storage/management/successful-fumigation-gas-tight-and-just-right'],
  ['GRDC: Grain storage, updates for fumigation in large silos', 'https://grdc.com.au/resources-and-publications/grdc-update-papers/tab-content/grdc-update-papers/2018/12/grain-storage-updates-for-fumigation-in-large-silos-and-grain-protectants'],
])}`,
  },
  {
    slug: 'hantavirus-y-roedores-en-bodegas-prevencion',
    title: 'Hantavirus y roedores en bodegas: medidas de prevención del Minsal',
    excerpt:
      'Las bodegas cerradas, con desorden y poca ventilación, son el ambiente ideal para el ratón de cola larga. Estas son las recomendaciones del Ministerio de Salud para reducir el riesgo.',
    date: '2026-09-25T12:00:00Z',
    category: cat.prevencion,
    image: { photo: 'control-roedores-captura', alt: 'Técnico revisa una trampa de captura viva para roedores' },
    relatedService: 'control-de-roedores',
    relatedIndustry: 'bodegas-y-centros-logisticos',
    seo: { title: 'Hantavirus en bodegas: prevención y control de roedores' },
    html: `<p>El virus Hanta se transmite principalmente al inhalar partículas contaminadas con orina, heces o saliva del <strong>ratón de cola larga</strong> (colilargo). El riesgo es mayor en lugares cerrados, oscuros y poco ventilados, como bodegas, galpones y recintos de uso temporal. Por eso, para una empresa con bodegas, la prevención es una medida de salud ocupacional y no solo de orden.</p>
<h2>Antes de entrar a un recinto cerrado</h2>
<p>El Ministerio de Salud recomienda <strong>ventilar durante 30 minutos</strong>, abriendo puertas y ventanas, antes de ingresar a un lugar que ha permanecido cerrado. Luego se debe rociar el piso y las superficies con una solución de agua con cloro antes de limpiar, para no levantar polvo contaminado.</p>
<h2>Impedir el ingreso de roedores</h2>
<ul>
<li>Sellar todas las aberturas por donde puedan entrar roedores, usando materiales resistentes como acero o cemento.</li>
<li>Eliminar los objetos en desuso que puedan servir de refugio.</li>
<li>Mantener las bodegas ordenadas y ventiladas.</li>
</ul>
<h2>Quitarles alimento y refugio</h2>
<ul>
<li>Guardar alimentos en envases herméticos y no dejar restos al alcance de los roedores.</li>
<li>Disponer la basura en tarros con tapa.</li>
<li>Mantener el perímetro limpio, con el pasto corto y sin maleza en un radio de 30 metros.</li>
</ul>
<h3>Una recomendación que suele pasarse por alto</h3>
<p>El Minsal aconseja <strong>desratizar el perímetro siete días antes de desmalezar</strong>. Al eliminar la maleza, los roedores que vivían en ella buscan nuevo refugio y pueden migrar hacia el interior de las instalaciones.</p>
<h2>Un riesgo de todo el año</h2>
<p>Las autoridades sanitarias insisten en que la prevención no es solo de verano: las medidas deben mantenerse durante todo el año en bodegas, galpones y recintos de uso ocasional. Un programa de control de roedores con estaciones de monitoreo permite detectar actividad a tiempo y actuar antes de que exista una población establecida.</p>
${sources([
  ['Ministerio de Salud: recomendaciones para prevenir el virus Hanta', 'https://www.minsal.cl/ministerio-de-salud-reitera-recomendaciones-para-prevenir-el-virus-hanta-y-refuerza-disposicion-de-suero-hiperinmune-para-tratar-la-enfermedad/'],
  ['Ministerio de Salud: Chile se cuida del virus Hanta', 'https://www.minsal.cl/?p=157156'],
  ['ACHS: ficha de prevención del virus Hanta', 'https://achs.cl/docs/librariesprovider2/empresa/centro-de-fichas/trabajadores/achs_52250_1_ficha_hanta_tcarta.pdf'],
])}`,
  },
  {
    slug: 'manejo-integrado-de-plagas-que-es',
    title: 'Manejo integrado de plagas (MIP): qué es y por qué es el estándar',
    excerpt:
      'El MIP prioriza la prevención y el monitoreo, y reserva los plaguicidas para cuando son necesarios. Es el enfoque que promueve la FAO y el que refleja la normativa sanitaria chilena.',
    date: '2026-09-18T12:00:00Z',
    category: cat.prevencion,
    image: { photo: 'estacion-control-interior', alt: 'Estación de control de roedores instalada al interior de una bodega' },
    relatedService: 'manejo-integrado-de-plagas',
    seo: { title: 'Manejo integrado de plagas (MIP): qué es y cómo se aplica en empresas' },
    html: `<p>El <strong>manejo integrado de plagas</strong> (MIP) es un enfoque que combina distintas medidas para mantener las plagas bajo control, con el menor uso posible de plaguicidas. En lugar de reaccionar cuando aparece una infestación, busca que las condiciones del lugar no favorezcan a las plagas y que cualquier actividad se detecte temprano.</p>
<h2>Un enfoque respaldado internacionalmente</h2>
<p>La Organización de las Naciones Unidas para la Alimentación y la Agricultura (FAO) promueve el MIP a través del <strong>Código Internacional de Conducta para el Manejo de Plaguicidas</strong>, cuya versión revisada fue aprobada en 2013. La FAO lo presenta como la base de un manejo de plagas que reduce el uso de plaguicidas.</p>
<h2>Cómo lo recoge la normativa chilena</h2>
<p>El Reglamento Sanitario de los Alimentos refleja los principios del MIP:</p>
<ul>
<li>El artículo 47 exige un programa preventivo eficaz y continuo, con inspecciones periódicas del establecimiento y su entorno.</li>
<li>El artículo 49 establece que solo deben emplearse plaguicidas si no pueden aplicarse con eficacia otras medidas de prevención.</li>
</ul>
<p>Más detalle en nuestro artículo sobre <a href="/blog/control-de-plagas-en-plantas-de-alimentos-que-exige-la-ley">lo que exige la ley a las plantas de alimentos</a>.</p>
<h2>Las etapas de un programa MIP</h2>
<table>
<caption>Etapas habituales de un programa de manejo integrado de plagas</caption>
<thead><tr><th scope="col">Etapa</th><th scope="col">En qué consiste</th></tr></thead>
<tbody>
<tr><td>Inspección</td><td>Recorrer la instalación y su entorno para identificar plagas presentes, accesos y puntos críticos.</td></tr>
<tr><td>Prevención</td><td>Corregir las condiciones que favorecen a las plagas: sellar accesos, ordenar, manejar desechos y limpiar.</td></tr>
<tr><td>Monitoreo</td><td>Instalar estaciones y trampas, y revisarlas con una frecuencia definida para detectar actividad temprano.</td></tr>
<tr><td>Control</td><td>Aplicar medidas focalizadas según lo detectado, usando productos solo cuando hacen falta.</td></tr>
<tr><td>Registro y evaluación</td><td>Documentar cada visita, sus hallazgos y acciones, y ajustar el programa según los resultados.</td></tr>
</tbody>
</table>
<h2>Por qué conviene a una empresa</h2>
<ul>
<li><strong>Prevención real:</strong> los problemas se detectan antes de convertirse en una infestación que afecte la operación.</li>
<li><strong>Menos productos químicos:</strong> menor exposición del personal y menor riesgo de contaminar productos y superficies.</li>
<li><strong>Trazabilidad:</strong> los registros respaldan a la empresa ante auditorías de clientes y fiscalizaciones sanitarias.</li>
</ul>
<h3>Lo que el programa necesita de la empresa</h3>
<p>Un MIP funciona mejor cuando la empresa participa: dar acceso a todas las áreas, aplicar las recomendaciones de infraestructura y orden, y avisar a tiempo cualquier avistamiento.</p>
${sources([
  ['FAO: Código Internacional de Conducta para el Manejo de Plaguicidas', 'https://www.fao.org/agriculture/crops/temas-principales/theme/pests/code/es/'],
  ['FAO: Manejo integrado de plagas y plaguicidas', 'https://www.fao.org/pest-and-pesticide-management/es/'],
  ['Reglamento Sanitario de los Alimentos, artículo 47 (IURA, texto de la BCN)', 'https://iura.cl/dto-977-minsal/47'],
  ['Reglamento Sanitario de los Alimentos, artículo 49 (IURA, texto de la BCN)', 'https://iura.cl/dto-977-minsal/49'],
])}`,
  },
  {
    slug: 'polilla-gitana-asiatica-naves-requisitos-sag',
    title: 'Polilla gitana asiática: requisitos del SAG para naves que llegan a Chile',
    excerpt:
      'La polilla gitana asiática es una plaga cuarentenaria para Chile. Las naves que estuvieron en zonas con su presencia deben cumplir requisitos del SAG y pueden ser inspeccionadas al llegar.',
    date: '2026-09-11T12:00:00Z',
    category: cat.normativas,
    image: { photo: 'aspersion-nave-polilla-gitana', alt: 'Aspersión cuarentenaria en la cubierta de una nave por polilla gitana' },
    relatedService: 'tratamientos-portuarios-y-buques',
    relatedIndustry: 'puertos-y-comercio-exterior',
    seo: { title: 'Polilla gitana asiática en naves: requisitos del SAG' },
    html: `<p>La <strong>polilla gitana asiática</strong> (<em>Lymantria dispar</em> asiática) y la polilla gitana japonesa (<em>Lymantria dispar japonica</em>) son plagas cuarentenarias para Chile, es decir, plagas cuyo ingreso el país busca impedir por el daño que podrían causar a los bosques y a la actividad forestal. Uno de sus medios de dispersión son las naves, donde las hembras depositan masas de huevos en estructuras, contenedores y superficies.</p>
<h2>Qué naves están sujetas a control</h2>
<p>La Resolución Exenta N° 4412 de 2013 del SAG, con sus actualizaciones, establece requisitos fitosanitarios para las naves que <strong>zarparon o permanecieron en áreas con presencia de la plaga durante los últimos 24 meses</strong>. Incluye naves de carga, pesqueras, de turismo, científicas y de pasajeros.</p>
<h2>Certificado e inspección</h2>
<ul>
<li>Las naves que estuvieron en zonas de riesgo deben presentar un <strong>certificado fitosanitario oficial</strong> que acredite que fueron inspeccionadas y están libres de la plaga.</li>
<li>Las que no lo presentan son consideradas de alto riesgo: pueden ser sancionadas con multas e inspeccionadas obligatoriamente por el SAG en el primer puerto chileno, durante el período de vuelo de las hembras.</li>
<li>Las demás naves provenientes de zonas de riesgo pueden ser inspeccionadas en forma aleatoria, según criterios de riesgo.</li>
<li>La nave debe entregar al SAG la bitácora o lista de puertos donde recaló en los últimos 24 meses.</li>
</ul>
<p>Para identificar las naves de riesgo, el SAG y la Dirección General del Territorio Marítimo (Directemar) firmaron en 2016 un convenio para compartir información sobre el origen de las naves y sus puertos de recalada.</p>
<h2>Qué hacer a bordo antes de llegar</h2>
<p>El SAG recomienda revisar la nave antes de arribar a Chile, buscando masas de huevos de la polilla en distintos lugares:</p>
<ol>
<li>Retirar con cuidado las masas de huevos encontradas.</li>
<li>Destruirlas sumergiéndolas en alcohol, hirviéndolas o incinerándolas.</li>
<li><strong>No cubrirlas con pintura:</strong> los huevos se mantienen viables bajo ella.</li>
</ol>
<h2>Por qué importa a la cadena logística</h2>
<p>Una nave con hallazgos puede sufrir demoras en su operación y medidas adicionales. La revisión preventiva y el cumplimiento de los requisitos del SAG reducen el riesgo para el patrimonio forestal del país y para la continuidad de la operación portuaria.</p>
${sources([
  ['SAG: Resolución Exenta N° 4412 de 2013 (polilla gitana asiática en naves)', 'https://www.sag.gob.cl/sites/default/files/resol_exenta_ndeg_4412_2013.pdf'],
  ['SAG: Aviso previo a naves sobre Lymantria dispar', 'https://www.sag.cl/sites/default/files/aviso_previo_espanol.pdf'],
  ['SAG: Inspección de naves por polilla gitana asiática', 'https://www.sag.cl/sites/default/files/ppt_dg-inspec_naves_pgra.pdf'],
  ['SAG: Presión de ingreso a Chile de plagas forestales en medios de transporte', 'https://www.sag.cl/sites/default/files/publicacion_inspec_naves_pgra_y_ta_05_2018.pdf'],
])}`,
  },
]

const localPosts: BlogPost[] = inputs
  .map(({ seo, ...p }) => ({
    ...p,
    readingMinutes: readingMinutes(p.html),
    source: 'site' as const,
    seo: { title: seo?.title ?? p.title, description: seo?.description ?? truncate(p.excerpt) },
  }))
  .sort((a, b) => b.date.localeCompare(a.date))

export const localSource: BlogSource = {
  async getPosts({ limit, category } = {}) {
    const filtered = category ? localPosts.filter((p) => p.category.slug === category) : localPosts
    return limit ? filtered.slice(0, limit) : filtered
  },
  async getPost(slug) {
    return localPosts.find((p) => p.slug === slug)
  },
  async getCategories() {
    return Object.values(cat)
  },
}
