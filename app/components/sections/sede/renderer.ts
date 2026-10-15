import type { Face, V } from './geometry'

/**
 * Renderizador WebGL nativo de la maqueta, sin dependencias. Proyección ortográfica sobre un lienzo
 * de proporción 800 × 550 (la misma que usa `project` para ubicar los puntos sobre el modelo).
 * Solo dibuja cuando se le pide: el giro lo maneja quien lo usa.
 */

export const SCALE = 22
const OFFSET_X = 1.3

/** Gira un punto según el ángulo (eje vertical) y la inclinación (eje horizontal). */
export function rotate([x, y, z]: V, angle: number, tilt: number): V {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  const xx = c * x + s * z
  const zz = -s * x + c * z
  return [xx, ct * y - st * zz, st * y + ct * zz]
}

/** Posición en porcentaje del lienzo, para colocar elementos HTML sobre el modelo. */
export function project(p: V, angle: number, tilt: number): [number, number] {
  const [x, y] = rotate([p[0] + OFFSET_X, p[1], p[2]], angle, tilt)
  return [(400 + x * SCALE) / 8, (295 - y * SCALE) / 5.5]
}

const vertex = `attribute vec3 position;attribute vec3 normal;attribute vec3 color;attribute vec2 uv;attribute float mode;
uniform float angle;uniform float tilt;varying vec3 col;varying vec2 tex;varying float kind;
void main(){
  float c=cos(angle),s=sin(angle),ct=cos(tilt),st=sin(tilt);
  vec3 p=position+vec3(${OFFSET_X},0.,0.);
  float x=c*p.x+s*p.z;float z=-s*p.x+c*p.z;float y=ct*p.y-st*z;float depth=st*p.y+ct*z;
  gl_Position=vec4(x*${SCALE}./400.,(275.-(295.-y*${SCALE}.))/275.,-depth/40.,1.);
  float light=.68+.32*max(0.,dot(normal,normalize(vec3(-.4,1.,.7))));
  float shine=pow(max(0.,dot(normal,normalize(vec3(-.3,.85,1.)))),18.);
  col=color*light+vec3(shine*.10);tex=uv;kind=mode;
}`

// mode 1: capas de relieve del letrero; mode 2: cara del letrero (letras blancas, isotipo verde).
const fragment = `precision mediump float;varying vec3 col;varying vec2 tex;varying float kind;uniform sampler2D logo;
void main(){
  if(kind>.5){
    vec3 ink=texture2D(logo,vec2(.07+tex.x*.84,.35+tex.y*.30)).rgb;
    float a=1.-min(ink.r,min(ink.g,ink.b));
    if(a<.25)discard;
    if(kind<1.5){gl_FragColor=vec4(.15,.22,.10,1.);}
    else{bool green=ink.g>ink.r*1.08;gl_FragColor=vec4(green?ink:vec3(1.),1.);}
  }else{gl_FragColor=vec4(col,1.);}
}`

export function createRenderer(canvas: HTMLCanvasElement, faces: Face[], logo: string) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true })
  if (!gl) throw new Error('WebGL no disponible')
  const shaders: WebGLShader[] = []
  const program = gl.createProgram()!
  const buffer = gl.createBuffer()!
  const texture = gl.createTexture()!
  let disposed = false
  let last: [number, number] = [0, 0]

  const cleanup = () => {
    gl.deleteBuffer(buffer)
    gl.deleteTexture(texture)
    gl.deleteProgram(program)
    shaders.forEach((s) => gl.deleteShader(s))
  }

  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type)!
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader')
      gl.attachShader(program, shader)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program')

    const data: number[] = []
    const quad = (points: V[], normal: V, rgb: V, mode = 0) => {
      const uv = [[0, 1], [1, 1], [1, 0], [0, 0]]
      for (const i of [0, 1, 2, 0, 2, 3]) data.push(...points[i], ...normal, ...rgb, ...uv[i], mode)
    }
    for (const f of faces) {
      const hex = parseInt(f.color.slice(1), 16)
      quad(f.points, f.normal, [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255])
    }
    // Letrero en el remate derecho: capas de contorno para el relieve y la cara al frente.
    for (let i = 0; i < 5; i++) {
      const x = 3.29 + i * 0.016
      quad([[x, 4.15, 6.3], [x, 4.15, 3.92], [x, 5.0, 3.92], [x, 5.0, 6.3]], [1, 0, 0], [1, 1, 1], i === 4 ? 2 : 1)
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    let offset = 0
    for (const [name, size] of [['position', 3], ['normal', 3], ['color', 3], ['uv', 2], ['mode', 1]] as const) {
      const loc = gl.getAttribLocation(program, name)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 48, offset * 4)
      offset += size
    }

    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(gl.getUniformLocation(program, 'logo'), 0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const uAngle = gl.getUniformLocation(program, 'angle')
    const uTilt = gl.getUniformLocation(program, 'tilt')
    const count = data.length / 12

    const draw = (angle: number, tilt: number) => {
      if (disposed) return
      last = [angle, tilt]
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.enable(gl.DEPTH_TEST)
      gl.depthFunc(gl.LEQUAL)
      gl.disable(gl.CULL_FACE)
      gl.useProgram(program)
      gl.uniform1f(uAngle, angle)
      gl.uniform1f(uTilt, tilt)
      gl.drawArrays(gl.TRIANGLES, 0, count)
    }

    const image = new Image()
    image.onload = () => {
      if (disposed) return
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      draw(...last)
    }
    image.src = logo

    const resize = new ResizeObserver(() => draw(...last))
    resize.observe(canvas)

    return {
      draw,
      dispose() {
        disposed = true
        image.onload = null
        resize.disconnect()
        cleanup()
      },
    }
  } catch (error) {
    cleanup()
    throw error
  }
}
