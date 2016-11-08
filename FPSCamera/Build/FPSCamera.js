/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
"use strict";
/******************************** SHADERS *********************************/
/* Source of vertex shader */
var VertexShaderSource = "#version 100\n" +
    "attribute mediump vec3 aPosition;\n" +
    "attribute lowp vec2 aTexCoords;\n" +
    "uniform mediump mat4 uProjection;\n" +
    "uniform mediump mat4 uModelView;\n" +
    "varying lowp vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1);\n" +
    "vTexCoords = aTexCoords;\n" +
    "}\n";
/* Source of fragment shader */
var FragmentShaderSource = "#version 100\n" +
    "precision mediump float;\n" +
    "uniform sampler2D uTexture;\n" +
    "varying vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_FragColor = texture2D(uTexture, vTexCoords);\n" +
    "}\n";
/**************************************************************************/
/********************************** INIT **********************************/
/* Canvas element */
var CANVAS = document.createElement("canvas");
document.body.appendChild(CANVAS);
/* WebGL context */
var GL = CANVAS.getContext("webgl", { antialias: false }) || CANVAS.getContext("experimental-webgl", { antialias: false });
if (GL === null) {
    throw new Error("WebGL is not supported");
}
/**************************************************************************/
/******************************** CONSTANTS *******************************/
var TO_RADIAN = Math.PI / 180.0;
var UP = Vec3.FromValues(0, 1, 0);
/* Shading program */
var ShaderProgram = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);
/* Cube mesh */
var Cube = GenCube();
/* Vertex buffer to hold vertex data */
var VertexBuffer = GL.createBuffer();
/* Index buffer to hold index data */
var IndexBuffer = GL.createBuffer();
/* Texture buffer to hold the texture coordinates */
var TexBuffer = GL.createBuffer();
/**************************************************************************/
/*************************** ANIMATION AND ASPECT RATIO *******************/
var bFirstTime = true;
var StartTime;
var DeltaTime = 0.0;
var AspectRatio;
/**************************************************************************/
/********************************* CAMERA *********************************/
/* Position of the camera */
var CameraPosition = Vec3.FromValues(0, 0, 10);
/* Projection matrix for the camera  */
var CameraProjectionMat = Mat4.Create();
/* View matrix for the camera */
var CameraViewMat = Mat4.Create();
/* Position the camera is looking at */
var CameraLookAt = Vec3.Create();
/* Field of view */
var CameraFOV = 75.0 * TO_RADIAN;
/* Speed of the camera translation */
var CAMERA_TRANSLATION_SPEED = 0.01;
/* Speed of the camera rotation */
var CAMERA_ROTATION_SPEED = 0.0001;
/* Camera translation vector */
var CameraTranslation = Vec3.FromValues(0, 0, 10);
/* Orientation of the camera */
var CameraOrientation = Quat.Create();
/* Camera rotation around x axis */
var CameraRotationX = Quat.Create();
/* Camera rotation around y axis */
var CameraRotationY = Quat.Create();
/* X axis of the camera */
var CameraAxisX = Vec3.FromValues(1, 0, 0);
/* Y axis of the camera */
var CameraAxisY = Vec3.FromValues(0, 1, 0);
/* Z axis of the camera */
var CameraAxisZ = Vec3.FromValues(0, 0, -1);
/**************************************************************************/
/********************************** CUBE **********************************/
/* Model Matrix of the cube */
var ModelMat = Mat4.Create();
/* Model-view matrix of the cube */
var ModelViewMat = Mat4.Create();
/* Position of the cube */
var CubePosition = Vec3.Create();
/* Rotation value of the cube around z axis */
var CubeRotation = Quat.Create();
/* Scaling vector of the cube */
var CubeScaling = Vec3.FromValues(1, 1, 1);
/**************************************************************************/
/******************************** LOCATIONS *******************************/
var uModelViewLocation = GL.getUniformLocation(ShaderProgram, "uModelView");
var uProjectionLocation = GL.getUniformLocation(ShaderProgram, "uProjection");
var uTextureLocation = GL.getUniformLocation(ShaderProgram, "uTexture");
/**************************************************************************/
/********************************* TEXTURE ********************************/
/* XO Image */
var XO_Image;
/* XO Texture */
var XO_Texture;
/**
 * Processes the texture
 *
 * @returns {void}
 */
function ProcessTexture() {
    XO_Texture = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, XO_Texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, XO_Image);
    GL.generateMipmap(GL.TEXTURE_2D);
    GL.bindTexture(GL.TEXTURE_2D, null);
}
/**
 * Loads the texture
 *
 * @returns {void}
 */
function LoadTexture() {
    XO_Image = new Image();
    XO_Image.onload = ProcessTexture;
    XO_Image.src = "../Assets/Textures/XO.jpg";
}
LoadTexture();
/**************************************************************************/
/********************************** INPUT *********************************/
var bW_Pressed;
var bS_Pressed;
var bA_Pressed;
var bD_Pressed;
var bQ_Pressed;
var bE_Pressed;
var bRightClicked = false;
/**
 * Controls the key down events
 *
 * @param Event {KeyboardEvent}: current event
 * @returns {void}
 */
