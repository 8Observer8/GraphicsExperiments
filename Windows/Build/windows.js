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
    "uniform mediump mat4 uModel;\n" +
    "uniform mediump mat3 uNormalMat;\n" +
    "varying mediump vec3 vNormal;\n" +
    "varying mediump vec3 vPixelPos;\n" +
    "varying lowp vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1);\n" +
    "vNormal = vec3(0, 1, 0);\n" +
    "vPixelPos = vec3(uModel * vec4(aPosition, 1.0));\n" +
    "vTexCoords = aTexCoords;\n" +
    "}\n";
/* Source of fragment shader */
var FragmentShaderSource = "#version 100\n" +
    "precision mediump float;\n" +
    "uniform vec3 uViewPos;\n" +
    "uniform sampler2D uDiffuseTexture;\n" +
    "uniform sampler2D uSpecularTexture;\n" +
    "varying vec3 vNormal;\n" +
    "varying vec3 vPixelPos;\n" +
    "varying vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "vec3 QuadAmbientColor = vec3(0.4, 0.4, 0.4);\n" +
    "vec3 QuadDiffuseColor = vec3(1.0, 1.0, 1.0);\n" +
    "vec3 QuadSpecularColor = vec3(1.0, 1.0, 1.0);\n" +
    "vec3 PointLightPosition = vec3(0, 10, 0);\n" +
    "vec3 PointLightDirection = normalize(PointLightPosition - vPixelPos);\n" +
    "vec3 PointLightAmbientColor = vec3(0.4, 0.4, 0.4);\n" +
    "vec3 PointLightDiffuseColor = vec3(1.0, 0.95, 0.9);\n" +
    "vec3 PointLightSpecularColor = vec3(1.0, 1.0, 1.0);\n" +
    "float DistanceFromLight = length(vec3(PointLightPosition - vPixelPos));\n" +
    "float Attenuation = 1.0 / (1.0 + 0.045 * DistanceFromLight + 0.0075 * pow(DistanceFromLight, 2.0));\n" +
    "float DiffuseAmount = max(dot(vNormal, PointLightDirection), 0.0);\n" +
    "vec3 ViewDirection = normalize(uViewPos - vPixelPos);\n" +
    "vec3 HalfwayDirection = normalize(PointLightDirection + ViewDirection);\n" +
    "float SpecularAmount = pow(max(dot(vNormal, HalfwayDirection), 0.0), 32.0);\n" +
    "vec3 DiffuseColor = DiffuseAmount * QuadDiffuseColor * PointLightDiffuseColor * vec3(texture2D(uDiffuseTexture, vTexCoords));\n" +
    "vec3 SpecularColor = SpecularAmount * QuadSpecularColor * PointLightSpecularColor * vec3(texture2D(uSpecularTexture, vTexCoords));\n" +
    "vec3 FinalColor = Attenuation * (DiffuseColor + SpecularColor);\n" +
    "FinalColor += QuadAmbientColor * PointLightAmbientColor * vec3(texture2D(uDiffuseTexture, vTexCoords));\n" +
    "gl_FragColor = vec4(FinalColor, 1.0);\n" +
    "}\n";
var SimpleVertexShader = "#version 100\n" +
    "attribute mediump vec3 aPosition;\n" +
    "attribute lowp vec2 aTexCoords;\n" +
    "uniform mediump mat4 uProjection;\n" +
    "uniform mediump mat4 uModelView;\n" +
    "varying lowp vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);\n" +
    "vTexCoords = aTexCoords;\n" +
    "}\n";
var SimpleFragmentShader = "#version 100\n" +
    "precision mediump float;\n" +
    "varying vec2 vTexCoords;\n" +
    "uniform sampler2D uDiffuseTexture;\n" +
    "void main(void){\n" +
    "vec4 Color = vec4(texture2D(uDiffuseTexture, vTexCoords));\n" +
    "if(Color.a < 0.1) discard;\n" +
    "gl_FragColor = Color;\n" +
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
/**
 * @class
 */
