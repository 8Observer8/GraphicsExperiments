/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
/// <reference path='../../Include/webgl2.d.ts' />

"use strict";

/* Source of vertex shader */
const VertexShaderSource: string = "#version 300 es\n" +
                                   "layout(location = 0) in highp vec2 aPosition;\n" +
                                   "void main(void){\n" +
                                   "gl_Position = vec4(aPosition, 1, 1);\n" +
                                   "}\n";

/* Source of fragment shader */
const FragmentShaderSource: string = "#version 300 es\n" +
                                     "precision highp float;\n" +
                                     "out vec4 Color;\n" +
                                     "void main(void){\n" +
                                     "Color = vec4(1.0, 0.5, 0.25, 1.0);\n" +
                                     "}\n";

/* Canvas element */
const CANVAS: HTMLCanvasElement = document.createElement("canvas");

document.body.appendChild(CANVAS);

/* WebGL context */
const GL: WebGL2RenderingContext = <WebGL2RenderingContext>CANVAS.getContext("webgl2", {antialias: false});

if(GL === null)
{
    throw new Error("WebGL2 is not supported");
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

    const Triangle: Mesh = GenTriangle();

    let VAO: WebGLVertexArrayObject | null = GL.createVertexArray();

    let VertexBuffer: WebGLBuffer | null = GL.createBuffer();

    let IndexBuffer: WebGLBuffer | null = GL.createBuffer();

    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, Triangle.Vertices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Triangle.Indices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.bindVertexArray(VAO);

        GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

            GL.enableVertexAttribArray(0);

            GL.vertexAttribPointer(0, 2, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

    GL.bindVertexArray(null);

    GL.useProgram(ShaderProgram);

    GL.clearColor(0.5, 0.5, 1.0, 1.0);

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    GL.clear(GL.COLOR_BUFFER_BIT);

    GL.bindVertexArray(VAO);

    GL.drawElements(GL.TRIANGLES, Triangle.NumOfIndices, GL.UNSIGNED_SHORT, 0);
}

Init();