declare let CompileShaders: any;
declare let GenTriangle: any;

"use strict";

/* Source of vertex shader */
const VertexShaderSource: string = "#version 100\n" +
                                   "attribute mediump vec2 aPosition;\n" +
                                   "void main(void){\n" +
                                   "gl_Position = vec4(aPosition, 1, 1);\n" +
                                   "}\n";

/* Source of fragment shader */
const FragmentShaderSource: string = "#version 100\n" +
                                     "precision mediump float;\n" +
                                     "void main(void){\n" +
                                     "gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0);\n" +
                                     "}\n";

/* Canvas element */
const CANVAS: HTMLCanvasElement = document.createElement("canvas");

document.body.appendChild(CANVAS);

/* WebGL context */
const GL: WebGLRenderingContext = <WebGLRenderingContext>CANVAS.getContext("webgl", {antialias: false}) || <WebGLRenderingContext>CANVAS.getContext("experimental-webgl", {antialias: false});

if(GL === null)
{
    throw new Error("WebGL is not supported");
}

/**
 * Resizes the context 
 * 
 * @returns void
 */
function Resize()
{
    CANVAS.width = window.innerWidth;

    CANVAS.height = window.innerHeight;

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
}

window.addEventListener("resize", Resize);

/**
 * Main function
 * 
 * @returns void
 */
function Init()
{
    CANVAS.width = window.innerWidth;

    CANVAS.height = window.innerHeight;

    let ShaderProgram: WebGLProgram | null = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);

    const Triangle: any = GenTriangle();

    let VertexBuffer: WebGLBuffer | null = GL.createBuffer();

    let IndexBuffer: WebGLBuffer | null = GL.createBuffer();

    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, Triangle.Vertices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Triangle.Indices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.useProgram(ShaderProgram);

    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

    let VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");

    GL.enableVertexAttribArray(VertexPosition);

    GL.vertexAttribPointer(VertexPosition, Triangle.VertexSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.clearColor(0.5, 0.5, 1.0, 1.0);

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    GL.clear(GL.COLOR_BUFFER_BIT);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

    GL.drawElements(GL.TRIANGLES, Triangle.NumOfIndices, GL.UNSIGNED_SHORT, 0);
}

Init();