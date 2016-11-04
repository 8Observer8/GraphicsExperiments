declare let CompileShaders: any;
declare let GenQuad: any;
declare let Vec2: any;
declare let Vec3: any;
declare let Mat3: any;
declare let Mat4: any;

"use strict";

/******************************** SHADERS *********************************/

/* Source of vertex shader */
const VertexShaderSource: string = "#version 100\n" +
                                   "attribute mediump vec2 aPosition;\n" +
                                   "uniform mediump mat4 uProjection;\n" +
                                   "uniform mediump mat4 uModelView;\n" +
                                   "void main(void){\n" +
                                   "gl_Position = uProjection * uModelView * vec4(aPosition, 1, 1);\n" +
                                   "}\n";

/* Source of fragment shader */
const FragmentShaderSource: string = "#version 100\n" +
                                     "precision mediump float;\n" +
                                     "void main(void){\n" +
                                     "gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0);\n" +
                                     "}\n";

/**************************************************************************/

/********************************** INIT **********************************/

/* Canvas element */
const CANVAS: HTMLCanvasElement = document.createElement("canvas");

document.body.appendChild(CANVAS);

/* WebGL context */
const GL: WebGLRenderingContext = <WebGLRenderingContext>CANVAS.getContext("webgl", {antialias: false}) || <WebGLRenderingContext>CANVAS.getContext("experimental-webgl", {antialias: false});

if(GL === null)
{
    throw new Error("WebGL is not supported");
}

/**************************************************************************/

/******************************** CONSTANTS *******************************/

const TO_RADIAN: number = Math.PI / 180.0;

const UP: Float32Array = Vec3.FromValues(0, 1, 0);

/* Shading program */
const ShaderProgram: WebGLProgram | null = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);

/* Quad mesh */
const Quad: any = GenQuad();

/* Vertex buffer to hold vertex data */
const VertexBuffer: WebGLBuffer | null = GL.createBuffer();

/* Index buffer to hold index data */
const IndexBuffer: WebGLBuffer | null = GL.createBuffer();

/**************************************************************************/

/*************************** ANIMATION AND ASPECT RATIO *******************/

let bFirstTime: boolean = true;

let StartTime: number;

let DeltaTime: number = 0.0;

let AspectRatio: number;

/**************************************************************************/

/********************************* CAMERA *********************************/

let CameraPosition: Float32Array = Vec3.FromValues(0, 0, 10);

/* Projection matrix for the camera  */
let CameraProjectionMat: Float32Array = Mat4.Create();

/* View matrix for the camera */
let CameraViewMat: Float32Array = Mat4.Create();

/* Position the camera is looking at */
const CameraLookAt: Float32Array = Vec3.Create();

/**************************************************************************/

/********************************** QUAD **********************************/

/* Model Matrix of the quad */
let ModelMat: Float32Array = Mat4.Create();

/* Model-view matrix of the quad */
let ModelViewMat: Float32Array = Mat4.Create();

/* Position of the quad */
let QuadPosition: Float32Array = Vec2.Create();

/* Rotation value of the quad around z axis */
let QuadRotationZ: number = 0.0 * TO_RADIAN;

/* Scaling vector of the quad */
let QuadScaling: Float32Array = Vec2.FromValues(0.5, 0.5);

/**************************************************************************/

/******************************** LOCATIONS *******************************/

const uModelViewLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uModelView");

const uProjectionLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uProjection");

/**************************************************************************/

/**
 * Resizes the context 
 * 
 * @returns void
 */
function Resize()
{
    CANVAS.width = window.innerWidth;

    CANVAS.height = window.innerHeight;

    AspectRatio = CANVAS.height / CANVAS.width;

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

    AspectRatio = CANVAS.height / CANVAS.width;

    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, Quad.Vertices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Quad.Indices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.useProgram(ShaderProgram);

        GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

            let VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");

            GL.enableVertexAttribArray(VertexPosition);

            GL.vertexAttribPointer(VertexPosition, Quad.VertexSize, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.useProgram(null);

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    requestAnimationFrame(Render);
}

/**
 * Rotates the quad 
 * 
 * @param DeltaTime {number}: time passed since the last frame
 * @returns {void}
 */
function RotateQuad(DeltaTime: number): void 
{
    QuadRotationZ += 0.1 * TO_RADIAN * DeltaTime;

    if(QuadRotationZ > 2.0 * Math.PI)
    {
        QuadRotationZ = 0.0;
    }
    else if(QuadRotationZ < -2.0 * Math.PI)
    {
        QuadRotationZ = 0.0;
    }

    Mat3.FromRotationTranslationScale(ModelMat, QuadPosition, QuadRotationZ, QuadScaling);

    Mat4.CreateViewMat(CameraViewMat, CameraPosition, CameraLookAt, UP);

    Mat4.Multiply(ModelViewMat, CameraViewMat, ModelMat);

    Mat4.CreateOrthographicProjectionMat(CameraProjectionMat, -1.0, 1.0, AspectRatio, -AspectRatio, 1.0, 100.0);
}

/**
 * Starts rendering 
 * 
 * @returns {void}
 */
function Render(): void 
{
    if(bFirstTime)
    {
        bFirstTime = false;

        StartTime = Date.now();
    }
    else
    {
        const EndTime: number = Date.now();

        DeltaTime = EndTime - StartTime;

        StartTime = Date.now();

        RotateQuad(DeltaTime);
    }

    GL.clearColor(0.5, 0.5, 1.0, 1.0);

    GL.clear(GL.COLOR_BUFFER_BIT);

    GL.useProgram(ShaderProgram);

        GL.uniformMatrix4fv(uProjectionLocation, false, CameraProjectionMat);

        GL.uniformMatrix4fv(uModelViewLocation, false, ModelViewMat);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

            GL.drawElements(GL.TRIANGLES, Quad.NumOfIndices, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.useProgram(null);

    requestAnimationFrame(Render);
}

Init();