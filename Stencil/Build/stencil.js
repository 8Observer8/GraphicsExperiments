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
    "uniform sampler2D uDiffuseTexture;\n" +
    "uniform sampler2D uSpecularTexture;\n" +
    "varying vec3 vNormal;\n" +
    "varying vec3 vPixelPos;\n" +
    "varying vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "vec3 CubeAmbientColor = vec3(0.4, 0.4, 0.4);\n" +
    "vec3 CubeDiffuseColor = vec3(1.0, 1.0, 1.0);\n" +
    "vec3 CubeSpecularColor = vec3(1.0, 1.0, 1.0);\n" +
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
    "vec3 DiffuseColor = DiffuseAmount * CubeDiffuseColor * PointLightDiffuseColor * vec3(texture2D(uDiffuseTexture, vTexCoords));\n" +
    "vec3 SpecularColor = SpecularAmount * CubeSpecularColor * PointLightSpecularColor * vec3(texture2D(uSpecularTexture, vTexCoords));\n" +
    "vec3 FinalColor = Attenuation * (DiffuseColor + SpecularColor);\n" +
    "FinalColor += CubeAmbientColor * PointLightAmbientColor * vec3(texture2D(uDiffuseTexture, vTexCoords));\n" +
    "gl_FragColor = vec4(FinalColor, 1.0);\n" +
    "}\n";
var SimpleVertexShader = "#version 100\n" +
    "attribute mediump vec3 aPosition;\n" +
    "uniform mediump mat4 uProjection;\n" +
    "uniform mediump mat4 uModelView;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);\n" +
    "}\n";
