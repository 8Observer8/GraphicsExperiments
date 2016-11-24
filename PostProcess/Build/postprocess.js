/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
/// <reference path='../../Include/webgl2.d.ts' />
"use strict";
/******************************** SHADERS *********************************/
/* Source of vertex shader */
var VertexShaderSource = "#version 300 es\n" +
    "layout (location = 0) in highp vec3 aPosition;\n" +
    "layout (location = 1) in lowp vec2 aTexCoords;\n" +
    "uniform mediump mat4 uProjection;\n" +
    "uniform mediump mat4 uModelView;\n" +
    "uniform mediump mat4 uModel;\n" +
    "uniform mediump mat3 uNormalMat;\n" +
    "out mediump vec3 vNormal;\n" +
    "out mediump vec3 vPixelPos;\n" +
    "out lowp vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_Position = uProjection * uModelView * vec4(aPosition, 1);\n" +
    "vNormal = vec3(0, 1, 0);\n" +
    "vPixelPos = vec3(uModel * vec4(aPosition, 1.0));\n" +
    "vTexCoords = aTexCoords;\n" +
    "}\n";
/* Source of fragment shader */
var FragmentShaderSource = "#version 300 es\n" +
    "precision highp float;\n" +
    "uniform vec3 uViewPos;\n" +
    "uniform sampler2D uDiffuseTexture;\n" +
    "uniform sampler2D uSpecularTexture;\n" +
    "in vec3 vNormal;\n" +
    "in vec3 vPixelPos;\n" +
    "in vec2 vTexCoords;\n" +
    "out vec4 Color;\n" +
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
    "vec3 DiffuseColor = DiffuseAmount * QuadDiffuseColor * PointLightDiffuseColor * vec3(texture(uDiffuseTexture, vTexCoords));\n" +
    "vec3 SpecularColor = SpecularAmount * QuadSpecularColor * PointLightSpecularColor * vec3(texture(uSpecularTexture, vTexCoords));\n" +
    "vec3 FinalColor = Attenuation * (DiffuseColor + SpecularColor);\n" +
    "FinalColor += QuadAmbientColor * PointLightAmbientColor * vec3(texture(uDiffuseTexture, vTexCoords));\n" +
    "Color = vec4(FinalColor, 1.0);\n" +
    "}\n";
var SimpleVertexShader = "#version 300 es\n" +
    "layout (location = 0) in mediump vec3 aPosition;\n" +
    "layout (location = 1) in lowp vec2 aTexCoords;\n" +
    "out lowp vec2 vTexCoords;\n" +
    "void main(void){\n" +
    "gl_Position = vec4(aPosition.x, aPosition.y, 0.0, 1.0);\n" +
    "vTexCoords = aTexCoords;\n" +
    "}\n";
var SimpleFragmentShader = "#version 300 es\n" +
    "precision highp float;\n" +
    "in vec2 vTexCoords;\n" +
    "uniform sampler2D uDiffuseTexture;\n" +
    "out vec4 EndColor;\n" +
    "void main(void){\n" +
    "const float Offset = 1.0 / 300.0;\n" +
    "vec2 AllOffsets[9];\n" +
    "AllOffsets[0] = vec2(-Offset, Offset); // top-left \n" +
    "AllOffsets[1] = vec2(0.0, Offset); // top-center \n" +
    "AllOffsets[2] = vec2(Offset, Offset); // top-right \n" +
    "AllOffsets[3] = vec2(-Offset, 0.0); // center-left \n" +
    "AllOffsets[4] = vec2(0.0, 0.0); // center-center \n" +
    "AllOffsets[5] = vec2(Offset, 0.0); // center-right \n" +
    "AllOffsets[6] = vec2(-Offset, -Offset); // bottom-left \n" +
    "AllOffsets[7] = vec2(0.0, -Offset); // bottom-center \n" +
    "AllOffsets[8] = vec2(Offset, -Offset); // bottom-right \n" +
    "float Kernel[9];\n" +
    "Kernel[0] = 1.0; Kernel[1] =  1.0; Kernel[2] = 1.0; \n" +
    "Kernel[3] = 1.0; Kernel[4] = -8.0; Kernel[5] = 1.0; \n" +
    "Kernel[6] = 1.0; Kernel[7] =  1.0; Kernel[8] = 1.0; \n" +
    "vec3 SampleTex[9];\n" +
    "for(int i = 0; i < 9; i++){\n" +
    "SampleTex[i] = vec3(texture(uDiffuseTexture, vTexCoords.st + AllOffsets[i]));\n" +
    "}\n" +
    "vec3 Color = vec3(0, 0, 0);\n" +
    "for(int i = 0; i < 9; i++){\n" +
    "Color += SampleTex[i] * Kernel[i];\n" +
    "}\n" +
    "// float AverageColor = 0.2126 * Color.r + 0.7152 * Color.g + 0.0722 * Color.b;\n" +
    "EndColor = vec4(Color.r, Color.g, Color.b, 1.0);\n" +
    "}\n";
