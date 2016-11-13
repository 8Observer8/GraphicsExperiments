/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />

"use strict";

/******************************** SHADERS *********************************/

/* Source of vertex shader */
const VertexShaderSource: string = "#version 100\n" +
                                   "attribute mediump vec3 aPosition;\n" +
                                   "attribute mediump vec3 aNormal;\n" +
                                   "uniform mediump mat4 uProjection;\n" +
                                   "uniform mediump mat4 uModelView;\n" +
                                   "uniform mediump mat4 uModel;\n" +
                                   "uniform mediump mat3 uNormalMat;\n" +
                                   "varying mediump vec3 vNormal;\n" +
                                   "varying mediump vec3 vPixelPos;\n" +
                                   "void main(void){\n" +
                                   "gl_Position = uProjection * uModelView * vec4(aPosition, 1);\n" +
                                   "vNormal = normalize(uNormalMat * aNormal);\n" +
                                   "vPixelPos = vec3(uModel * vec4(aPosition, 1.0));\n" +
                                   "}\n";

/* Source of fragment shader */
const FragmentShaderSource: string = "#version 100\n" +
                                     "precision mediump float;\n" +
                                     "uniform vec3 uViewPos;\n" +
                                     "varying vec3 vNormal;\n" +
                                     "varying vec3 vPixelPos;\n" +
                                     "void main(void){\n" +
                                     "vec3 CubeAmbientColor = vec3(1.0, 0.5, 0.25);\n" +
                                     "vec3 CubeDiffuseColor = vec3(1.0, 0.5, 0.25);\n" +
                                     "vec3 CubeSpecularColor = vec3(1.0, 0.5, 0.25);\n" +
                                     "vec3 DirectionalLightDirection = vec3(0, 0, 1);\n" +
                                     "vec3 DirectionalLightAmbientColor = vec3(0.1, 0.095, 0.09);\n" +
                                     "vec3 DirectionalLightDiffuseColor = vec3(1.0, 0.95, 0.9);\n" +
                                     "vec3 DirectionalLightSpecularColor = vec3(1.0, 1.0, 1.0);\n" +
                                     "float DiffuseAmount = max(dot(vNormal, DirectionalLightDirection), 0.0);\n" +
                                     "vec3 ViewDirection = normalize(uViewPos - vPixelPos);\n" +
                                     "vec3 HalfwayDirection = normalize(DirectionalLightDirection + ViewDirection);\n" +
                                     "float SpecularAmount = pow(max(dot(vNormal, HalfwayDirection), 0.0), 32.0);\n" +
                                     "vec3 AmbientColor = CubeAmbientColor * DirectionalLightAmbientColor;\n" +
                                     "vec3 DiffuseColor = DiffuseAmount * CubeDiffuseColor * DirectionalLightDiffuseColor;\n" +
                                     "vec3 SpecularColor = SpecularAmount * CubeSpecularColor * DirectionalLightSpecularColor;\n" +
                                     "vec3 FinalColor = AmbientColor + DiffuseColor + SpecularColor;\n" +
                                     "gl_FragColor = vec4(FinalColor, 1.0);\n" +
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

/* Cube mesh */
const Cube: Mesh = GenCube();

/* Vertex buffer to hold vertex data */
const VertexBuffer: WebGLBuffer | null = GL.createBuffer();

/* Index buffer to hold index data */
const IndexBuffer: WebGLBuffer | null = GL.createBuffer();

/* Normal buffer to hold the normal data */
const NormalBuffer: WebGLBuffer | null = GL.createBuffer();

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
let CameraLookAt: Float32Array = Vec3.Create();

/* Field of view */
const CameraFOV: number = 75.0 * TO_RADIAN;

/* Speed of the camera translation */
const CAMERA_TRANSLATION_SPEED: number = 0.01;

/* Speed of the camera rotation */
const CAMERA_ROTATION_SPEED: number = 0.01;

/* Camera translation vector */
let CameraTranslation: Float32Array = Vec3.FromValues(0, 0, 10);

/* Orientation of the camera */
let CameraOrientation: Float32Array = Quat.Create();

/* Camera rotation around x axis */
let CameraRotationX: Float32Array = Quat.Create();

/* Camera rotation around y axis */
let CameraRotationY: Float32Array = Quat.Create();

/* Rotation value of camera around x axis in degrees */
let CameraRotationXInDegrees: number = 0.0 * TO_RADIAN;

/* X axis of the camera */
let CameraAxisX: Float32Array = Vec3.FromValues(1, 0, 0);

/* Y axis of the camera */
let CameraAxisY: Float32Array = Vec3.FromValues(0, 1, 0);

/* Z axis of the camera */
let CameraAxisZ: Float32Array = Vec3.FromValues(0, 0, -1);

