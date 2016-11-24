/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
/// <reference path='../../Include/webgl2.d.ts' />

"use strict";

/******************************** SHADERS *********************************/

/* Source of vertex shader */
const VertexShaderSource: string = "#version 300 es\n" +
                                   "layout (location = 0) in highp vec2 aPosition;\n" +
                                   "layout (location = 1) in lowp vec2 aTexCoords;\n" +
                                   "uniform mediump mat4 uProjection;\n" +
                                   "uniform mediump mat4 uModelView;\n" +
                                   "out lowp vec2 vTexCoords;\n" +
                                   "void main(void){\n" +
                                   "gl_Position = uProjection * uModelView * vec4(aPosition, 1, 1);\n" +
                                   "vTexCoords = aTexCoords;\n" +
                                   "}\n";

/* Source of fragment shader */
const FragmentShaderSource: string = "#version 300 es\n" +
                                     "precision highp float;\n" +
                                     "in vec2 vTexCoords;\n" +
                                     "uniform sampler2D IlluminatiTexture;\n" +
                                     "out vec4 Color;\n" +
                                     "void main(void){\n" +
                                     "Color = texture(IlluminatiTexture, vTexCoords);\n" +
                                     "}\n";

/**************************************************************************/

/********************************** INIT **********************************/

/* Canvas element */
const CANVAS: HTMLCanvasElement = document.createElement("canvas");

/* WebGL context */
const GL: WebGL2RenderingContext = <WebGL2RenderingContext>CANVAS.getContext("webgl2", {antialias: false});

if(GL === null)
{
    throw new Error("WebGL2 is not supported");
}

document.body.appendChild(CANVAS);

/**************************************************************************/

/******************************** CONSTANTS *******************************/

const TO_RADIAN: number = Math.PI / 180.0;

const UP: Float32Array = Vec3.FromValues(0, 1, 0);

/* Translation speed */
const TRANSLATION_SPEED: number = 0.001;

/* Rotation speed */
const ROTATION_SPEED: number = 0.1;

/* Scaling speed */
const SCALING_SPEED: number = 0.001;

/* PI times two */
const PI_2: number = Math.PI * 2.0;

/* Shading program */
let ShaderProgram: WebGLProgram | null = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);

/* Triangle mesh */
const Triangle: Mesh = GenTriangle();

/* Vertex buffer to hold vertex data */
const VertexBuffer: WebGLBuffer | null = GL.createBuffer();

/* Index buffer to hold index data */
const IndexBuffer: WebGLBuffer | null = GL.createBuffer();

/* Texture buffer to store texture coordinates */
const TexBuffer: WebGLBuffer | null = GL.createBuffer();

/* VAO to store the vertex state */
const VAO: WebGLVertexArrayObject | null = GL.createVertexArray();

/* Texture coordinates */
const TextureCoordinates: Float32Array = new Float32Array(
    [
        0.0, 0.0,  // Lower-left  
        1.0, 0.0,  // Lower-right
        0.534, 1.0   // Top-center
    ]);

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

/* Position of the triangle */
let TrianglePosition: Float32Array = Vec2.Create();

/* Rotation value of the triangle around z axis */
let TriangleRotationZ: number = 0.0 * TO_RADIAN;

/* Scaling vector of the triangle */
let TriangleScaling: Float32Array = Vec2.FromValues(0.5, 0.5);

/**************************************************************************/

/******************************** LOCATIONS *******************************/

const uModelViewLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uModelView");

const uProjectionLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uProjection");

/**************************************************************************/

/********************************* TEXTURE ********************************/

/* Image of the illuminati */
let IlluminatiImage: HTMLImageElement;

/* Texture for WebGL */
let IlluminatiTexture: WebGLTexture | null;

/* Location of the texture */
const TextureSource: string = "../Assets/Textures/Illuminati.png";

/**
 * Processes the texture 
 * 
 * @returns {void}
 */
function ProcessTexture(): void 
{
    GL.bindTexture(GL.TEXTURE_2D, IlluminatiTexture);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);

    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, IlluminatiImage);

    GL.generateMipmap(GL.TEXTURE_2D);

    GL.bindTexture(GL.TEXTURE_2D, null);
}

/**
 * Initializes the texture 
 * 
 * @returns {void}
 */
function InitTexture(): void 
{
    IlluminatiTexture = GL.createTexture();

    IlluminatiImage = new Image();

    IlluminatiImage.onload = ProcessTexture;

    IlluminatiImage.src = TextureSource;
}

/**************************************************************************/

/****************************** INPUT *************************************/

let bW_Pressed: boolean = false;

let bS_Pressed: boolean = false;

let bA_Pressed: boolean = false;

let bD_Pressed: boolean = false;

let bQ_Pressed: boolean = false;

let bE_Pressed: boolean = false;

let bZ_Pressed: boolean = false;

let bC_Pressed: boolean = false;

/**
 * Handles the input down events
 * 
 * @returns {void}
 */
function HandleInputDown(Evt: KeyboardEvent): void 
{
    if(Evt.keyCode === 87 || Evt.keyCode === 38) // W OR UP_ARROW 
    {
        bW_Pressed = true;

        bS_Pressed = false;
    }
    else if(Evt.keyCode === 83 || Evt.keyCode === 40) // S OR DOWN_ARROW 
    {
        bW_Pressed = false;

        bS_Pressed = true;
    }

    if(Evt.keyCode === 65 || Evt.keyCode === 37) // A OR LEFT_ARROW 
    {
        bA_Pressed = true;

        bD_Pressed = false;
    }
    else if(Evt.keyCode === 68 || Evt.keyCode === 39) // D OR RIGHT_ARROW 
    {
        bA_Pressed = false; 

        bD_Pressed = true;
    }

    if(Evt.keyCode === 81) // Q 
    {
        bQ_Pressed = true;

        bE_Pressed = false;
    }
    else if(Evt.keyCode === 69) // E 
    {
        bQ_Pressed = false;

        bE_Pressed = true;
    }

    if(Evt.keyCode === 90) // Z 
    {
        bZ_Pressed = true;

        bC_Pressed = false;
    }
    else if(Evt.keyCode === 67) // C 
    {
        bZ_Pressed = false;

        bC_Pressed = true;
    }
}

