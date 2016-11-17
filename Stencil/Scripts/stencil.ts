/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />

"use strict";

/******************************** SHADERS *********************************/

/* Source of vertex shader */
const VertexShaderSource: string = "#version 100\n" +
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
const FragmentShaderSource: string = "#version 100\n" +
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

const SimpleVertexShader: string = "#version 100\n" +
                                    "attribute mediump vec3 aPosition;\n" +
                                    "uniform mediump mat4 uProjection;\n" +
                                    "uniform mediump mat4 uModelView;\n" +
                                    "void main(void){\n" +
                                    "gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);\n" +
                                    "}\n";

const SimpleFragmentShader: string = "#version 100\n" +
                                     "precision mediump float;\n" +
                                     "void main(void){\n" +
                                     "gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0);\n" +
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

/**
 * @interface
 */
interface IBuffer
{
    /* Buffer to store vertex data */
    VertexBuffer: WebGLBuffer | null;

    /* Buffer to store index data */
    IndexBuffer: WebGLBuffer | null;

    /* Buffer to store normal data */
    NormalBuffer: WebGLBuffer | null;

    /* Buffer to store texture coordinate data */
    TexBuffer: WebGLBuffer | null;
}

/**
 * @interface
 */
interface IMat
{
    /* Model matrix */
    ModelMat: Float32Array;

    /* Model view matrix */
    ModelViewMat: Float32Array;

    /* Normal matrix */
    NormalMat: Float32Array;
}

/**
 * @interface
 */
interface ITransform
{
    /* Position */
    Position: Float32Array;

    /* Quaternion rotation */
    Rotation: Float32Array;

    /* Scaling */
    Scaling: Float32Array;
}

/**
 * @interface
 */
interface ILocation
{
    /* Location of model matrix */
    uModelLocation: number;

    /* Location of model view matrix */
    uModelViewLocation: number;

    /* Location of camera position */
    uViewPosLocation: number;

    /* Location of normal matrix */
    uNormalLocation: number;
    
    /* Location of projection matrix */
    uProjectionLocation: number;

    /* Location of the diffuse texture */
    uDiffuseTextureLocation: number;

    /* Location of the specular texture */
    uSpecularTextureLocation: number;
}

/**
 * @interface
 */
interface ITexture
{
    /* Source of the texture */
    TextureSource: string;
    
    /* Texture image element */
    TextureImage: HTMLImageElement;

    /* Texture for WebGL */
    TextureGL: WebGLTexture;
}

/**
 * @class
 */
class Cube 
{
    /* Transform of cube */
    public Transform: ITransform;

    /* Diffuse texture */
    public DiffuseTexture: ITexture;

    /* Specular texture */
    public SpecularTexture: ITexture;

    /* Shading program */
    private ShaderProgram: WebGLProgram | null;

    /* Cube mesh */
    private CubeMesh: Mesh;

    /* Buffers to store data */
    private CubeBuffer: IBuffer;

    /* Necessary matrices */
    private Matrices: IMat;

    /* Locations in the shader */
    private Locations: ILocation;

    /* Source of the vertex shader */
    private VertexShaderSource: string;

    /* Source of the fragment shader */
    private FragmentShaderSource: string;

    /**
     * @constructor
     * 
     * @param VertexShaderSource {string}: source of the vertex shader 
     * @param FragmentShaderSource {string}: source of the fragment shader
     * @param DiffuseTextureLocation {string}: Location of the diffuse texture 
     * @param SpecularTexture {string}: Location of the specular texture
     */
    constructor(VertexShaderSource: string, FragmentShaderSource: string, 
        DiffuseTextureLocation: string, SpecularTextureLocation: string)
    {
        this.VertexShaderSource = VertexShaderSource;

        this.FragmentShaderSource = FragmentShaderSource;

        this.ShaderProgram = CompileShaders(GL, this.VertexShaderSource, this.FragmentShaderSource);

        this.CubeMesh = GenCube();

        this.InitBuffers();

        this.InitMatrices();

        this.InitLocations();

        this.ProcessBuffers();

        this.ProcessVertices();

        this.DiffuseTexture = <any>{};

        this.SpecularTexture = <any>{};

        this.InitTextures(this.DiffuseTexture, DiffuseTextureLocation);

        this.InitTextures(this.SpecularTexture, SpecularTextureLocation);
    }

    /**
     * Initializes the textures 
     * 
     * @returns {void}
     */
    private InitTextures(TextureToInit: ITexture, TextureLocation: string): void 
    {
        TextureToInit.TextureSource = TextureLocation;

        TextureToInit.TextureGL = GL.createTexture();

        TextureToInit.TextureImage = new Image();

        let CubeObject = this;

        TextureToInit.TextureImage.onload = function()
        {
            CubeObject.ProcessTexture(TextureToInit);
        };

        TextureToInit.TextureImage.src = TextureToInit.TextureSource;
    }