/**************************************************************************/
/********************************** INIT **********************************/
/* Canvas element */
var CANVAS = document.createElement("canvas");
document.body.appendChild(CANVAS);
/* WebGL context */
var GL = CANVAS.getContext("webgl2", { antialias: false });
if (GL === null) {
    throw new Error("WebGL2 is not supported");
}
/**************************************************************************/
/*********************************** FBO **********************************/
var ShaderProgramForFBO = CompileShaders(GL, SimpleVertexShader, SimpleFragmentShader);
var VBOForFBO = GL.createBuffer();
var EBOForFBO = GL.createBuffer();
var TBOForFBO = GL.createBuffer();
var VAOForFBO = GL.createVertexArray();
var FBO = GL.createFramebuffer();
var RBO = GL.createRenderbuffer();
var TextureForFBO = GL.createTexture();
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
        this.VAO = GL.createVertexArray();
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
        GL.bindVertexArray(this.VAO);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.QuadBuffer.VertexBuffer);
        GL.enableVertexAttribArray(0);
        GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.QuadBuffer.TexBuffer);
        GL.enableVertexAttribArray(1);
        GL.vertexAttribPointer(1, 2, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.QuadBuffer.IndexBuffer);
        GL.bindVertexArray(null);
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
        GL.bindVertexArray(this.VAO);
        GL.drawElements(GL.TRIANGLES, this.QuadMesh.NumOfIndices, GL.UNSIGNED_SHORT, 0);
        GL.bindVertexArray(null);
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, null);
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
 * Main function
 *
 * @returns void
 */
function Init() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    AspectRatio = CANVAS.width / CANVAS.height;
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    Floor.Transform = {};
    Floor.Transform.Position = Vec3.FromValues(0.0, 0.0, 0.0);
    Floor.Transform.Rotation = Quat.Create();
    Floor.Transform.Scaling = Vec3.FromValues(10, 10, 0.1);
    Quat.SetFromAxisAngle(Floor.Transform.Rotation, new Float32Array([1, 0, 0]), 90 * TO_RADIAN);
    GL.useProgram(ShaderProgramForFBO);
    GL.bindVertexArray(VAOForFBO);
    GL.bindBuffer(GL.ARRAY_BUFFER, VBOForFBO);
    GL.bufferData(GL.ARRAY_BUFFER, MyQuadMesh.Vertices, GL.STATIC_DRAW);
    GL.enableVertexAttribArray(0);
    GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ARRAY_BUFFER, TBOForFBO);
    GL.bufferData(GL.ARRAY_BUFFER, MyQuadMesh.TextureCoordinates, GL.STATIC_DRAW);
    GL.enableVertexAttribArray(1);
    GL.vertexAttribPointer(1, 2, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, null);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, EBOForFBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, MyQuadMesh.Indices, GL.STATIC_DRAW);
    GL.bindVertexArray(null);
    GL.useProgram(null);
    GL.bindFramebuffer(GL.FRAMEBUFFER, FBO);
    GL.bindTexture(GL.TEXTURE_2D, TextureForFBO);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, CANVAS.width, CANVAS.height, 0, GL.RGB, GL.UNSIGNED_BYTE, null);
    GL.bindTexture(GL.TEXTURE_2D, null);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, TextureForFBO, 0);
    GL.bindRenderbuffer(GL.RENDERBUFFER, RBO);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, CANVAS.width, CANVAS.height);
    GL.bindRenderbuffer(GL.RENDERBUFFER, null);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, RBO);
    if (GL.checkFramebufferStatus(GL.FRAMEBUFFER) !== GL.FRAMEBUFFER_COMPLETE) {
        throw new Error("Framebuffer not complete!");
    }
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
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
    // 1st pass: render to texture
    GL.bindFramebuffer(GL.FRAMEBUFFER, FBO);
    GL.clearColor(0.25, 0.25, 0.35, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.enable(GL.DEPTH_TEST);
    Floor.Render();
    // 2nd pass: render the texture 
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
    GL.clearColor(1.0, 1.0, 1.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.disable(GL.DEPTH_TEST);
    GL.bindTexture(GL.TEXTURE_2D, TextureForFBO);
    GL.useProgram(ShaderProgramForFBO);
    GL.bindVertexArray(VAOForFBO);
    GL.drawElements(GL.TRIANGLES, MyQuadMesh.NumOfIndices, GL.UNSIGNED_SHORT, 0);
    GL.bindVertexArray(null);
    GL.useProgram(null);
    requestAnimationFrame(Render);
}
Init();
