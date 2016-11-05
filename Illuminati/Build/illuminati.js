/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
"use strict";
/******************************** SHADERS *********************************/
/* Source of vertex shader */
var VertexShaderSource = "#version 100\n" +
    "attribute mediump vec2 aPosition;\n" +
    "attribute lowp vec2 aTexCoords;\n" +
    "uniform mediump mat4 uProjection;\n" +
    "uniform mediump mat4 uModelView;\n" +
    "varying lowp vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1, 1);\n" +
    "vTexCoords = aTexCoords;\n" +
    "}\n";
/* Source of fragment shader */
var FragmentShaderSource = "#version 100\n" +
    "precision mediump float;\n" +
    "varying vec2 vTexCoords;\n" +
    "uniform sampler2D IlluminatiTexture;\n" +
    "void main(void){\n" +
    "gl_FragColor = texture2D(IlluminatiTexture, vTexCoords);\n" +
    "}\n";
/**************************************************************************/
/********************************** INIT **********************************/
/* Canvas element */
var CANVAS = document.createElement("canvas");
/* WebGL context */
var GL = CANVAS.getContext("webgl", { antialias: false }) || CANVAS.getContext("experimental-webgl", { antialias: false });
if (GL === null) {
    throw new Error("WebGL is not supported");
}
document.body.appendChild(CANVAS);
/**************************************************************************/
/******************************** CONSTANTS *******************************/
var TO_RADIAN = Math.PI / 180.0;
var UP = Vec3.FromValues(0, 1, 0);
/* Translation speed */
var TRANSLATION_SPEED = 0.001;
/* Rotation speed */
var ROTATION_SPEED = 0.1;
/* Scaling speed */
var SCALING_SPEED = 0.001;
/* PI times two */
var PI_2 = Math.PI * 2.0;
/* Shading program */
var ShaderProgram = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);
/* Triangle mesh */
var Triangle = GenTriangle();
/* Vertex buffer to hold vertex data */
var VertexBuffer = GL.createBuffer();
/* Index buffer to hold index data */
var IndexBuffer = GL.createBuffer();
/* Texture buffer to store texture coordinates */
var TexBuffer = GL.createBuffer();
/* Texture coordinates */
var TextureCoordinates = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.534, 1.0 // Top-center
]);
/**************************************************************************/
/*************************** ANIMATION AND ASPECT RATIO *******************/
var bFirstTime = true;
var StartTime;
var DeltaTime = 0.0;
var AspectRatio;
/**************************************************************************/
/********************************* CAMERA *********************************/
var CameraPosition = Vec3.FromValues(0, 0, 10);
/* Projection matrix for the camera  */
var CameraProjectionMat = Mat4.Create();
/* View matrix for the camera */
var CameraViewMat = Mat4.Create();
/* Position the camera is looking at */
var CameraLookAt = Vec3.Create();
/**************************************************************************/
/********************************** QUAD **********************************/
/* Model Matrix of the quad */
var ModelMat = Mat4.Create();
/* Model-view matrix of the quad */
var ModelViewMat = Mat4.Create();
/* Position of the triangle */
var TrianglePosition = Vec2.Create();
/* Rotation value of the triangle around z axis */
var TriangleRotationZ = 0.0 * TO_RADIAN;
/* Scaling vector of the triangle */
var TriangleScaling = Vec2.FromValues(0.5, 0.5);
/**************************************************************************/
/******************************** LOCATIONS *******************************/
var uModelViewLocation = GL.getUniformLocation(ShaderProgram, "uModelView");
var uProjectionLocation = GL.getUniformLocation(ShaderProgram, "uProjection");
/**************************************************************************/
/********************************* TEXTURE ********************************/
/* Image of the illuminati */
var IlluminatiImage;
/* Texture for WebGL */
var IlluminatiTexture;
/* Location of the texture */
var TextureSource = "../Assets/Textures/Illuminati.png";
/**
 * Processes the texture
 *
 * @returns {void}
 */