    /**
     * Processes the texture 
     * 
     * @param TextureToProcess {ITexture}: texture to process
     * @returns {void}
     */
    private ProcessTexture(TextureToProcess: ITexture): void 
    {
        GL.bindTexture(GL.TEXTURE_2D, TextureToProcess.TextureGL);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);

        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, TextureToProcess.TextureImage);

        GL.generateMipmap(GL.TEXTURE_2D);

        GL.bindTexture(GL.TEXTURE_2D, null);
    }

    /**
     * Initializes the buffers 
     * 
     * @returns {void}
     */
    private InitBuffers(): void 
    {
        this.CubeBuffer = <any>{};

        this.CubeBuffer.VertexBuffer = GL.createBuffer();

        this.CubeBuffer.IndexBuffer = GL.createBuffer();

        this.CubeBuffer.NormalBuffer = GL.createBuffer();
        
        this.CubeBuffer.TexBuffer = GL.createBuffer();
    }

    /**
     * Initializes the matrices 
     * 
     * @returns {void}
     */
    private InitMatrices(): void 
    {
        this.Matrices = <any>{};

        this.Matrices.ModelMat = Mat4.Create();

        this.Matrices.ModelViewMat = Mat4.Create();
        
        this.Matrices.NormalMat = Mat3.Create();
    }

    /**
     * Initializes the locations 
     * 
     * @returns {void}
     */
    private InitLocations(): void 
    {
        this.Locations = <any>{};
        
        this.Locations.uModelLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uModel");

        this.Locations.uModelViewLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uModelView");

        this.Locations.uNormalLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uNormalMat");

        this.Locations.uProjectionLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uProjection");

        this.Locations.uViewPosLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uViewPos");

        this.Locations.uDiffuseTextureLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uDiffuseTexture");

        this.Locations.uSpecularTextureLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uSpecularTexture");
    }

    /**
     * Process the buffers
     * 
     * @returns {void}
     */
    private ProcessBuffers(): void 
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, this.CubeMesh.Vertices, GL.STATIC_DRAW);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.CubeMesh.Indices, GL.STATIC_DRAW);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.NormalBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, <Float32Array>this.CubeMesh.Normals, GL.STATIC_DRAW);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.TexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, this.CubeMesh.TextureCoordinates, GL.STATIC_DRAW);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    /**
     * Processes the vertices 
     * 
     * @returns {void}
     */
    private ProcessVertices(): void 
    {
        GL.useProgram(this.ShaderProgram);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);

        const VertexLocation: number = GL.getAttribLocation(this.ShaderProgram, "aPosition");

        GL.enableVertexAttribArray(VertexLocation);

        GL.vertexAttribPointer(VertexLocation, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.NormalBuffer);

        const NormalLocation: number = GL.getAttribLocation(this.ShaderProgram, "aNormal");

        GL.enableVertexAttribArray(NormalLocation);

        GL.vertexAttribPointer(NormalLocation, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.TexBuffer);

        const TexCoordLocation: number = GL.getAttribLocation(this.ShaderProgram, "aTexCoords");

        GL.enableVertexAttribArray(TexCoordLocation);

        GL.vertexAttribPointer(TexCoordLocation, 2, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.useProgram(null);
    }

    /**
     * Renders this cube 
     * 
     * @returns {void}
     */
    public Render(): void 
    {
        Mat4.FromRotationTranslationScale(this.Matrices.ModelMat,
             this.Transform.Rotation, this.Transform.Position, this.Transform.Scaling);

        Mat3.CreateNormalMat(this.Matrices.NormalMat, this.Matrices.ModelMat);

        Mat4.Multiply(this.Matrices.ModelViewMat, CameraViewMat, this.Matrices.ModelMat);

        GL.useProgram(this.ShaderProgram);

        GL.activeTexture(GL.TEXTURE0);

        GL.uniform1i(this.Locations.uDiffuseTextureLocation, 0);

        GL.bindTexture(GL.TEXTURE_2D, this.DiffuseTexture.TextureGL);

        GL.activeTexture(GL.TEXTURE1);

        GL.uniform1i(this.Locations.uSpecularTextureLocation, 1);

        GL.bindTexture(GL.TEXTURE_2D, this.SpecularTexture.TextureGL);

        GL.uniformMatrix4fv(this.Locations.uProjectionLocation, false, CameraProjectionMat);

        GL.uniformMatrix4fv(this.Locations.uModelViewLocation, false, this.Matrices.ModelViewMat);

        GL.uniformMatrix4fv(this.Locations.uModelLocation, false, this.Matrices.ModelMat);

        GL.uniformMatrix3fv(this.Locations.uNormalLocation, false, this.Matrices.NormalMat);

        GL.uniform3fv(this.Locations.uViewPosLocation, CameraPosition);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);

            GL.drawElements(GL.TRIANGLES, this.CubeMesh.NumOfIndices, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

        GL.activeTexture(GL.TEXTURE0);

        GL.bindTexture(GL.TEXTURE_2D, null);

        GL.useProgram(null);
    }
}

/**
 * @class
 */
class CubeForStencil
{
    /* Transform of cube */
    public Transform: ITransform;

    /* Shading program */
    private ShaderProgram: WebGLProgram | null;

    /* Cube mesh */
    private CubeMesh: Mesh;

    /* Buffers to store data */
    private CubeBuffer: IBuffer;

