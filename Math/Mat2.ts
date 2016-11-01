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

/******************************************************************************************************************************************/
/*														 Mat2 Class																		  */
/*																																		  */
/*	Mat2 class is responsible for 2D matrix operations necessary for graphics applications. All functions are inlined.					  */
/*																																		  */
/******************************************************************************************************************************************/

abstract class Mat2 
{
    /**
     * Returns a new identity matrix 
     * 
     * @returns {Float32Array}
     */
    public static Create(): Float32Array
    {
        return new Float32Array([1, 0, 0, 1]);
    }

    /**
     * Copies the given matrix 
     * 
     * @param GivenMat {Float32Array}: given matrix 
     * @returns {Float32Array}
     */
    public static Copy(GivenMat: Float32Array): Float32Array
    {
        return new Float32Array([GivenMat[0], GivenMat[1], GivenMat[2], GivenMat[3]]);
    }

    /**
     * Clones the given matrix 
     * 
     * @param OutMat {Float32Array}: result matrix 
     * @param MatToClone {Float32Array}: matrix to clone 
     * @returns {void}
     */
    public static Clone(OutMat: Float32Array, MatToClone: Float32Array): void 
    {
        OutMat[0] = MatToClone[0];
        OutMat[1] = MatToClone[1];
        OutMat[2] = MatToClone[2];
        OutMat[3] = MatToClone[3];
    }

    /**
     * Sets the given matrix to the identity matrix 
     * 
     * @param GivenMat {Float32Array}: given matrix 
     * @returns {void}
     */
    public static SetIdentity(GivenMat: Float32Array): void 
    {
        GivenMat[0] = 1;
        GivenMat[1] = 0;
        GivenMat[2] = 0;
        GivenMat[3] = 1;
    }

    /**
     * Returns the determinant of the given matrix 
     * 
     * @param GivenMat {Float32Array}: given matrix 
     * @returns {void}
     */
    public static Determinant(GivenMat: Float32Array): number
    {
        return GivenMat[0] * GivenMat[3] - GivenMat[2] * GivenMat[1];
    }

    /**
     * Returns true if two given matrices are equal, false otherwise 
     * 
     * @param FirstMat {Float32Array}: first matrix 
     * @param SecondMat {Float32Array}: second matrix 
     * @returns {boolean}
     */
    public static bEquals(FirstMat: Float32Array, SecondMat: Float32Array): boolean
    {
        return FirstMat[0] === SecondMat[0] && FirstMat[1] === SecondMat[1] &&
            FirstMat[2] === SecondMat[2] && FirstMat[3] === SecondMat[3];
    }

    /**
     * Inverts the given matrix 
     * 
     * @param OutMat {Float32Array}: result matrix 
     * @param MatToInvert {Float32Array}: matrix to invert 
     * @returns {void}
     */
    public static Invert(OutMat: Float32Array, MatToInvert: Float32Array): void 
    {
        const M00: number = MatToInvert[0];
        const M01: number = MatToInvert[1];
        const M10: number = MatToInvert[2];
        const M11: number = MatToInvert[3];

        let Determinant: number = Mat2.Determinant(MatToInvert);

        if(Determinant)
        {
            Determinant = 1.0 / Determinant;

            OutMat[0] = M11 * Determinant;
            OutMat[1] = -M01 * Determinant;
            OutMat[2] = -M10 * Determinant;
            OutMat[3] = M00 * Determinant;
        }
    }

    /**
     * Multiplies the given two matrices 
     * 
     * @param OutMat {Float32Array}: result matrix 
     * @param FirstMat {Float32Array}: first matrix 
     * @param SecondMat {Float32Array}: second matrix 
     * @returns {void}
     */
    public static Multiply(OutMat: Float32Array, FirstMat: Float32Array, SecondMat: Float32Array): void 
    {
        const A0: number = FirstMat[0];
        const A1: number = FirstMat[1];
        const A2: number = FirstMat[2];
        const A3: number = FirstMat[3];

        const B0: number = SecondMat[0];
        const B1: number = SecondMat[1];
        const B2: number = SecondMat[2];
        const B3: number = SecondMat[3];

        OutMat[0] = A0 * B0 + A2 * B1;
        OutMat[1] = A1 * B0 + A3 * B1;
        OutMat[2] = A0 * B2 + A2 * B3;
        OutMat[3] = A1 * B2 + A3 * B3;
    }

    /**
     * Transposes the given matrix 
     * 
     * @param OutMat {Float32Array}: result matrix 
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void} 
     */
    public static Transpose(OutMat: Float32Array, MatToTranspose: Float32Array): void 
    {
        OutMat[0] = MatToTranspose[0];
        OutMat[1] = MatToTranspose[2];
        OutMat[2] = MatToTranspose[1];
        OutMat[3] = MatToTranspose[3];
    }

    /**
     * Transposes the given matrix 
     * 
     * @param OutMat {Float32Array}: result matrix 
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void} 
     */
    public static TransposeItself(MatToTranspose: Float32Array): void 
    {
        const A1: number = MatToTranspose[1];

        MatToTranspose[1] = MatToTranspose[2];
        MatToTranspose[2] = A1;
    }
}