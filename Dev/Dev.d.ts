declare class Mesh
{
    public Vertices: Float32Array;
    public Indices: Uint16Array;
    public TextureCoordinates: Float32Array;
    public Normals: Float32Array | null;
    public NumOfIndices: number;
    constructor(Vertices: Float32Array, Indices: Uint16Array, TextureCoordinates: Float32Array, Normals: Float32Array | null, NumOfIndices: number);
}
declare function GenTriangle(): Mesh;
declare function GenQuad(): Mesh;
declare function Gen3DQuad(): Mesh;
declare function GenCube(): Mesh;
declare function CompileShaders(GL: WebGLRenderingContext, VertexShaderSource: string, FragmentShaderSource: string): WebGLProgram | null;