var SimpleFragmentShader = "#version 100\n" +
    "precision mediump float;\n" +
    "void main(void){\n" +
    "gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0);\n" +
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
var Cube = (function () {
    /**
     * @constructor
     *
     * @param VertexShaderSource {string}: source of the vertex shader
     * @param FragmentShaderSource {string}: source of the fragment shader
     * @param DiffuseTextureLocation {string}: Location of the diffuse texture
     * @param SpecularTexture {string}: Location of the specular texture
     */
    function Cube(VertexShaderSource, FragmentShaderSource, DiffuseTextureLocation, SpecularTextureLocation) {
        this.VertexShaderSource = VertexShaderSource;
        this.FragmentShaderSource = FragmentShaderSource;
        this.ShaderProgram = CompileShaders(GL, this.VertexShaderSource, this.FragmentShaderSource);
        this.CubeMesh = GenCube();
        this.InitBuffers();
        this.InitMatrices();
        this.InitLocations();
        this.ProcessBuffers();
        this.ProcessVertices();
        this.DiffuseTexture = {};
        this.SpecularTexture = {};
        this.InitTextures(this.DiffuseTexture, DiffuseTextureLocation);
        this.InitTextures(this.SpecularTexture, SpecularTextureLocation);
    }
    /**
     * Initializes the textures
     *
     * @returns {void}
     */
    Cube.prototype.InitTextures = function (TextureToInit, TextureLocation) {
        TextureToInit.TextureSource = TextureLocation;
        TextureToInit.TextureGL = GL.createTexture();
        TextureToInit.TextureImage = new Image();
        var CubeObject = this;
        TextureToInit.TextureImage.onload = function () {
            CubeObject.ProcessTexture(TextureToInit);
        };
        TextureToInit.TextureImage.src = TextureToInit.TextureSource;
    };
    /**
     * Processes the texture
     *
     * @param TextureToProcess {ITexture}: texture to process
     * @returns {void}
     */
    Cube.prototype.ProcessTexture = function (TextureToProcess) {
        GL.bindTexture(GL.TEXTURE_2D, TextureToProcess.TextureGL);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, TextureToProcess.TextureImage);
        GL.generateMipmap(GL.TEXTURE_2D);
        GL.bindTexture(GL.TEXTURE_2D, null);
    };
    /**
     * Initializes the buffers
     *
     * @returns {void}
     */
    Cube.prototype.InitBuffers = function () {
        this.CubeBuffer = {};
        this.CubeBuffer.VertexBuffer = GL.createBuffer();
        this.CubeBuffer.IndexBuffer = GL.createBuffer();
        this.CubeBuffer.NormalBuffer = GL.createBuffer();
        this.CubeBuffer.TexBuffer = GL.createBuffer();
    };
    /**
     * Initializes the matrices
     *
     * @returns {void}
     */
    Cube.prototype.InitMatrices = function () {
        this.Matrices = {};
        this.Matrices.ModelMat = Mat4.Create();
        this.Matrices.ModelViewMat = Mat4.Create();
        this.Matrices.NormalMat = Mat3.Create();
    };
    /**
     * Initializes the locations
     *
     * @returns {void}
     */
    Cube.prototype.InitLocations = function () {
        this.Locations = {};
        this.Locations.uModelLocation = GL.getUniformLocation(this.ShaderProgram, "uModel");
        this.Locations.uModelViewLocation = GL.getUniformLocation(this.ShaderProgram, "uModelView");
        this.Locations.uNormalLocation = GL.getUniformLocation(this.ShaderProgram, "uNormalMat");
        this.Locations.uProjectionLocation = GL.getUniformLocation(this.ShaderProgram, "uProjection");
        this.Locations.uViewPosLocation = GL.getUniformLocation(this.ShaderProgram, "uViewPos");
    };
    /**
     * Process the buffers
     *
     * @returns {void}
     */
    Cube.prototype.ProcessBuffers = function () {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, this.CubeMesh.Vertices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.CubeMesh.Indices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.NormalBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, this.CubeMesh.Normals, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.TexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, this.CubeMesh.TextureCoordinates, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    };
    /**
     * Processes the vertices
     *
     * @returns {void}
     */
    Cube.prototype.ProcessVertices = function () {
        GL.useProgram(this.ShaderProgram);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);
        var VertexLocation = GL.getAttribLocation(this.ShaderProgram, "aPosition");
        GL.enableVertexAttribArray(VertexLocation);
        GL.vertexAttribPointer(VertexLocation, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.NormalBuffer);
        var NormalLocation = GL.getAttribLocation(this.ShaderProgram, "aNormal");
        GL.enableVertexAttribArray(NormalLocation);
        GL.vertexAttribPointer(NormalLocation, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.TexBuffer);
        var TexCoordLocation = GL.getAttribLocation(this.ShaderProgram, "aTexCoords");
        GL.enableVertexAttribArray(TexCoordLocation);
        GL.vertexAttribPointer(TexCoordLocation, 2, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.useProgram(null);
    };
    /**
     * Renders this cube
     *
     * @returns {void}
     */
    Cube.prototype.Render = function () {
        Mat4.FromRotationTranslationScale(this.Matrices.ModelMat, this.Transform.Rotation, this.Transform.Position, this.Transform.Scaling);
        Mat3.CreateNormalMat(this.Matrices.NormalMat, this.Matrices.ModelMat);
        Mat4.Multiply(this.Matrices.ModelViewMat, CameraViewMat, this.Matrices.ModelMat);
        GL.useProgram(this.ShaderProgram);
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, this.DiffuseTexture.TextureGL);
        GL.activeTexture(GL.TEXTURE1);
        GL.bindTexture(GL.TEXTURE_2D, this.SpecularTexture.TextureGL);
        GL.uniformMatrix4fv(this.Locations.uProjectionLocation, false, CameraProjectionMat);
        GL.uniformMatrix4fv(this.Locations.uModelViewLocation, false, this.Matrices.ModelViewMat);
        GL.uniformMatrix4fv(this.Locations.uModelLocation, false, this.Matrices.ModelMat);
        GL.uniformMatrix3fv(this.Locations.uNormalLocation, false, this.Matrices.NormalMat);
        GL.uniform3fv(this.Locations.uViewPosLocation, CameraPosition);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);
        GL.drawElements(GL.TRIANGLES, this.CubeMesh.NumOfIndices, GL.UNSIGNED_SHORT, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        GL.bindTexture(GL.TEXTURE_2D, null);
        GL.useProgram(null);
    };
    return Cube;
}());
/**
 * @class
 */
