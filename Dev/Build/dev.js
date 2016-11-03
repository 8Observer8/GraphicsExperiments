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
    function Mesh(Vertices, Indices, VertexSize, NumOfIndices) {
        this.Vertices = Vertices;
        this.Indices = Indices;
        this.VertexSize = VertexSize;
        this.NumOfIndices = NumOfIndices;
    }
    return Mesh;
}());
function GenTriangle() {
    var Vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);
    var Indices = new Uint16Array([0, 1, 2]);
    var TriangleMesh = new Mesh(Vertices, Indices, 2, Indices.length);
    return TriangleMesh;
}
function GenQuad() {
    var Vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
    var Indices = new Uint16Array([0, 1, 2, 2, 1, 3]);
    var QuadMesh = new Mesh(Vertices, Indices, 2, Indices.length);
    return QuadMesh;
}
function GenCube() {
    var Vertices = new Float32Array([
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0
    ]);
    var Indices = new Uint16Array([
        0, 1, 2,
        2, 3, 0,
        1, 5, 6,
        6, 2, 1,
        7, 6, 5,
        5, 4, 7,
        4, 0, 3,
        3, 7, 4,
        4, 5, 1,
        1, 0, 4,
        3, 2, 6,
        6, 7, 3
    ]);
    var CubeMesh = new Mesh(Vertices, Indices, 3, Indices.length);
    return CubeMesh;
}
