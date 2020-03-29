import { getCanvasElement, getWebGL2Context, createShader, createProgram, createVertexBuffer, bindAttributeToVertexBuffer } from "./utils/gl-utils.js"
import { vertexShaderSourceCode, fragmentShaderSourceCode } from "./utils/shaders.js"

// #️⃣ Configuración base de WebGL

// Encontramos el canvas y obtenemos su contexto de WebGL
const canvas = getCanvasElement('canvas')
const gl = getWebGL2Context(canvas)

// Seteamos el color que vamos a usar para 'limpiar' el canvas (i.e. el color de fondo)
gl.clearColor(0, 0, 0, 1)

// #️⃣ Creamos los shaders, el programa que vamos a usar, y guardamos info de sus atributos

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode)

const program = createProgram(gl, vertexShader, fragmentShader)

const vertexPositionLocation = gl.getAttribLocation(program, 'vertexPosition')

// #️⃣ Definimos la info de la geometría que vamos a dibujar (un cuadrado)

const vertexCount = 6
const vertexPositions = [
  // primer triangulo
  -0.5, -0.5,
  0.5, -0.5,
  -0.5, 0.5,
  // segundo triangulo
  -0.5, 0.5,
  0.5, -0.5,
  0.5, 0.5
]

/* 📝 A la hora de dibujar algo en pantalla, el único idioma (o 'modo') que habla nuestro hardware
 * gráfico es el de los triángulos[^1]. Necesitas dibujar un cuadrado? Lo tenes que describir en
 * triángulos. Un Cubo? Triángulos. Un personaje del último Half Life? Tal cual, más triángulos.
 *
 * En el caso de nuestro simple cuadrado, lo estamos representando con 2 triángulos, cada uno con
 * sus respectivos 3 vertices (6 en total). Nótese que uno generalmente diría que un cuadrado tiene
 * 4 vertices, no 6; pero como tenemos que ir describiendo a cada uno de los triángulos que lo
 * conforman, terminamos describiendo 6 vertices, y repitiendo información. Al vértice (0.5, -0.5)
 * lo encontramos tanto en el primer triángulo como el segundo, igual que al vértice (-0.5, 0.5).
 * Esto, lo solucionamos con el uso de indices.
 *
 * [^1]: Habla algún que otro idioma, como el de lineas y el de puntos, pero no son los mas usados.
 * El modo es lo que estamos seteando cuando en gl.drawArrays(...) pasamos gl.TRIANGLES.
 */

// #️⃣ Guardamos la info del cuadrado (i.e. la posición de sus vértices) en Vertex Buffer Objects (VBOs)

const vertexPositionsBuffer = createVertexBuffer(gl, vertexPositions)

// #️⃣ Asociamos los atributos del programa a los buffers creados

// Creamos un Vertex Array Object (VAO), encargado de tomar nota de cada conexión atributo-buffer
const vertexArray = gl.createVertexArray()

// A partir de aca, el VAO registra cada atributo habilitado y su conexión con un buffer
gl.bindVertexArray(vertexArray)

// Habilitamos cada atributo y lo conectamos a su buffer
gl.enableVertexAttribArray(vertexPositionLocation)
bindAttributeToVertexBuffer(gl, vertexPositionLocation, 2, vertexPositionsBuffer)

// Dejamos de tomar nota en el VAO
gl.bindVertexArray(null)

// #️⃣ Establecemos el programa a usar y sus conexiónes atributo-buffer (el VAO)

gl.useProgram(program)
gl.bindVertexArray(vertexArray)

// #️⃣ Dibujamos la escena (nuestro majestuoso cuadrado)

// Limpiamos el canvas
gl.clear(gl.COLOR_BUFFER_BIT)

// Y dibujamos 🎨
gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