function ControlKeyDown(Event) {
    if (Event.keyCode === 38 || Event.keyCode === 87) {
        bW_Pressed = true;
        bS_Pressed = false;
    }
    else if (Event.keyCode === 40 || Event.keyCode === 83) {
        bW_Pressed = false;
        bS_Pressed = true;
    }
    if (Event.keyCode === 37 || Event.keyCode === 65) {
        bA_Pressed = true;
        bD_Pressed = false;
    }
    else if (Event.keyCode === 39 || Event.keyCode === 68) {
        bA_Pressed = false;
        bD_Pressed = true;
    }
    if (Event.keyCode === 81) {
        bQ_Pressed = true;
        bE_Pressed = false;
    }
    else if (Event.keyCode === 69) {
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
function ControlKeyUp(Event) {
    if (Event.keyCode === 38 || Event.keyCode === 87) {
        bW_Pressed = false;
    }
    else if (Event.keyCode === 40 || Event.keyCode === 83) {
        bS_Pressed = false;
    }
    if (Event.keyCode === 37 || Event.keyCode === 65) {
        bA_Pressed = false;
    }
    else if (Event.keyCode === 39 || Event.keyCode === 68) {
        bD_Pressed = false;
    }
    if (Event.keyCode === 81) {
        bQ_Pressed = false;
    }
    else if (Event.keyCode === 69) {
        bE_Pressed = false;
    }
}
/**
 * Controls the mouse down events
 *
 * @param Event {MouseEvent}: mouse events
 * @returns {void}
 */
function ControlMouseDown(Event) {
    if (Event.button === 0 && !bRightClicked) {
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
function ControlMouseMove(Event) {
    if (bRightClicked) {
        Quat.SetFromAxisAngle(CameraRotationX, CameraAxisX, -Event.movementY * CAMERA_ROTATION_SPEED * DeltaTime);
        Quat.SetFromAxisAngle(CameraRotationY, CameraAxisY, -Event.movementX * CAMERA_ROTATION_SPEED * DeltaTime); // change second to UP
        Quat.Multiply(CameraOrientation, CameraRotationX, CameraRotationY);
        Quat.MultiplyWithVector(CameraAxisZ, CameraOrientation, CameraAxisZ);
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
function LockChangeAlert() {
    if (document.pointerLockElement === CANVAS) {
        bRightClicked = true;
    }
    else {
        bRightClicked = false;
    }
}
var NewTranslation = Vec3.Create();
/**************************************************************************/
/**
 * Resizes the context
 *
 * @returns void
 */
function Resize() {
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
function Init() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    AspectRatio = CANVAS.width / CANVAS.height;
    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, Cube.Vertices, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Cube.Indices, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ARRAY_BUFFER, TexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, Cube.TextureCoordinates, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.useProgram(ShaderProgram);
    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
    var VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");
    GL.enableVertexAttribArray(VertexPosition);
    GL.vertexAttribPointer(VertexPosition, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ARRAY_BUFFER, TexBuffer);
    var TexCoordPosition = GL.getAttribLocation(ShaderProgram, "aTexCoords");
    GL.enableVertexAttribArray(TexCoordPosition);
    GL.vertexAttribPointer(TexCoordPosition, 2, GL.FLOAT, false, 0, 0);
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
function ControlCamera(DeltaTime) {
    Vec3.Cross(CameraAxisX, CameraAxisZ, CameraAxisY);
    if (bW_Pressed) {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisZ, CAMERA_TRANSLATION_SPEED * DeltaTime);
        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }
    else if (bS_Pressed) {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisZ, -CAMERA_TRANSLATION_SPEED * DeltaTime);
        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }
    if (bA_Pressed) {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisX, CAMERA_TRANSLATION_SPEED * DeltaTime);
        Vec3.Subtract(CameraTranslation, CameraTranslation, NewTranslation);
    }
    else if (bD_Pressed) {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisX, CAMERA_TRANSLATION_SPEED * DeltaTime);
        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }
    if (bQ_Pressed) {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisY, CAMERA_TRANSLATION_SPEED * DeltaTime); // change second to UP
        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }
    else if (bE_Pressed) {
        Vec3.MultiplyScalar(NewTranslation, CameraAxisY, CAMERA_TRANSLATION_SPEED * DeltaTime); // change second to UP
        Vec3.Subtract(CameraTranslation, CameraTranslation, NewTranslation);
    }
    Vec3.Lerp(CameraPosition, CameraPosition, CameraTranslation, CAMERA_TRANSLATION_SPEED * DeltaTime);
    Mat4.FromRotationTranslationScale(ModelMat, CubeRotation, CubePosition, CubeScaling);
    Vec3.Add(CameraLookAt, CameraPosition, CameraAxisZ);
    Mat4.CreateViewMat(CameraViewMat, CameraPosition, CameraLookAt, CameraAxisY); // change last to UP
    Mat4.Multiply(ModelViewMat, CameraViewMat, ModelMat);
    Mat4.CreatePerspectiveProjectionMat(CameraProjectionMat, AspectRatio, CameraFOV, 0.1, 1000.0);
}
/**
 * Starts rendering
 *
 * @returns {void}
 */
function Render() {
    if (bFirstTime) {
        bFirstTime = false;
        StartTime = Date.now();
    }
    else {
        var EndTime = Date.now();
        DeltaTime = EndTime - StartTime;
        StartTime = Date.now();
        ControlCamera(DeltaTime);
    }
    GL.clearColor(0.5, 0.5, 1.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.useProgram(ShaderProgram);
    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, XO_Texture);
    GL.uniformMatrix4fv(uProjectionLocation, false, CameraProjectionMat);
    GL.uniformMatrix4fv(uModelViewLocation, false, ModelViewMat);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);
    GL.drawElements(GL.TRIANGLES, Cube.NumOfIndices, GL.UNSIGNED_SHORT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    GL.bindTexture(GL.TEXTURE_2D, null);
    GL.useProgram(null);
    requestAnimationFrame(Render);
}
Init();
