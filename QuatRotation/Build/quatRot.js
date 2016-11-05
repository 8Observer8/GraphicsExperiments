/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
"use strict";
/******************************** SHADERS *********************************/
/* Source of vertex shader */
var VertexShaderSource = "#version 100\n" +
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
var FragmentShaderSource = "#version 100\n" +
    "precision mediump float;\n" +
    "varying vec3 vColor;\n" +
    "void main(void){\n" +
    "gl_FragColor = vec4(vColor, 1.0);\n" +
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
var Axis_X = Vec3.FromValues(1, 0, 0);
var Axis_Y = Vec3.FromValues(0, 1, 0);
var Axis_Z = Vec3.FromValues(0, 0, 1);
/* Shading program */
var ShaderProgram = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);
/* Cube mesh */
var Cube = GenCube();
/* Colors */
var CubeColors = new Float32Array([
    // Front face
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    // Back face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    // Top face 
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    // Bottom face 
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    // Right face 
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0, 1.0,
    // Left face
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0
]);
/* Vertex buffer to hold vertex data */
var VertexBuffer = GL.createBuffer();
/* Index buffer to hold index data */
var IndexBuffer = GL.createBuffer();
/* Color buffer to store the color data */
var ColorBuffer = GL.createBuffer();
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
/* Fielf of view */
var CameraFOV = 75.0 * TO_RADIAN;
/**************************************************************************/
/********************************** CUBE **********************************/
/* Model Matrix of the quad */
var ModelMat = Mat4.Create();
/* Model-view matrix of the quad */
var ModelViewMat = Mat4.Create();
/* Position of the quad */
var CubePosition = Vec3.Create();
/* Rotation value of the quad */
var CubeQuatRotation = Quat.Create();
/* Rotation around X axis */
var CubeQuatRotationX = Quat.Create();
/* Rotation around Y axis */
var CubeQuatRotationY = Quat.Create();
/* Rotation around Z axis */
var CubeQuatRotationZ = Quat.Create();
/* Scaling vector of the quad */
var CubeScaling = Vec3.FromValues(1, 1, 1);
/* Cube's orientation around X axis */
var CubeRotationX = 0.0;
/* Cube's orientation around Y axis */
var CubeRotationY = 0.0;
/* Cube's orientation around Z axis */
var CubeRotationZ = 0.0;
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
    GL.bindBuffer(GL.ARRAY_BUFFER, ColorBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, CubeColors, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.useProgram(ShaderProgram);
    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
    var VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");
    GL.enableVertexAttribArray(VertexPosition);
    GL.vertexAttribPointer(VertexPosition, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ARRAY_BUFFER, ColorBuffer);
    var ColorPosition = GL.getAttribLocation(ShaderProgram, "aColor");
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
function RotateQuad(DeltaTime) {
    CubeRotationX += 0.1 * TO_RADIAN * DeltaTime;
    CubeRotationY += 0.1 * TO_RADIAN * DeltaTime;
    CubeRotationZ += 0.1 * TO_RADIAN * DeltaTime;
    if (CubeRotationX > 2.0 * Math.PI || CubeRotationX < -2.0 * Math.PI) {
        CubeRotationX = 0.0;
    }
    if (CubeRotationY > 2.0 * Math.PI || CubeRotationY < -2.0 * Math.PI) {
        CubeRotationY = 0.0;
    }
    if (CubeRotationZ > 2.0 * Math.PI || CubeRotationZ < -2.0 * Math.PI) {
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