var CubeForStencil = (function () {
    /**
     * @constructor
     *
     * @param VertexShaderSource {string}: source of the vertex shader
     * @param FragmentShaderSource {string}: source of the fragment shader
     */
    function CubeForStencil(VertexShaderSource, FragmentShaderSource) {
        this.VertexShaderSource = VertexShaderSource;
        this.FragmentShaderSource = FragmentShaderSource;
        this.ShaderProgram = CompileShaders(GL, this.VertexShaderSource, this.FragmentShaderSource);
        this.CubeMesh = GenCube();
        this.InitBuffers();
        this.InitMatrices();
        this.InitLocations();
        this.ProcessBuffers();
        this.ProcessVertices();
    }
    /**
     * Initializes the buffers
     *
     * @returns {void}
     */
    CubeForStencil.prototype.InitBuffers = function () {
        this.CubeBuffer = {};
        this.CubeBuffer.VertexBuffer = GL.createBuffer();
        this.CubeBuffer.IndexBuffer = GL.createBuffer();
    };
    /**
     * Initializes the matrices
     *
     * @returns {void}
     */
    CubeForStencil.prototype.InitMatrices = function () {
        this.Matrices = {};
        this.Matrices.ModelMat = Mat4.Create();
        this.Matrices.ModelViewMat = Mat4.Create();
    };
    /**
     * Initializes the locations
     *
     * @returns {void}
     */
    CubeForStencil.prototype.InitLocations = function () {
        this.Locations = {};
        this.Locations.uModelViewLocation = GL.getUniformLocation(this.ShaderProgram, "uModelView");
        this.Locations.uProjectionLocation = GL.getUniformLocation(this.ShaderProgram, "uProjection");
    };
    /**
     * Process the buffers
     *
     * @returns {void}
     */
    CubeForStencil.prototype.ProcessBuffers = function () {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, this.CubeMesh.Vertices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.CubeMesh.Indices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    };
    /**
     * Processes the vertices
     *
     * @returns {void}
     */
    CubeForStencil.prototype.ProcessVertices = function () {
        GL.useProgram(this.ShaderProgram);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);
        var VertexLocation = GL.getAttribLocation(this.ShaderProgram, "aPosition");
        GL.enableVertexAttribArray(VertexLocation);
        GL.vertexAttribPointer(VertexLocation, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.useProgram(null);
    };
    /**
     * Renders this cube
     *
     * @returns {void}
     */
    CubeForStencil.prototype.Render = function () {
        Mat4.FromRotationTranslationScale(this.Matrices.ModelMat, this.Transform.Rotation, this.Transform.Position, this.Transform.Scaling);
        Mat4.Multiply(this.Matrices.ModelViewMat, CameraViewMat, this.Matrices.ModelMat);
        GL.useProgram(this.ShaderProgram);
        GL.uniformMatrix4fv(this.Locations.uProjectionLocation, false, CameraProjectionMat);
        GL.uniformMatrix4fv(this.Locations.uModelViewLocation, false, this.Matrices.ModelViewMat);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);
        GL.drawElements(GL.TRIANGLES, this.CubeMesh.NumOfIndices, GL.UNSIGNED_SHORT, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        GL.useProgram(null);
    };
    return CubeForStencil;
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
/********************************* CUBES **********************************/
var FloorCube = new Cube(VertexShaderSource, FragmentShaderSource, "../Assets/Textures/wood_texture.jpg", "../Assets/Textures/wood_texture.jpg");
var NormalCube = new Cube(VertexShaderSource, FragmentShaderSource, "../Assets/Textures/Box.png", "../Assets/Textures/BoxSpecular.png");
var NormalCubeForStencil = new CubeForStencil(SimpleVertexShader, SimpleFragmentShader);
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
    GL.depthFunc(GL.LESS);
    GL.enable(GL.STENCIL_TEST);
    GL.stencilOp(GL.KEEP, GL.KEEP, GL.REPLACE);
    FloorCube.Transform = {};
    FloorCube.Transform.Position = Vec3.Create();
    FloorCube.Transform.Rotation = Quat.Create();
    FloorCube.Transform.Scaling = Vec3.FromValues(10, 0.1, 10);
    NormalCube.Transform = {};
    NormalCube.Transform.Position = Vec3.FromValues(5, 7.5, 0);
    NormalCube.Transform.Rotation = Quat.Create();
    NormalCube.Transform.Scaling = Vec3.FromValues(1, 1, 1);
    NormalCubeForStencil.Transform = {};
    NormalCubeForStencil.Transform.Position = NormalCube.Transform.Position;
    NormalCubeForStencil.Transform.Rotation = NormalCube.Transform.Rotation;
    NormalCubeForStencil.Transform.Scaling = Vec3.FromValues(1.1, 1.1, 1.1);
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
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT);
    /* First draw the floor, but don't write to stencil buffer */
    GL.stencilMask(0x00);
    FloorCube.Render();
    /* 1st Render Pass: Draw the "outline" cube and write to stencil buffer */
    GL.stencilFunc(GL.NOTEQUAL, 1, 0xFF);
    GL.stencilMask(0xFF);
    GL.disable(GL.DEPTH_TEST);
    NormalCubeForStencil.Render();
    /* 2nd Render Pass: Now disable writing to stencil buffer, and draw normal objects */
    GL.stencilFunc(GL.ALWAYS, 1, 0xFF);
    GL.stencilMask(0x00);
    GL.enable(GL.DEPTH_TEST);
    NormalCube.Render();
    /* Start filling the stencil buffer again */
    GL.stencilMask(0xFF);
    requestAnimationFrame(Render);
}
Init();
