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

    /* Size of one vertex */
    public VertexSize: number;

    /* Total number of indices */
    public NumOfIndices: number;

    /**
     * @constructor
     * 
     * @param Vertices {Float32Array}: vertices 
     * @param Indices {Uint16Array}: indices 
     */
    constructor(Vertices: Float32Array, Indices: Uint16Array, VertexSize: number, NumOfIndices: number)
    {
        this.Vertices = Vertices;

        this.Indices = Indices;

        this.VertexSize = VertexSize;

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

    let TriangleMesh: Mesh = new Mesh(Vertices, Indices, 2, 3);

    return TriangleMesh;
}