var Quad = (function () {
    /**
     * @constructor
     *
     * @param VertexShaderSource {string}: source of the vertex shader
     * @param FragmentShaderSource {string}: source of the fragment shader
     * @param DiffuseTextureLocation {string}: Location of the diffuse texture
     * @param SpecularTexture {string}: Location of the specular texture
     * @param MeshToUse {Mesh}: Mesh to use for rendering
     */
    function Quad(VertexShaderSource, FragmentShaderSource, DiffuseTextureLocation, SpecularTextureLocation, MeshToUse) {
        this.VertexShaderSource = VertexShaderSource;
        this.FragmentShaderSource = FragmentShaderSource;
        this.DiffuseTextureLocation = DiffuseTextureLocation;
        this.SpecularTextureLocation = SpecularTextureLocation;
        this.ShaderProgram = CompileShaders(GL, this.VertexShaderSource, this.FragmentShaderSource);
        this.QuadMesh = MeshToUse;
        this.InitBuffers();
        this.InitMatrices();
        this.InitLocations();
        this.ProcessBuffers();
        this.ProcessVertices();
        this.DiffuseTexture = {};
        this.SpecularTexture = {};
        this.InitTextures(this.DiffuseTexture, DiffuseTextureLocation);
        if (SpecularTextureLocation !== null) {
            this.InitTextures(this.SpecularTexture, SpecularTextureLocation);
        }
    }
    /**
     * Initializes the textures
     *
     * @returns {void}
     */
    Quad.prototype.InitTextures = function (TextureToInit, TextureLocation) {
        TextureToInit.TextureSource = TextureLocation;
        TextureToInit.TextureGL = GL.createTexture();
        TextureToInit.TextureImage = new Image();
        var QuadObject = this;
        TextureToInit.TextureImage.onload = function () {
            QuadObject.ProcessTexture(TextureToInit);
        };
        TextureToInit.TextureImage.src = TextureToInit.TextureSource;
    };
    /**
     * Processes the texture
     *
     * @param TextureToProcess {ITexture}: texture to process
     * @returns {void}
     */
    Quad.prototype.ProcessTexture = function (TextureToProcess) {
        GL.bindTexture(GL.TEXTURE_2D, TextureToProcess.TextureGL);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, TextureToProcess.TextureImage);
        GL.generateMipmap(GL.TEXTURE_2D);
        GL.bindTexture(GL.TEXTURE_2D, null);
    };
    /**
     * Initializes the buffers
     *
     * @returns {void}
     */
    Quad.prototype.InitBuffers = function () {
        this.QuadBuffer = {};
        this.QuadBuffer.VertexBuffer = GL.createBuffer();
        this.QuadBuffer.IndexBuffer = GL.createBuffer();
        this.QuadBuffer.TexBuffer = GL.createBuffer();
    };
    /**
     * Initializes the matrices
     *
     * @returns {void}
     */
    Quad.prototype.InitMatrices = function () {
        this.Matrices = {};
        this.Matrices.ModelMat = Mat4.Create();
        this.Matrices.ModelViewMat = Mat4.Create();
    };
    /**
     * Initializes the locations
     *
     * @returns {void}
     */
    Quad.prototype.InitLocations = function () {
        this.Locations = {};
        this.Locations.uModelViewLocation = GL.getUniformLocation(this.ShaderProgram, "uModelView");
        this.Locations.uViewPosLocation = GL.getUniformLocation(this.ShaderProgram, "uViewPos");
        this.Locations.uModelLocation = GL.getUniformLocation(this.ShaderProgram, "uModel");
        this.Locations.uProjectionLocation = GL.getUniformLocation(this.ShaderProgram, "uProjection");
        this.Locations.uDiffuseTextureLocation = GL.getUniformLocation(this.ShaderProgram, "uDiffuseTexture");
        if (this.SpecularTextureLocation !== null) {
            this.Locations.uSpecularTextureLocation = GL.getUniformLocation(this.ShaderProgram, "uSpecularTexture");
        }
    };
    /**
     * Process the buffers
     *
     * @returns {void}
     */
    Quad.prototype.ProcessBuffers = function () {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.QuadBuffer.VertexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, this.QuadMesh.Vertices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.QuadBuffer.IndexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.QuadMesh.Indices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.QuadBuffer.TexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, this.QuadMesh.TextureCoordinates, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    };
    /**
     * Processes the vertices
     *
     * @returns {void}
     */
    Quad.prototype.ProcessVertices = function () {
        GL.useProgram(this.ShaderProgram);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.QuadBuffer.VertexBuffer);
        var VertexLocation = GL.getAttribLocation(this.ShaderProgram, "aPosition");
        GL.enableVertexAttribArray(VertexLocation);
        GL.vertexAttribPointer(VertexLocation, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.QuadBuffer.TexBuffer);
        var TexCoordLocation = GL.getAttribLocation(this.ShaderProgram, "aTexCoords");
        GL.enableVertexAttribArray(TexCoordLocation);
        GL.vertexAttribPointer(TexCoordLocation, 2, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.useProgram(null);
    };
    /**
     * Renders this Quad
     *
     * @returns {void}
     */
    Quad.prototype.Render = function () {
        Mat4.FromRotationTranslationScale(this.Matrices.ModelMat, this.Transform.Rotation, this.Transform.Position, this.Transform.Scaling);
        Mat4.Multiply(this.Matrices.ModelViewMat, CameraViewMat, this.Matrices.ModelMat);
        GL.useProgram(this.ShaderProgram);
        GL.uniform3fv(this.Locations.uViewPosLocation, CameraPosition);
        GL.activeTexture(GL.TEXTURE0);
        GL.uniform1i(this.Locations.uDiffuseTextureLocation, 0);
        GL.bindTexture(GL.TEXTURE_2D, this.DiffuseTexture.TextureGL);
        if (this.SpecularTexture !== null) {
            GL.activeTexture(GL.TEXTURE1);
            GL.uniform1i(this.Locations.uSpecularTextureLocation, 1);
            GL.bindTexture(GL.TEXTURE_2D, this.SpecularTexture.TextureGL);
        }
        GL.uniformMatrix4fv(this.Locations.uProjectionLocation, false, CameraProjectionMat);
        GL.uniformMatrix4fv(this.Locations.uModelViewLocation, false, this.Matrices.ModelViewMat);
        GL.uniformMatrix4fv(this.Locations.uModelLocation, false, this.Matrices.ModelMat);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.QuadBuffer.IndexBuffer);
        GL.drawElements(GL.TRIANGLES, this.QuadMesh.NumOfIndices, GL.UNSIGNED_SHORT, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        GL.activeTexture(GL.TEXTURE0);
        GL.useProgram(null);
    };
    return Quad;
}());
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
/********************************* QuadS **********************************/
var MyQuadMesh = Gen3DQuad();
var MyWindow = new Quad(SimpleVertexShader, SimpleFragmentShader, "../Assets/Textures/PinkWindow.png", null, MyQuadMesh);
var MyAnotherWindow = new Quad(SimpleVertexShader, SimpleFragmentShader, "../Assets/Textures/PinkWindow.png", null, MyQuadMesh);
var AndAnotherWindow = new Quad(SimpleVertexShader, SimpleFragmentShader, "../Assets/Textures/PinkWindow.png", null, MyQuadMesh);
var Floor = new Quad(VertexShaderSource, FragmentShaderSource, "../Assets/Textures/wood_texture.jpg", null, MyQuadMesh);
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
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.enable(GL.DEPTH_TEST);
    GL.enable(GL.BLEND);
    GL.depthFunc(GL.LESS);
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    MyWindow.Transform = {};
    MyWindow.Transform.Position = Vec3.FromValues(0.0, 0.9, 0.0);
    MyWindow.Transform.Rotation = Quat.Create();
    MyWindow.Transform.Scaling = Vec3.FromValues(1, 1, 1);
    MyAnotherWindow.Transform = {};
    MyAnotherWindow.Transform.Position = Vec3.FromValues(2.0, 0.9, -2.0);
    MyAnotherWindow.Transform.Rotation = Quat.Create();
    MyAnotherWindow.Transform.Scaling = Vec3.FromValues(1, 1, 1);
    AndAnotherWindow.Transform = {};
    AndAnotherWindow.Transform.Position = Vec3.FromValues(-3.0, 0.9, -2.5);
    AndAnotherWindow.Transform.Rotation = Quat.Create();
    AndAnotherWindow.Transform.Scaling = Vec3.FromValues(1, 1, 1);
    Floor.Transform = {};
    Floor.Transform.Position = Vec3.FromValues(0.0, 0.0, 0.0);
    Floor.Transform.Rotation = Quat.Create();
    Floor.Transform.Scaling = Vec3.FromValues(10, 10, 0.1);
    Quat.SetFromAxisAngle(Floor.Transform.Rotation, new Float32Array([1, 0, 0]), 90 * TO_RADIAN);
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
    Vec3.Add(CameraLookAt, CameraPosition, CameraAxisZ);
    Mat4.CreateViewMat(CameraViewMat, CameraPosition, CameraLookAt, CameraAxisY);
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
    Floor.Render();
    GL.depthMask(false);
    MyWindow.Render();
    MyAnotherWindow.Render();
    AndAnotherWindow.Render();
    GL.depthMask(true);
    requestAnimationFrame(Render);
}
Init();
