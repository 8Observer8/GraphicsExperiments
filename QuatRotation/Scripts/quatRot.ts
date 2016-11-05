/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />

"use strict";

/******************************** SHADERS *********************************/

/* Source of vertex shader */
const VertexShaderSource: string = "#version 100\n" +
                                   "attribute mediump vec3 aPosition;\n" +
                                   "attribute mediump vec3 aColor;\n" +
                                   "uniform mediump mat4 uProjection;\n" +
                                   "uniform mediump mat4 uModelView;\n" +
                                   "varying mediump vec3 vColor;\n" +
                                   "void main(void){\n" +
                                   "gl_Position = uProjection * uModelView * vec4(aPosition, 1);\n" +
                                   "vColor = aColor;\n" +
                                   "}\n";

/* Source of fragment shader */
const FragmentShaderSource: string = "#version 100\n" +
                                     "precision mediump float;\n" +
                                     "varying vec3 vColor;\n" +
                                     "void main(void){\n" +
                                     "gl_FragColor = vec4(vColor, 1.0);\n" +
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

const Axis_X: Float32Array = Vec3.FromValues(1, 0, 0);

const Axis_Y: Float32Array = Vec3.FromValues(0, 1, 0);

const Axis_Z: Float32Array = Vec3.FromValues(0, 0, 1);

/* Shading program */
const ShaderProgram: WebGLProgram | null = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);

/* Cube mesh */
const Cube: any = GenCube();

/* Colors */
const CubeColors: Float32Array = new Float32Array(
    [
        // Front face
        1.0, 0.5, 0.25,
        1.0, 0.5, 0.25, 
        1.0, 0.5, 0.25, 
        1.0, 0.5, 0.25, 

        // Back face
        0.5, 1.0, 0.25, 
        0.5, 1.0, 0.25, 
        0.5, 1.0, 0.25, 
        0.5, 1.0, 0.25
    ]);

/* Vertex buffer to hold vertex data */
const VertexBuffer: WebGLBuffer | null = GL.createBuffer();

/* Index buffer to hold index data */
const IndexBuffer: WebGLBuffer | null = GL.createBuffer();

/* Color buffer to store the color data */
const ColorBuffer: WebGLBuffer | null = GL.createBuffer();

/**************************************************************************/

/*************************** ANIMATION AND ASPECT RATIO *******************/

let bFirstTime: boolean = true;

let StartTime: number;

let DeltaTime: number = 0.0;

let AspectRatio: number;

/**************************************************************************/

/********************************* CAMERA *********************************/

/* Position of the camera */
let CameraPosition: Float32Array = Vec3.FromValues(0, 0, 10);

/* Projection matrix for the camera  */
let CameraProjectionMat: Float32Array = Mat4.Create();

/* View matrix for the camera */
let CameraViewMat: Float32Array = Mat4.Create();

/* Position the camera is looking at */
const CameraLookAt: Float32Array = Vec3.Create();

/* Fielf of view */
const CameraFOV: number = 75.0 * TO_RADIAN;

/**************************************************************************/

/********************************** CUBE **********************************/

/* Model Matrix of the quad */
let ModelMat: Float32Array = Mat4.Create();

/* Model-view matrix of the quad */
let ModelViewMat: Float32Array = Mat4.Create();

/* Position of the quad */
let CubePosition: Float32Array = Vec3.Create();

/* Rotation value of the quad */
let CubeQuatRotation: Float32Array = Quat.Create();

/* Rotation around X axis */
let CubeQuatRotationX: Float32Array = Quat.Create();

/* Rotation around Y axis */
let CubeQuatRotationY: Float32Array = Quat.Create();

/* Rotation around Z axis */
let CubeQuatRotationZ: Float32Array = Quat.Create();

/* Scaling vector of the quad */
let CubeScaling: Float32Array = Vec3.FromValues(1, 1, 1);

/* Cube's orientation around X axis */
let CubeRotationX: number = 0.0;

/* Cube's orientation around Y axis */
let CubeRotationY: number = 0.0;

/* Cube's orientation around Z axis */
let CubeRotationZ: number = 0.0;

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

    AspectRatio = CANVAS.width / CANVAS.height;

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

    AspectRatio = CANVAS.width / CANVAS.height;

    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, Cube.Vertices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Cube.Indices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ARRAY_BUFFER, ColorBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, CubeColors, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.useProgram(ShaderProgram);

        GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

            let VertexPosition: number = GL.getAttribLocation(ShaderProgram, "aPosition");

            GL.enableVertexAttribArray(VertexPosition);

            GL.vertexAttribPointer(VertexPosition, Cube.VertexSize, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ARRAY_BUFFER, ColorBuffer);

            let ColorPosition: number = GL.getAttribLocation(ShaderProgram, "aColor");

            GL.enableVertexAttribArray(ColorPosition);

            GL.vertexAttribPointer(ColorPosition, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.useProgram(null);

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    GL.enable(GL.DEPTH_TEST);

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

    CubeRotationX += 0.1 * TO_RADIAN * DeltaTime;

    CubeRotationY += 0.1 * TO_RADIAN * DeltaTime;

    CubeRotationZ += 0.1 * TO_RADIAN * DeltaTime;

    if(CubeRotationX > 2.0 * Math.PI || CubeRotationX < -2.0 * Math.PI)
    {
        CubeRotationX = 0.0;
    }

    if(CubeRotationY > 2.0 * Math.PI || CubeRotationY < -2.0 * Math.PI)
    {
        CubeRotationY = 0.0;
    }

    if(CubeRotationZ > 2.0 * Math.PI || CubeRotationZ < -2.0 * Math.PI)
    {
        CubeRotationZ = 0.0;
    }

    Quat.SetFromAxisAngle(CubeQuatRotationX, Axis_X, CubeRotationX);

    Quat.SetFromAxisAngle(CubeQuatRotationY, Axis_Y, CubeRotationY);

    Quat.SetFromAxisAngle(CubeQuatRotationZ, Axis_Z, CubeRotationZ);

    Quat.Multiply(CubeQuatRotation, CubeQuatRotationX, CubeQuatRotationY);

    Quat.Multiply(CubeQuatRotation, CubeQuatRotation, CubeQuatRotationZ);

    Mat4.FromRotationTranslationScale(ModelMat, CubeQuatRotation, CubePosition, CubeScaling);

    Mat4.CreateViewMat(CameraViewMat, CameraPosition, CameraLookAt, Axis_Y);

    Mat4.Multiply(ModelViewMat, CameraViewMat, ModelMat);

    Mat4.CreatePerspectiveProjectionMat(CameraProjectionMat, AspectRatio, CameraFOV, 1.0, 100.0);
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

    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    GL.useProgram(ShaderProgram);

        GL.uniformMatrix4fv(uProjectionLocation, false, CameraProjectionMat);

        GL.uniformMatrix4fv(uModelViewLocation, false, ModelViewMat);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

            GL.drawElements(GL.TRIANGLES, Cube.NumOfIndices, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.useProgram(null);

    requestAnimationFrame(Render);
}

Init();