function ProcessTexture() {
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
function InitTexture() {
    IlluminatiTexture = GL.createTexture();
    IlluminatiImage = new Image();
    IlluminatiImage.onload = ProcessTexture;
    IlluminatiImage.src = TextureSource;
}
/**************************************************************************/
/****************************** INPUT *************************************/
var bW_Pressed = false;
var bS_Pressed = false;
var bA_Pressed = false;
var bD_Pressed = false;
var bQ_Pressed = false;
var bE_Pressed = false;
var bZ_Pressed = false;
var bC_Pressed = false;
/**
 * Handles the input down events
 *
 * @returns {void}
 */
function HandleInputDown(Evt) {
    if (Evt.keyCode === 87 || Evt.keyCode === 38) {
        bW_Pressed = true;
        bS_Pressed = false;
    }
    else if (Evt.keyCode === 83 || Evt.keyCode === 40) {
        bW_Pressed = false;
        bS_Pressed = true;
    }
    if (Evt.keyCode === 65 || Evt.keyCode === 37) {
        bA_Pressed = true;
        bD_Pressed = false;
    }
    else if (Evt.keyCode === 68 || Evt.keyCode === 39) {
        bA_Pressed = false;
        bD_Pressed = true;
    }
    if (Evt.keyCode === 81) {
        bQ_Pressed = true;
        bE_Pressed = false;
    }
    else if (Evt.keyCode === 69) {
        bQ_Pressed = false;
        bE_Pressed = true;
    }
    if (Evt.keyCode === 90) {
        bZ_Pressed = true;
        bC_Pressed = false;
    }
    else if (Evt.keyCode === 67) {
        bZ_Pressed = false;
        bC_Pressed = true;
    }
}
/**
 * Handles the input up events
 *
 * @returns {void}
 */
function HandleInputUp(Evt) {
    if (Evt.keyCode === 87 || Evt.keyCode === 38) {
        bW_Pressed = false;
    }
    else if (Evt.keyCode === 83 || Evt.keyCode === 40) {
        bS_Pressed = false;
    }
    if (Evt.keyCode === 65 || Evt.keyCode === 37) {
        bA_Pressed = false;
    }
    else if (Evt.keyCode === 68 || Evt.keyCode === 39) {
        bD_Pressed = false;
    }
    if (Evt.keyCode === 81) {
        bQ_Pressed = false;
    }
    else if (Evt.keyCode === 69) {
        bE_Pressed = false;
    }
    if (Evt.keyCode === 90) {
        bZ_Pressed = false;
    }
    else if (Evt.keyCode === 67) {
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
function Resize() {
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
function Init() {
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
    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
    var VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");
    GL.enableVertexAttribArray(VertexPosition);
    GL.vertexAttribPointer(VertexPosition, 2, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ARRAY_BUFFER, TexBuffer);
    var TexPosition = GL.getAttribLocation(ShaderProgram, "aTexCoords");
    GL.enableVertexAttribArray(TexPosition);
    GL.vertexAttribPointer(TexPosition, 2, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
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
function HandleTriangle(DeltaTime) {
    if (bW_Pressed) {
        TrianglePosition[0] += TRANSLATION_SPEED * DeltaTime * Math.sin(PI_2 - TriangleRotationZ);
        TrianglePosition[1] += TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);
    }
    else if (bS_Pressed) {
        TrianglePosition[0] -= TRANSLATION_SPEED * DeltaTime * Math.sin(PI_2 - TriangleRotationZ);
        TrianglePosition[1] -= TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);
    }
    if (bA_Pressed) {
        TrianglePosition[0] -= TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);
        TrianglePosition[1] -= TRANSLATION_SPEED * DeltaTime * Math.sin(TriangleRotationZ);
    }
    else if (bD_Pressed) {
        TrianglePosition[0] += TRANSLATION_SPEED * DeltaTime * Math.cos(TriangleRotationZ);
        TrianglePosition[1] += TRANSLATION_SPEED * DeltaTime * Math.sin(TriangleRotationZ);
    }
    if (bQ_Pressed) {
        TriangleRotationZ += ROTATION_SPEED * TO_RADIAN * DeltaTime;
    }
    else if (bE_Pressed) {
        TriangleRotationZ -= ROTATION_SPEED * TO_RADIAN * DeltaTime;
    }
    if (TriangleRotationZ > PI_2 || TriangleRotationZ < -PI_2) {
        TriangleRotationZ = 0.0;
    }
    if (bZ_Pressed) {
        TriangleScaling[0] *= Math.pow(1 + SCALING_SPEED, DeltaTime);
        TriangleScaling[1] *= Math.pow(1 + SCALING_SPEED, DeltaTime);
    }
    else if (bC_Pressed) {
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
function Render() {
    if (bFirstTime) {
        bFirstTime = false;
        StartTime = Date.now();
    }
    else {
        var EndTime = Date.now();
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
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);
    GL.drawElements(GL.TRIANGLES, Triangle.NumOfIndices, GL.UNSIGNED_SHORT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    GL.bindTexture(GL.TEXTURE_2D, null);
    GL.useProgram(null);
    requestAnimationFrame(Render);
}
Init();