    /* Necessary matrices */
    private Matrices: IMat;

    /* Locations in the shader */
    private Locations: ILocation;

    /* Source of the vertex shader */
    private VertexShaderSource: string;

    /* Source of the fragment shader */
    private FragmentShaderSource: string;

    /**
     * @constructor
     * 
     * @param VertexShaderSource {string}: source of the vertex shader 
     * @param FragmentShaderSource {string}: source of the fragment shader
     */
    constructor(VertexShaderSource: string, FragmentShaderSource: string)
    {
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
    private InitBuffers(): void 
    {
        this.CubeBuffer = <any>{};

        this.CubeBuffer.VertexBuffer = GL.createBuffer();

        this.CubeBuffer.IndexBuffer = GL.createBuffer();
    }

    /**
     * Initializes the matrices 
     * 
     * @returns {void}
     */
    private InitMatrices(): void 
    {
        this.Matrices = <any>{};

        this.Matrices.ModelMat = Mat4.Create();

        this.Matrices.ModelViewMat = Mat4.Create();
    }

    /**
     * Initializes the locations 
     * 
     * @returns {void}
     */
    private InitLocations(): void 
    {
        this.Locations = <any>{};

        this.Locations.uModelViewLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uModelView");

        this.Locations.uProjectionLocation = <number>GL.getUniformLocation(this.ShaderProgram, "uProjection");
    }

    /**
     * Process the buffers
     * 
     * @returns {void}
     */
    private ProcessBuffers(): void 
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);

        GL.bufferData(GL.ARRAY_BUFFER, this.CubeMesh.Vertices, GL.STATIC_DRAW);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);

        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, this.CubeMesh.Indices, GL.STATIC_DRAW);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }

    /**
     * Processes the vertices 
     * 
     * @returns {void}
     */
    private ProcessVertices(): void 
    {
        GL.useProgram(this.ShaderProgram);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.CubeBuffer.VertexBuffer);

        const VertexLocation: number = GL.getAttribLocation(this.ShaderProgram, "aPosition");

        GL.enableVertexAttribArray(VertexLocation);

        GL.vertexAttribPointer(VertexLocation, 3, GL.FLOAT, false, 0, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.useProgram(null);
    }

    /**
     * Renders this cube 
     * 
     * @returns {void}
     */
    public Render(): void 
    {
        Mat4.FromRotationTranslationScale(this.Matrices.ModelMat,
             this.Transform.Rotation, this.Transform.Position, this.Transform.Scaling);

        Mat4.Multiply(this.Matrices.ModelViewMat, CameraViewMat, this.Matrices.ModelMat);

        GL.useProgram(this.ShaderProgram);

        GL.uniformMatrix4fv(this.Locations.uProjectionLocation, false, CameraProjectionMat);

        GL.uniformMatrix4fv(this.Locations.uModelViewLocation, false, this.Matrices.ModelViewMat);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.CubeBuffer.IndexBuffer);

            GL.drawElements(GL.TRIANGLES, this.CubeMesh.NumOfIndices, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

        GL.useProgram(null);
    }
}

/**************************************************************************/

/*************************** ANIMATION AND ASPECT RATIO *******************/

let bFirstTime: boolean = true;

let StartTime: number;

let DeltaTime: number = 0.0;

let AspectRatio: number;

/**************************************************************************/

/********************************* CAMERA *********************************/

/* Position of the camera */
let CameraPosition: Float32Array = Vec3.FromValues(0, 10, 10);

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
let CameraTranslation: Float32Array = Vec3.FromValues(0, 10, 10);

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

/********************************* CUBES **********************************/

let FloorCube = new Cube(VertexShaderSource, FragmentShaderSource, "../Assets/Textures/wood_texture.jpg", "../Assets/Textures/wood_texture.jpg");

let NormalCube = new Cube(VertexShaderSource, FragmentShaderSource, "../Assets/Textures/Box.png", "../Assets/Textures/BoxSpecular.png");

let NormalCubeForStencil = new CubeForStencil(SimpleVertexShader, SimpleFragmentShader);

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

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    GL.enable(GL.DEPTH_TEST);

    GL.depthFunc(GL.LESS);

    GL.enable(GL.STENCIL_TEST);

    GL.stencilOp(GL.KEEP, GL.KEEP, GL.REPLACE);

    FloorCube.Transform = <any>{};

    FloorCube.Transform.Position = Vec3.Create();

    FloorCube.Transform.Rotation = Quat.Create();

    FloorCube.Transform.Scaling = Vec3.FromValues(10, 0.1, 10);

    NormalCube.Transform = <any>{};

    NormalCube.Transform.Position = Vec3.FromValues(5, 7.5, 0);

    NormalCube.Transform.Rotation = Quat.Create();

    NormalCube.Transform.Scaling = Vec3.FromValues(1, 1, 1);

    NormalCubeForStencil.Transform = <any>{};

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

    Vec3.Add(CameraLookAt, CameraPosition, CameraAxisZ);

    Mat4.CreateViewMat(CameraViewMat, CameraPosition, CameraLookAt, CameraAxisY);

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