/*
* The MIT License (MIT)
* Copyright (c) <2016> <Omar Huseynov>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
* persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
* ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
* THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

class Mesh 
{
    /* Vertices of the mesh */
    public Vertices: Float32Array;

    /* Indices of the mesh */
    public Indices: Uint16Array;

    /* Texture coordinates of the mesh */
    public TextureCoordinates: Float32Array;

    /* Normals of the mesh */
    public Normals: Float32Array | null;

    /* Total number of indices */
    public NumOfIndices: number;

    /**
     * @constructor
     * 
     * @param Vertices {Float32Array}: vertices 
     * @param Indices {Uint16Array}: indices 
     * @param TextureCoordinates {Float32Array}: texture coordinates 
     * @param Normals {Float32Array}: normals 
     * @param NumOfIndices {number}: number of indices
     */
    constructor(Vertices: Float32Array, Indices: Uint16Array, TextureCoordinates: Float32Array, Normals: Float32Array | null, NumOfIndices: number)
    {
        this.Vertices = Vertices;

        this.Indices = Indices;

        this.TextureCoordinates = TextureCoordinates;

        this.Normals = Normals;

        this.NumOfIndices = NumOfIndices;
    }
}

/**
 * Generates a new triangle 
 * 
 * @returns {Mesh}
 */
function GenTriangle(): Mesh 
{
    const Vertices: Float32Array = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);

    const Indices: Uint16Array = new Uint16Array([0, 1, 2]);

    const TextureCoordinates: Float32Array = new Float32Array([0.0, 0.0, 1.0, 0.0, 0.5, 1.0]);

    const Normals: Float32Array | null = null;

    const TriangleMesh: Mesh = new Mesh(Vertices, Indices, TextureCoordinates, Normals, Indices.length);

    return TriangleMesh;
}

/**
 * Generates a new quad 
 * 
 * @returns {Mesh}
 */
function GenQuad(): Mesh 
{
    const Vertices: Float32Array = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);

    const Indices: Uint16Array = new Uint16Array([0, 1, 2, 2, 1, 3]);

    const TextureCoordinates: Float32Array = new Float32Array([0.0,  0.0, 1.0,  0.0,  0.0,  1.0, 1.0,  1.0]);

    const Normals: Float32Array | null = null;

    const QuadMesh: Mesh = new Mesh(Vertices, Indices, TextureCoordinates, Normals, Indices.length);

    return QuadMesh;
}

/**
 * Generates a new cube 
 * 
 * @returns {Mesh}
 */
function GenCube(): Mesh 
{
    const Vertices: Float32Array = new Float32Array(
        [
             // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,
            
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,
            
            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,
            
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ]);

    const Indices: Uint16Array = new Uint16Array(
        [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ]);

    const TextureCoordinates: Float32Array = new Float32Array(
        [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ]);

    const Normals: Float32Array = new Float32Array(
        [
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            
            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            
            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            
            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            
            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ]);

    const CubeMesh: Mesh = new Mesh(Vertices, Indices, TextureCoordinates, Normals, Indices.length);

    return CubeMesh;
}

/**
 * Generates a "3D" quad for use in 3D scenes 
 * 
 * @returns {Mesh}
 */
function Gen3DQuad(): Mesh
{
    const Vertices: Float32Array = new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);

    const Indices: Uint16Array = new Uint16Array([0, 1, 2, 2, 1, 3]);

    const TextureCoordinates: Float32Array = new Float32Array(
        [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            1.0,  1.0
        ]);

    const Normals: Float32Array | null = null;

    const Quad3DMesh: Mesh = new Mesh(Vertices, Indices, TextureCoordinates, Normals, Indices.length);

    return Quad3DMesh;
}