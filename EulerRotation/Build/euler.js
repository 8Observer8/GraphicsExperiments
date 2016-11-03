"use strict";
/******************************** SHADERS *********************************/
/* Source of vertex shader */
var VertexShaderSource = "#version 100\n" +
    "attribute mediump vec2 aPosition;\n" +
    "uniform mediump mat4 uProjection;\n" +
    "uniform mediump mat4 uModelView;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1, 1);\n" +
    "}\n";
/* Source of fragment shader */
var FragmentShaderSource = "#version 100\n" +
    "precision mediump float;\n" +
    "void main(void){\n" +
    "gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0);\n" +
    "}\n";
/**************************************************************************/
/********************************** INIT **********************************/
/* Canvas element */
var CANVAS = document.createElement("canvas");
/* WebGL context */
var GL = CANVAS.getContext("webgl", { antialias: false });
document.body.appendChild(CANVAS);
/**************************************************************************/
/******************************** CONSTANTS *******************************/
var TO_RADIAN = Math.PI / 180.0;
var UP = Vec3.FromValues(0, 1, 0);
/* Shading program */
var ShaderProgram = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);
/* Quad mesh */
var Quad = GenQuad();
/* Vertex buffer to hold vertex data */
var VertexBuffer = GL.createBuffer();
/* Index buffer to hold index data */
var IndexBuffer = GL.createBuffer();
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
/* Position of the quad */
var QuadPosition = Vec2.Create();
/* Rotation value of the quad around z axis */
var QuadRotationZ = 0.0 * TO_RADIAN;
/* Scaling vector of the quad */
var QuadScaling = Vec2.FromValues(0.5, 0.5);
/**************************************************************************/
/******************************** LOCATIONS *******************************/
var uModelViewLocation = GL.getUniformLocation(ShaderProgram, "uModelView");
var uProjectionLocation = GL.getUniformLocation(ShaderProgram, "uProjection");
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
    if (GL === null) {
        throw new Error("WebGL is not supported");
    }
    else {
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
        var VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");
        GL.enableVertexAttribArray(VertexPosition);
        GL.vertexAttribPointer(VertexPosition, Quad.VertexSize, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.useProgram(null);
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        requestAnimationFrame(Render);
    }
}
/**
 * Rotates the quad
 *
 * @param DeltaTime {number}: time passed since the last frame
 * @returns {void}
 */
function RotateQuad(DeltaTime) {
    QuadRotationZ += 0.1 * TO_RADIAN * DeltaTime;
    if (QuadRotationZ > 2.0 * Math.PI) {
        QuadRotationZ = 0.0;
    }
    else if (QuadRotationZ < -2.0 * Math.PI) {
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
function Render() {
    if (bFirstTime) {
        bFirstTime = false;
        StartTime = Date.now();
    }
    else {
        var EndTime = Date.now();
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