/**************************************************************************/

/********************************** CUBE **********************************/

/* Model Matrix of the cube */
let ModelMat: Float32Array = Mat4.Create();

/* Model-view matrix of the cube */
let ModelViewMat: Float32Array = Mat4.Create();

/* Normal matrix to transform the normals */
let NormalMat: Float32Array = Mat3.Create();

/* Position of the cube */
let CubePosition: Float32Array = Vec3.Create();

/* Rotation value of the cube around z axis */
let CubeRotation: Float32Array = Quat.Create();

/* Scaling vector of the cube */
let CubeScaling: Float32Array = Vec3.FromValues(2, 2, 2);

/**************************************************************************/

/******************************** LOCATIONS *******************************/

const uModelViewLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uModelView");

const uProjectionLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uProjection");

const uNormalLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uNormalMat");

const uModelLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uModel");

const uViewPosLocation: number = <number>GL.getUniformLocation(ShaderProgram, "uViewPos");

/**************************************************************************/

/********************************** INPUT *********************************/

let bW_Pressed: boolean;

let bS_Pressed: boolean;

let bA_Pressed: boolean;

let bD_Pressed: boolean;

let bQ_Pressed: boolean;

let bE_Pressed: boolean;

let bRightClicked: boolean = false;

/**
 * Controls the key down events 
 * 
 * @param Event {KeyboardEvent}: current event 
 * @returns {void}
 */
function ControlKeyDown(Event: KeyboardEvent): void 
{
    if(Event.keyCode === 38 || Event.keyCode === 87) // W or UP_ARROW
    {
        bW_Pressed = true;

        bS_Pressed = false;
    }
    else if(Event.keyCode === 40 || Event.keyCode === 83) // S or DOW_ARROW
    {
        bW_Pressed = false;

        bS_Pressed = true;
    }

    if(Event.keyCode === 37 || Event.keyCode === 65) // A or LEFT_ARROW
    {
        bA_Pressed = true;

        bD_Pressed = false;
    }
    else if(Event.keyCode === 39 || Event.keyCode === 68) // D or RIGHT_ARROW
    {
        bA_Pressed = false;

        bD_Pressed = true;
    }

    if(Event.keyCode === 81) // Q
    {
        bQ_Pressed = true;

        bE_Pressed = false;
    }
    else if(Event.keyCode === 69) // E
    {
        bQ_Pressed = false;

        bE_Pressed = true;
    }
}

/**
 * Controls the key up events 
 * 
 * @param Event {KeyboardEvent}: current event 
 * @returns {void}
 */
function ControlKeyUp(Event: KeyboardEvent)
{
    if(Event.keyCode === 38 || Event.keyCode === 87) // W or UP_ARROW
    {
        bW_Pressed = false;
    }
    else if(Event.keyCode === 40 || Event.keyCode === 83) // S or DOW_ARROW
    {
        bS_Pressed = false;
    }

    if(Event.keyCode === 37 || Event.keyCode === 65) // A or LEFT_ARROW
    {
        bA_Pressed = false;
    }
    else if(Event.keyCode === 39 || Event.keyCode === 68) // D or RIGHT_ARROW
    {
        bD_Pressed = false;
    }

    if(Event.keyCode === 81) // Q 
    {
        bQ_Pressed = false;
    }
    else if(Event.keyCode === 69) // E
    {
        bE_Pressed = false;
    }
}

/**
 * Controls the mouse down events 
 * 
 * @param Event {MouseEvent}: mouse events 
 * @returns {void}
 */
function ControlMouseDown(Event: MouseEvent)
{
    if(Event.button === 0 && !bRightClicked)
    {
        bRightClicked = true;

        CANVAS.requestPointerLock();
    }
}

/**
 * Controls the mouse move events 
 * 
 * @param Event {MouseEvent}: mouse events 
 * @returns {void}
 */
function ControlMouseMove(Event: MouseEvent): void
{
    if(bRightClicked)
    {
        CameraRotationXInDegrees += -Event.movementY * TO_RADIAN * CAMERA_ROTATION_SPEED * DeltaTime;

        if(CameraRotationXInDegrees >= 85.0 * TO_RADIAN)
        {
            CameraRotationXInDegrees = 85.0 * TO_RADIAN;

            Quat.SetIdentity(CameraRotationX);
        }
        else if(CameraRotationXInDegrees <= -85.0 * TO_RADIAN)
        {
            CameraRotationXInDegrees = -85.0 * TO_RADIAN;

            Quat.SetIdentity(CameraRotationX);
        }
        else 
        {
            Quat.SetFromAxisAngle(CameraRotationX, CameraAxisX, -Event.movementY * TO_RADIAN * CAMERA_ROTATION_SPEED * DeltaTime);

            Quat.Normalize(CameraRotationX, CameraRotationX);
        }

        Quat.SetFromAxisAngle(CameraRotationY, CameraAxisY, -Event.movementX * TO_RADIAN * CAMERA_ROTATION_SPEED * DeltaTime);

        Quat.Normalize(CameraRotationY, CameraRotationY);

        Quat.Multiply(CameraOrientation, CameraRotationX, CameraRotationY);

        Quat.Normalize(CameraOrientation, CameraOrientation);

        Quat.MultiplyWithVector(CameraAxisZ, CameraOrientation, CameraAxisZ);

        Vec3.Normalize(CameraAxisZ, CameraAxisZ);
    }
}

