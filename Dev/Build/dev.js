"use strict";
function CompileShaders(GL, VertexShaderSource, FragmentShaderSource) {
    var VertexShader = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(VertexShader, VertexShaderSource);
    GL.compileShader(VertexShader);
    var Success = GL.getShaderParameter(VertexShader, GL.COMPILE_STATUS);
    if (!Success) {
        throw new Error("Vertex shader compilation failed: " + GL.getShaderInfoLog(VertexShader));
    }
    var FragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(FragmentShader, FragmentShaderSource);
    GL.compileShader(FragmentShader);
    Success = GL.getShaderParameter(FragmentShader, GL.COMPILE_STATUS);
    if (!Success) {
        throw new Error("Fragment shader compilation failed: " + GL.getShaderInfoLog(FragmentShader));
    }
    var ShaderProgram = GL.createProgram();
    GL.attachShader(ShaderProgram, VertexShader);
    GL.attachShader(ShaderProgram, FragmentShader);
    GL.linkProgram(ShaderProgram);
    Success = GL.getProgramParameter(ShaderProgram, GL.LINK_STATUS);
    if (!Success) {
        throw new Error("Shader linking failed: " + GL.getProgramInfoLog(ShaderProgram));
    }
    GL.deleteShader(VertexShader);
    GL.deleteShader(FragmentShader);
    return ShaderProgram;
}
var Mesh = (function () {
    function Mesh(Vertices, Indices, TextureCoordinates, Normals, NumOfIndices) {
        this.Vertices = Vertices;
        this.Indices = Indices;
        this.TextureCoordinates = TextureCoordinates;
        this.Normals = Normals;
        this.NumOfIndices = NumOfIndices;
    }
    return Mesh;
}());
function GenTriangle() {
    var Vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);
    var Indices = new Uint16Array([0, 1, 2]);
    var TextureCoordinates = new Float32Array([0.0, 0.0, 1.0, 0.0, 0.5, 1.0]);
    var Normals = null;
    var TriangleMesh = new Mesh(Vertices, Indices, TextureCoordinates, Normals, Indices.length);
    return TriangleMesh;
}
function GenQuad() {
    var Vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
    var Indices = new Uint16Array([0, 1, 2, 2, 1, 3]);
    var TextureCoordinates = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
    var Normals = null;
    var QuadMesh = new Mesh(Vertices, Indices, TextureCoordinates, Normals, Indices.length);
    return QuadMesh;
}
function GenCube() {
    var Vertices = new Float32Array([
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ]);
    var Indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);
    var TextureCoordinates = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);
    var Normals = new Float32Array([
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ]);
    var CubeMesh = new Mesh(Vertices, Indices, TextureCoordinates, Normals, Indices.length);
    return CubeMesh;
}