/**
 * Handles the input up events
 * 
 * @returns {void}
 */
function HandleInputUp(Evt: KeyboardEvent): void 
{
    if(Evt.keyCode === 87 || Evt.keyCode === 38) // W 
    {
        bW_Pressed = false;
    }
    else if(Evt.keyCode === 83 || Evt.keyCode === 40) // S 
    {
        bS_Pressed = false;
    }

    if(Evt.keyCode === 65 || Evt.keyCode === 37) // A 
    {
        bA_Pressed = false;
    }
    else if(Evt.keyCode === 68 || Evt.keyCode === 39) // D 
    {
        bD_Pressed = false;
    }

    if(Evt.keyCode === 81) // Q 
    {
        bQ_Pressed = false;
    }
    else if(Evt.keyCode === 69) // E 
    {
        bE_Pressed = false;
    }

    if(Evt.keyCode === 90) // Z 
    {
        bZ_Pressed = false;
    }
    else if(Evt.keyCode === 67) // C 
    {
        bC_Pressed = false;
    }
}

document.addEventListener("keydown", HandleInputDown);

document.addEventListener("keyup", HandleInputUp);

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

        GL.bufferData(GL.ARRAY_BUFFER, Triangle.Vertices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Triangle.Indices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ARRAY_BUFFER, TexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, TextureCoordinates, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.useProgram(ShaderProgram);

        GL.bindVertexArray(VAO);

            GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

                GL.enableVertexAttribArray(0);

                GL.vertexAttribPointer(0, 2, GL.FLOAT, false, 0, 0);

            GL.bindBuffer(GL.ARRAY_BUFFER, null);

            GL.bindBuffer(GL.ARRAY_BUFFER, TexBuffer);

                GL.enableVertexAttribArray(1);

                GL.vertexAttribPointer(1, 2, GL.FLOAT, false, 0, 0);

            GL.bindBuffer(GL.ARRAY_BUFFER, null);

            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

        GL.bindVertexArray(null);

    GL.useProgram(null);

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    InitTexture();

    requestAnimationFrame(Render);
}

/**
 * Triangle operations
 * 
 * @param DeltaTime {number}: time passed since the last frame
 * @returns {void}
 */
function HandleTriangle(DeltaTime: number): void 
{

    if(bW_Pressed)
    {
        TrianglePosition[0] += TRANSLATION_SPEED * DeltaTime * Math.sin(PI_2 - TriangleRotationZ);

        TrianglePosition[1] += TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);
    }
    else if(bS_Pressed)
    {
        TrianglePosition[0] -= TRANSLATION_SPEED * DeltaTime * Math.sin(PI_2 - TriangleRotationZ);

        TrianglePosition[1] -= TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);
    }

    if(bA_Pressed)
    {
        TrianglePosition[0] -= TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);

        TrianglePosition[1] -= TRANSLATION_SPEED * DeltaTime * Math.sin(TriangleRotationZ);
    }
    else if(bD_Pressed)
    {
        TrianglePosition[0] += TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);

        TrianglePosition[1] += TRANSLATION_SPEED * DeltaTime * Math.sin(TriangleRotationZ);
    }

    if(bQ_Pressed)
    {
        TriangleRotationZ += ROTATION_SPEED * TO_RADIAN * DeltaTime;
    }
    else if(bE_Pressed)
    {
        TriangleRotationZ -= ROTATION_SPEED * TO_RADIAN * DeltaTime;
    }

    if(TriangleRotationZ > PI_2 || TriangleRotationZ < -PI_2)
    {
        TriangleRotationZ = 0.0;
    }

    if(bZ_Pressed)
    {
        TriangleScaling[0] *= Math.pow(1 + SCALING_SPEED, DeltaTime);

        TriangleScaling[1] *= Math.pow(1 + SCALING_SPEED, DeltaTime);
    }
    else if(bC_Pressed)
    {
        TriangleScaling[0] *= Math.pow(1 - SCALING_SPEED, DeltaTime);

        TriangleScaling[1] *= Math.pow(1 - SCALING_SPEED, DeltaTime);
    }

    Mat3.FromRotationTranslationScale(ModelMat, TrianglePosition, TriangleRotationZ, TriangleScaling);

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

        HandleTriangle(DeltaTime);
    }

    GL.clearColor(0.5, 0.5, 1.0, 1.0);

    GL.clear(GL.COLOR_BUFFER_BIT);

    GL.useProgram(ShaderProgram);

    GL.activeTexture(GL.TEXTURE0);

    GL.bindTexture(GL.TEXTURE_2D, IlluminatiTexture);

        GL.uniformMatrix4fv(uProjectionLocation, false, CameraProjectionMat);

        GL.uniformMatrix4fv(uModelViewLocation, false, ModelViewMat);

        GL.bindVertexArray(VAO);

            GL.drawElements(GL.TRIANGLES, Triangle.NumOfIndices, GL.UNSIGNED_SHORT, 0);

        GL.bindVertexArray(null);

    GL.bindTexture(GL.TEXTURE_2D, null);

    GL.useProgram(null);

    requestAnimationFrame(Render);
}

Init();