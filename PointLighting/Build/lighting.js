/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
"use strict";
/******************************** SHADERS *********************************/
/* Source of vertex shader */
var VertexShaderSource = "#version 100\n" +
    "attribute mediump vec3 aPosition;\n" +
    "attribute mediump vec3 aNormal;\n" +
    "attribute lowp vec2 aTexCoords;\n" +
    "uniform mediump mat4 uProjection;\n" +
    "uniform mediump mat4 uModelView;\n" +
    "uniform mediump mat4 uModel;\n" +
    "uniform mediump mat3 uNormalMat;\n" +
    "varying mediump vec3 vNormal;\n" +
    "varying mediump vec3 vPixelPos;\n" +
    "varying lowp vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1);\n" +
    "vNormal = normalize(uNormalMat * aNormal);\n" +
    "vPixelPos = vec3(uModel * vec4(aPosition, 1.0));\n" +
    "vTexCoords = aTexCoords;\n" +
    "}\n";
/* Source of fragment shader */
var FragmentShaderSource = "#version 100\n" +
    "precision mediump float;\n" +
    "uniform vec3 uViewPos;\n" +
    "uniform sampler2D uWoodTexture;\n" +
    "varying vec3 vNormal;\n" +
    "varying vec3 vPixelPos;\n" +
    "varying vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "vec3 CubeAmbientColor = vec3(0.5, 0.5, 0.5);\n" +
    "vec3 CubeDiffuseColor = vec3(1.0, 1.0, 1.0);\n" +
    "vec3 CubeSpecularColor = vec3(1.0, 1.0, 1.0);\n" +
    "vec3 PointLightPosition = vec3(0, 10, 0);\n" +
    "vec3 PointLightDirection = normalize(PointLightPosition - vPixelPos);\n" +
    "vec3 PointLightAmbientColor = vec3(0.1, 0.095, 0.09);\n" +
    "vec3 PointLightDiffuseColor = vec3(1.0, 0.95, 0.9);\n" +
    "vec3 PointLightSpecularColor = vec3(1.0, 1.0, 1.0);\n" +
    "float DistanceFromLight = length(vec3(PointLightPosition - vPixelPos));\n" +
    "float Attenuation = 1.0 / (1.0 + 0.045 * DistanceFromLight + 0.0075 * pow(DistanceFromLight, 2.0));\n" +
    "float DiffuseAmount = max(dot(vNormal, PointLightDirection), 0.0);\n" +
    "vec3 ViewDirection = normalize(uViewPos - vPixelPos);\n" +
    "vec3 HalfwayDirection = normalize(PointLightDirection + ViewDirection);\n" +
    "float SpecularAmount = pow(max(dot(vNormal, HalfwayDirection), 0.0), 32.0);\n" +
    "vec3 AmbientColor = CubeAmbientColor * PointLightAmbientColor;\n" +
    "vec3 DiffuseColor = DiffuseAmount * CubeDiffuseColor * PointLightDiffuseColor;\n" +
    "vec3 SpecularColor = SpecularAmount * CubeSpecularColor * PointLightSpecularColor;\n" +
    "vec3 FinalColor = Attenuation * (DiffuseColor + SpecularColor);\n" +
    "FinalColor += AmbientColor;\n" +
    "gl_FragColor = vec4(FinalColor, 1.0) * texture2D(uWoodTexture, vec2(vTexCoords.s * 2.0, vTexCoords.t * 2.0));\n" +
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
/* Normal buffer to hold the normal data */
var NormalBuffer = GL.createBuffer();
/* Texture buffer to store texture coordinates */
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
var CameraPosition = Vec3.FromValues(0, 10, 10);
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
var CAMERA_ROTATION_SPEED = 0.01;
/* Camera translation vector */
var CameraTranslation = Vec3.FromValues(0, 10, 10);
/* Orientation of the camera */
var CameraOrientation = Quat.Create();
/* Camera rotation around x axis */
var CameraRotationX = Quat.Create();
/* Camera rotation around y axis */
var CameraRotationY = Quat.Create();
/* Rotation value of camera around x axis in degrees */
var CameraRotationXInDegrees = 0.0 * TO_RADIAN;
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
/* Normal matrix to transform the normals */
var NormalMat = Mat3.Create();
/* Position of the cube */
var CubePosition = Vec3.Create();
/* Rotation value of the cube around z axis */
var CubeRotation = Quat.Create();
/* Scaling vector of the cube */
var CubeScaling = Vec3.FromValues(10, 0.1, 10);
/**************************************************************************/
/******************************** LOCATIONS *******************************/
var uModelViewLocation = GL.getUniformLocation(ShaderProgram, "uModelView");
var uProjectionLocation = GL.getUniformLocation(ShaderProgram, "uProjection");
var uNormalLocation = GL.getUniformLocation(ShaderProgram, "uNormalMat");
var uModelLocation = GL.getUniformLocation(ShaderProgram, "uModel");
var uViewPosLocation = GL.getUniformLocation(ShaderProgram, "uViewPos");
var uWoodTextureLocation = GL.getUniformLocation(ShaderProgram, "uWoodTexture");
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
        CameraRotationXInDegrees += -Event.movementY * TO_RADIAN * CAMERA_ROTATION_SPEED * DeltaTime;
        if (CameraRotationXInDegrees >= 85.0 * TO_RADIAN) {
            CameraRotationXInDegrees = 85.0 * TO_RADIAN;
            Quat.SetIdentity(CameraRotationX);
        }
        else if (CameraRotationXInDegrees <= -85.0 * TO_RADIAN) {
            CameraRotationXInDegrees = -85.0 * TO_RADIAN;
            Quat.SetIdentity(CameraRotationX);
        }
        else {
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
/********************************* TEXTURE ********************************/
/* Image of the illuminati */
var WoodImage;
/* Texture for WebGL */
var WoodTexture;
/* Location of the texture */
var WoodTextureSource = "../Assets/Textures/wood_texture.jpg";
/**
 * Processes the texture
 *
 * @returns {void}
 */
function ProcessTexture() {
    GL.bindTexture(GL.TEXTURE_2D, WoodTexture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, WoodImage);
    GL.generateMipmap(GL.TEXTURE_2D);
    GL.bindTexture(GL.TEXTURE_2D, null);
}
/**
 * Initializes the texture
 *
 * @returns {void}
 */
function InitTexture() {
    WoodTexture = GL.createTexture();
    WoodImage = new Image();
    WoodImage.onload = ProcessTexture;
    WoodImage.src = WoodTextureSource;
}
InitTexture();
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
    GL.bindBuffer(GL.ARRAY_BUFFER, NormalBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, Cube.Normals, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ARRAY_BUFFER, TexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, Cube.TextureCoordinates, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Cube.Indices, GL.STATIC_DRAW);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    GL.useProgram(ShaderProgram);
    GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
    var VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");
    GL.enableVertexAttribArray(VertexPosition);
    GL.vertexAttribPointer(VertexPosition, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ARRAY_BUFFER, NormalBuffer);
    var NormalPosition = GL.getAttribLocation(ShaderProgram, "aNormal");
    GL.enableVertexAttribArray(NormalPosition);
    GL.vertexAttribPointer(NormalPosition, 3, GL.FLOAT, false, 0, 0);
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
    Vec3.Normalize(CameraAxisX, CameraAxisX);
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
        Vec3.MultiplyScalar(NewTranslation, CameraAxisY, CAMERA_TRANSLATION_SPEED * DeltaTime);
        Vec3.Add(CameraTranslation, CameraTranslation, NewTranslation);
    }
    else if (bE_Pressed) {
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
    GL.clearColor(0.25, 0.25, 0.35, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.useProgram(ShaderProgram);
    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, WoodTexture);
    GL.uniformMatrix4fv(uProjectionLocation, false, CameraProjectionMat);
    GL.uniformMatrix4fv(uModelViewLocation, false, ModelViewMat);
    GL.uniformMatrix4fv(uModelLocation, false, ModelMat);
    GL.uniformMatrix3fv(uNormalLocation, false, NormalMat);
    GL.uniform3fv(uViewPosLocation, CameraPosition);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);
    GL.drawElements(GL.TRIANGLES, Cube.NumOfIndices, GL.UNSIGNED_SHORT, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    GL.bindTexture(GL.TEXTURE_2D, null);
    GL.useProgram(null);
    requestAnimationFrame(Render);
}
Init();