window.addEventListener("keydown", ControlKeyDown);

window.addEventListener("keyup", ControlKeyUp);

window.addEventListener("mousedown", ControlMouseDown);

window.addEventListener("mousemove", ControlMouseMove);

document.addEventListener('pointerlockchange', LockChangeAlert, false);

/**
 * Detect pointer lock change 
 * 
 * @returns {void}
 */
function LockChangeAlert(): void
{
    if(document.pointerLockElement === CANVAS) 
    {
        bRightClicked = true;
    } 
    else 
    {
        bRightClicked = false; 
    }
}

let NewTranslation: Float32Array = Vec3.Create();

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

    GL.bindBuffer(GL.ARRAY_BUFFER, NormalBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, <Float32Array>Cube.Normals, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, null);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Cube.Indices, GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.useProgram(ShaderProgram);

        GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);

            const VertexPosition: number = GL.getAttribLocation(ShaderProgram, "aPosition");

            GL.enableVertexAttribArray(VertexPosition);

            GL.vertexAttribPointer(VertexPosition, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ARRAY_BUFFER, NormalBuffer);

            const NormalPosition: number = GL.getAttribLocation(ShaderProgram, "aNormal");

            GL.enableVertexAttribArray(NormalPosition);

            GL.vertexAttribPointer(NormalPosition, 3, GL.FLOAT, false, 0, 0);

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
function ControlCamera(DeltaTime: number): void 
{
    Vec3.Cross(CameraAxisX, CameraAxisZ, CameraAxisY);

    Vec3.Normalize(CameraAxisX, CameraAxisX);

    if(bW_Pressed)
    {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisZ, CAMERA_TRANSLATION_SPEED * DeltaTime);

        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }
    else if(bS_Pressed)
    {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisZ, -CAMERA_TRANSLATION_SPEED * DeltaTime);

        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }

    if(bA_Pressed)
    {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisX, CAMERA_TRANSLATION_SPEED * DeltaTime);

        Vec3.Subtract(CameraTranslation, CameraTranslation, NewTranslation);
    }
    else if(bD_Pressed)
    {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisX, CAMERA_TRANSLATION_SPEED * DeltaTime);

        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }

    if(bQ_Pressed)
    {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisY, CAMERA_TRANSLATION_SPEED * DeltaTime);

        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }
    else if(bE_Pressed)
    {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisY, CAMERA_TRANSLATION_SPEED * DeltaTime);

        Vec3.Subtract(CameraTranslation, CameraTranslation, NewTranslation);
    }

    Vec3.Lerp(CameraPosition, CameraPosition, CameraTranslation, CAMERA_TRANSLATION_SPEED * DeltaTime);

    Mat4.FromRotationTranslationScale(ModelMat, CubeRotation, CubePosition, CubeScaling);

    Mat3.CreateNormalMat(NormalMat, ModelMat);

    Vec3.Add(CameraLookAt, CameraPosition, CameraAxisZ);

    Mat4.CreateViewMat(CameraViewMat, CameraPosition, CameraLookAt, CameraAxisY);

    Mat4.Multiply(ModelViewMat, CameraViewMat, ModelMat);

    Mat4.CreatePerspectiveProjectionMat(CameraProjectionMat, AspectRatio, CameraFOV, 0.1, 1000.0);
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

        ControlCamera(DeltaTime);
    }

    GL.clearColor(0.25, 0.25, 0.35, 1.0);

    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    GL.useProgram(ShaderProgram);

        GL.uniformMatrix4fv(uProjectionLocation, false, CameraProjectionMat);

        GL.uniformMatrix4fv(uModelViewLocation, false, ModelViewMat);

        GL.uniformMatrix4fv(uModelLocation, false, ModelMat);

        GL.uniformMatrix3fv(uNormalLocation, false, NormalMat);

        GL.uniform3fv(uViewPosLocation, CameraPosition);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);

            GL.drawElements(GL.TRIANGLES, Cube.NumOfIndices, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

    GL.useProgram(null);

    requestAnimationFrame(Render);
}

Init();