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
/*														 Mat4 Class																		  */
/*																																		  */
/*	Mat4 class is responsible for 4D matrix operations necessary for graphics applications. All functions are inlined.					  */
/*																																		  */
/******************************************************************************************************************************************/

abstract class Mat4
{
    /**
     * Returns a new identity matrix 
     * 
     * @returns {Float32Array}
     */
    public static Create(): Float32Array
    {
        return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    /**
     * Copies the given matrix 
     * 
     * @param GivenMat {Float32Array}: given matrix 
     * @returns {Float32Array}
     */
    public static Copy(GivenMat: Float32Array): Float32Array
    {
        return new Float32Array([GivenMat[0], GivenMat[1], GivenMat[2],  GivenMat[3],
            GivenMat[4], GivenMat[5], GivenMat[6], GivenMat[7], 
            GivenMat[8], GivenMat[9], GivenMat[10], GivenMat[11],
            GivenMat[12], GivenMat[13], GivenMat[14], GivenMat[15]]);
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
        OutMat[4] = MatToClone[4];
        OutMat[5] = MatToClone[5];
        OutMat[6] = MatToClone[6];
        OutMat[7] = MatToClone[7];
        OutMat[8] = MatToClone[8];
        OutMat[9] = MatToClone[9];
        OutMat[10] = MatToClone[10];
        OutMat[11] = MatToClone[11];
        OutMat[12] = MatToClone[12];
        OutMat[13] = MatToClone[13];
        OutMat[14] = MatToClone[14];
        OutMat[15] = MatToClone[15];
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
        GivenMat[3] = 0;
        GivenMat[4] = 0;
        GivenMat[5] = 1;
        GivenMat[6] = 0;
        GivenMat[7] = 0;
        GivenMat[8] = 0;
        GivenMat[9] = 0;
        GivenMat[10] = 1;
        GivenMat[11] = 0;
        GivenMat[12] = 0;
        GivenMat[13] = 0;
        GivenMat[14] = 0;
        GivenMat[15] = 1;
    }

    /**
     * Returns the determinant of the given matrix 
     * 
     * @param GivenMat {Float32Array}: given matrix 
     * @returns {void}
     */
    public static Determinant(GivenMat: Float32Array): number
    {
        const A00: number = GivenMat[0], A01: number = GivenMat[1], A02: number = GivenMat[2], A03: number = GivenMat[3];
        const A10: number = GivenMat[4], A11: number = GivenMat[5], A12: number = GivenMat[6], A13: number = GivenMat[7];
        const A20: number = GivenMat[8], A21: number = GivenMat[9], A22: number = GivenMat[10], A23: number = GivenMat[11];
        const A30: number = GivenMat[12], A31: number = GivenMat[13], A32: number = GivenMat[14], A33: number = GivenMat[15];

        const B00: number = A00 * A11 - A01 * A10;
        const B01: number = A00 * A12 - A02 * A10;
        const B02: number = A00 * A13 - A03 * A10;
        const B03: number = A01 * A12 - A02 * A11;
        const B04: number = A01 * A13 - A03 * A11;
        const B05: number = A02 * A13 - A03 * A12;
        const B06: number = A20 * A31 - A21 * A30;
        const B07: number = A20 * A32 - A22 * A30;
        const B08: number = A20 * A33 - A23 * A30;
        const B09: number = A21 * A32 - A22 * A31;
        const B10: number = A21 * A33 - A23 * A31;
        const B11: number = A22 * A33 - A23 * A32;

        return B00 * B11 - B01 * B10 + B02 * B09 + B03 * B08 - B04 * B07 + B05 * B06;
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
        return FirstMat[0] == SecondMat[0] && FirstMat[1] == SecondMat[1] && FirstMat[2] == SecondMat[2] && FirstMat[3] == SecondMat[3] &&
				FirstMat[4] == SecondMat[4] && FirstMat[5] == SecondMat[5] && FirstMat[6] == SecondMat[6] && FirstMat[7] == SecondMat[7] &&
				FirstMat[8] == SecondMat[8] && FirstMat[9] == SecondMat[9] && FirstMat[10] == SecondMat[10] && FirstMat[11] == SecondMat[11] &&
				FirstMat[12] == SecondMat[12] && FirstMat[13] == SecondMat[13] && FirstMat[14] == SecondMat[14] && FirstMat[15] == SecondMat[15];
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
        const A00: number = MatToInvert[0], A01: number = MatToInvert[1], A02: number = MatToInvert[2], A03: number = MatToInvert[3];
        const A10: number = MatToInvert[4], A11: number = MatToInvert[5], A12: number = MatToInvert[6], A13: number = MatToInvert[7];
        const A20: number = MatToInvert[8], A21: number = MatToInvert[9], A22: number = MatToInvert[10], A23: number = MatToInvert[11];
        const A30: number = MatToInvert[12], A31: number = MatToInvert[13], A32: number = MatToInvert[14], A33: number = MatToInvert[15];

        const B00: number = A00 * A11 - A01 * A10;
        const B01: number = A00 * A12 - A02 * A10;
        const B02: number = A00 * A13 - A03 * A10;
        const B03: number = A01 * A12 - A02 * A11;
        const B04: number = A01 * A13 - A03 * A11;
        const B05: number = A02 * A13 - A03 * A12;
        const B06: number = A20 * A31 - A21 * A30;
        const B07: number = A20 * A32 - A22 * A30;
        const B08: number = A20 * A33 - A23 * A30;
        const B09: number = A21 * A32 - A22 * A31;
        const B10: number = A21 * A33 - A23 * A31;
        const B11: number = A22 * A33 - A23 * A32;

        let Determinant: number = B00 * B11 - B01 * B10 + B02 * B09 + B03 * B08 - B04 * B07 + B05 * B06;

        if (Determinant)
        {
            Determinant = 1.0 / Determinant;
        
            OutMat[0] = (A11 * B11 - A12 * B10 + A13 * B09) * Determinant;
            OutMat[1] = (A02 * B10 - A01 * B11 - A03 * B09) * Determinant;
            OutMat[2] = (A31 * B05 - A32 * B04 + A33 * B03) * Determinant;
            OutMat[3] = (A22 * B04 - A21 * B05 - A23 * B03) * Determinant;
            OutMat[4] = (A12 * B08 - A10 * B11 - A13 * B07) * Determinant;
            OutMat[5] = (A00 * B11 - A02 * B08 + A03 * B07) * Determinant;
            OutMat[6] = (A32 * B02 - A30 * B05 - A33 * B01) * Determinant;
            OutMat[7] = (A20 * B05 - A22 * B02 + A23 * B01) * Determinant;
            OutMat[8] = (A10 * B10 - A11 * B08 + A13 * B06) * Determinant;
            OutMat[9] = (A01 * B08 - A00 * B10 - A03 * B06) * Determinant;
            OutMat[10] = (A30 * B04 - A31 * B02 + A33 * B00) * Determinant;
            OutMat[11] = (A21 * B02 - A20 * B04 - A23 * B00) * Determinant;
            OutMat[12] = (A11 * B07 - A10 * B09 - A12 * B06) * Determinant;
            OutMat[13] = (A00 * B09 - A01 * B07 + A02 * B06) * Determinant;
            OutMat[14] = (A31 * B01 - A30 * B03 - A32 * B00) * Determinant;
            OutMat[15] = (A20 * B03 - A21 * B01 + A22 * B00) * Determinant;
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
        const A00: number = FirstMat[0], A01: number = FirstMat[1], A02: number = FirstMat[2], A03: number = FirstMat[3];
        const A10: number = FirstMat[4], A11: number = FirstMat[5], A12: number = FirstMat[6], A13: number = FirstMat[7];
        const A20: number = FirstMat[8], A21: number = FirstMat[9], A22: number = FirstMat[10], A23: number = FirstMat[11];
        const A30: number = FirstMat[12], A31: number = FirstMat[13], A32: number = FirstMat[14], A33: number = FirstMat[15];
        
        let B0: number = SecondMat[0];
        let B1: number = SecondMat[1];
        let B2: number = SecondMat[2];
        let B3: number = SecondMat[3];

        OutMat[0] = B0 * A00 + B1 * A10 + B2 * A20 + B3 * A30;
        OutMat[1] = B0 * A01 + B1 * A11 + B2 * A21 + B3 * A31;
        OutMat[2] = B0 * A02 + B1 * A12 + B2 * A22 + B3 * A32;
        OutMat[3] = B0 * A03 + B1 * A13 + B2 * A23 + B3 * A33;

        B0 = SecondMat[4];
        B1 = SecondMat[5];
        B2 = SecondMat[6];
        B3 = SecondMat[7];

        OutMat[4] = B0 * A00 + B1 * A10 + B2 * A20 + B3 * A30;
        OutMat[5] = B0 * A01 + B1 * A11 + B2 * A21 + B3 * A31;
        OutMat[6] = B0 * A02 + B1 * A12 + B2 * A22 + B3 * A32;
        OutMat[7] = B0 * A03 + B1 * A13 + B2 * A23 + B3 * A33;

        B0 = SecondMat[8];
        B1 = SecondMat[9];
        B2 = SecondMat[10];
        B3 = SecondMat[11];

        OutMat[8] = B0 * A00 + B1 * A10 + B2 * A20 + B3 * A30;
        OutMat[9] = B0 * A01 + B1 * A11 + B2 * A21 + B3 * A31;
        OutMat[10] = B0 * A02 + B1 * A12 + B2 * A22 + B3 * A32;
        OutMat[11] = B0 * A03 + B1 * A13 + B2 * A23 + B3 * A33;

        B0 = SecondMat[12];
        B1 = SecondMat[13];
        B2 = SecondMat[14];
        B3 = SecondMat[15];

        OutMat[12] = B0 * A00 + B1 * A10 + B2 * A20 + B3 * A30;
        OutMat[13] = B0 * A01 + B1 * A11 + B2 * A21 + B3 * A31;
        OutMat[14] = B0 * A02 + B1 * A12 + B2 * A22 + B3 * A32;
        OutMat[15] = B0 * A03 + B1 * A13 + B2 * A23 + B3 * A33;
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
        OutMat[1] = MatToTranspose[4];
        OutMat[2] = MatToTranspose[8];
        OutMat[3] = MatToTranspose[12];
        OutMat[4] = MatToTranspose[1];
        OutMat[5] = MatToTranspose[5];
        OutMat[6] = MatToTranspose[9];
        OutMat[7] = MatToTranspose[13];
        OutMat[8] = MatToTranspose[2];
        OutMat[9] = MatToTranspose[6];
        OutMat[10] = MatToTranspose[10];
        OutMat[11] = MatToTranspose[14];
        OutMat[12] = MatToTranspose[3];
        OutMat[13] = MatToTranspose[7];
        OutMat[14] = MatToTranspose[11];
        OutMat[15] = MatToTranspose[15];
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
        const M01: number = MatToTranspose[1];
        const M02: number = MatToTranspose[2];
        const M03: number = MatToTranspose[3];
        const M12: number = MatToTranspose[6];
        const M13: number = MatToTranspose[7];
        const M23: number = MatToTranspose[11];

        MatToTranspose[1] = MatToTranspose[4];
        MatToTranspose[2] = MatToTranspose[8];
        MatToTranspose[3] = MatToTranspose[12];
        MatToTranspose[4] = M01;
        MatToTranspose[6] = MatToTranspose[9];
        MatToTranspose[7] = MatToTranspose[13];
        MatToTranspose[8] = M02;
        MatToTranspose[9] = M12;
        MatToTranspose[11] = MatToTranspose[14];
        MatToTranspose[12] = M03;
        MatToTranspose[13] = M13;
        MatToTranspose[14] = M23;
    }
}