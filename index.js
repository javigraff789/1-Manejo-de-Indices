import { getCanvasElement, getWebGL2Context, createShader, createProgram, createVertexBuffer, bindAttributeToVertexBuffer, createIndexBuffer } from "./utils/gl-utils.js"
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
const vertexColorLocation = gl.getAttribLocation(program, 'vertexColor')

// #️⃣ Definimos la info de la geometría que vamos a dibujar (un cuadrado)

const vertexPositions = [
  
  
  0.0, 0.8, // 0 👈 indice de cada posición
  0.2, 0.3,  // 1
  0.7, 0.1,   // 2
  0.3, -0.1,   // 3
  0.4, -0.7,
  0.0,-0.3,
  -0.4, -0.7,
  -0.3,-0.1,
  -0.7, 0.1,
  -0.2, 0.3,

]

/*Los vertices exteriores de mi estrella son
0,2,4,6,7,9
les doy un*/

const indices = [
  // primer triangulo
  0, 1, 9,
  // segundo triangulo
  1, 3, 2,
  //tercer
  3,4,5,
  //cuarto
  5,6,7,
  //quinto
  7,8,9,
  //sexto
  5,1,3,
  //septimo
  5,9,7,
  //octavo
  9,1,5,
]

//vertices exteriores son 0,2,4,7,9

const vertexColors = [
  1, 1, 0,    // 0 👈 indice de cada color
  1, 0, 0,    
  1, 1, 0,    //2
  1, 0, 0,
  1, 1, 0,    //4
  1, 0, 0,
  1, 1, 0,    //6
  1, 0, 0,
  1, 1, 0,    //8
  1, 0, 0,
  
]


/*
const vertexPositions = [
  -0.5, -0.5, // 0 👈 indice de cada posición
  0.5, -0.5,  // 1
  0.5, 0.5,   // 2
  -0.5, 0.5   // 3
]
*/


/*
const indices = [
  // primer triangulo
  0, 1, 3,
  // segundo triangulo
  3, 1, 2
]*/

// #️⃣ Guardamos la info del cuadrado (i.e. posiciones, colores e indices) en VBOs e IBOs

const vertexPositionsBuffer = createVertexBuffer(gl, vertexPositions)
const vertexColorsBuffer = createVertexBuffer(gl, vertexColors)
const indexBuffer = createIndexBuffer(gl, indices)

// #️⃣ Asociamos los atributos del programa a los buffers creados, y establecemos el buffer de indices a usar

// Creamos un Vertex Array Object (VAO)
const vertexArray = gl.createVertexArray()

// A partir de aca, el VAO registra cada atributo habilitado y su conexión con un buffer, junto con los indices
gl.bindVertexArray(vertexArray)

// Habilitamos cada atributo y lo conectamos a su buffer
gl.enableVertexAttribArray(vertexPositionLocation)
bindAttributeToVertexBuffer(gl, vertexPositionLocation, 2, vertexPositionsBuffer)
gl.enableVertexAttribArray(vertexColorLocation)
bindAttributeToVertexBuffer(gl, vertexColorLocation, 3, vertexColorsBuffer)

// Conectamos el buffer de indices que vamos a usar
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

// Dejamos de tomar nota en el VAO
gl.bindVertexArray(null)

// #️⃣ Establecemos el programa a usar, sus conexiónes atributo-buffer e indices a usar (guardado en el VAO)

gl.useProgram(program)
gl.bindVertexArray(vertexArray)

// #️⃣ Dibujamos la escena (nuestro majestuoso cuadrado)

// Limpiamos el canvas
gl.clear(gl.COLOR_BUFFER_BIT)

// Y dibujamos 🎨
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
