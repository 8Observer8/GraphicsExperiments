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
/*														 Mat3 Class																		  */
/*																																		  */
/*	Mat3 class is responsible for 3D matrix operations necessary for graphics applications. All functions are inlined.					  */
/*																																		  */
/******************************************************************************************************************************************/

abstract class Mat3
{
    /**
     * Returns a new identity matrix 
     * 
     * @returns {Float32Array}
     */
    public static Create(): Float32Array
    {
        return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }

    /**
     * Copies the given matrix 
     * 
     * @param GivenMat {Float32Array}: given matrix 
     * @returns {Float32Array}
     */
    public static Copy(GivenMat: Float32Array): Float32Array
    {
        return new Float32Array([GivenMat[0], GivenMat[1], GivenMat[2], 
            GivenMat[3], GivenMat[4], GivenMat[5], 
            GivenMat[6], GivenMat[7], GivenMat[8]]);
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
        GivenMat[3] = 1;
        GivenMat[3] = 0;
        GivenMat[3] = 0;
        GivenMat[3] = 0;
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
        const M00: number = GivenMat[0], M01: number = GivenMat[1], M02: number = GivenMat[2];
        const M10: number = GivenMat[3], M11: number = GivenMat[4], M12: number = GivenMat[5];
        const M20: number = GivenMat[6], M21: number = GivenMat[7], M22: number = GivenMat[8];

        return M00 * (M22 * M11 - M12 * M21) + M01 * (-M22 * M10 + M12 * M20) + M02 * (M21 * M10 - M11 * M20);
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
        return FirstMat[0] == SecondMat[0] && FirstMat[1] == SecondMat[1] && FirstMat[2] == SecondMat[2] &&
				FirstMat[3] == SecondMat[3] && FirstMat[4] == SecondMat[4] && FirstMat[5] == SecondMat[5] &&
				FirstMat[6] == SecondMat[6] && FirstMat[7] == SecondMat[7] && FirstMat[8] == SecondMat[8];
    }

    /**
     * Creates 4X4 matrix from given rotation, translation and scale 
     * 
     * @param OutMat {Float32Array}: result matrix 
     * @param TranslationVector {Float32Array}: translation vector 
     * @param RotationZ {number}: degree of rotation around z axis in radians 
     * @param ScalingVector {Float32Array}: scaling vector 
     * @returns {void}
     */
    public static FromRotationTranslationScale(OutMat: Float32Array, TranslationVector: Float32Array, RotationZ: number, ScalingVector: Float32Array): void 
    {
        const A: number = Math.cos(RotationZ);
        const B: number = Math.sin(RotationZ);

        OutMat[0] = ScalingVector[0] * A;
        OutMat[1] = ScalingVector[1] * B;
        // OutMat[2] = 0;
        // OutMat[3] = 0;

        OutMat[4] = -ScalingVector[0] * B;
        OutMat[5] = ScalingVector[1] * A;
        // OutMat[6] = 0;
        // OutMat[7] = 0;

        // OutMat[8] = 0;
        // OutMat[9] = 0;
        // OutMat[10] = 1;
        // OutMat[11] = 0;

        OutMat[12] = TranslationVector[0];
        OutMat[13] = TranslationVector[1];
        // OutMat[14] = 0;
        // OutMat[15] = 1;
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
            const A00: number = MatToInvert[0], A01: number = MatToInvert[1], A02: number = MatToInvert[2];
			const A10: number = MatToInvert[3], A11: number = MatToInvert[4], A12: number = MatToInvert[5];
			const A20: number = MatToInvert[6], A21: number = MatToInvert[7], A22: number = MatToInvert[8];

			const B01: number = A22 * A11 - A12 * A21;
			const B11: number = -A22 * A10 + A12 * A20;
			const B21: number = A21 * A10 - A11 * A20;

			let Determinant: number = A00 * B01 + A01 * B11 + A02 * B21;

			if (Determinant)
			{
				Determinant = 1.0 / Determinant;

                OutMat[0] = B01 * Determinant;
                OutMat[1] = (-A22 * A01 + A02 * A21) * Determinant;
                OutMat[2] = (A12 * A01 - A02 * A11) * Determinant;
                OutMat[3] = B11 * Determinant;
                OutMat[4] = (A22 * A00 - A02 * A20) * Determinant;
                OutMat[5] = (-A12 * A00 + A02 * A10) * Determinant;
                OutMat[6] = B21 * Determinant;
                OutMat[7] = (-A21 * A00 + A01 * A20) * Determinant;
                OutMat[8] = (A11 * A00 - A01 * A10) * Determinant;
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
        const A00: number = FirstMat[0], A01: number = FirstMat[1], A02: number = FirstMat[2];
        const A10: number = FirstMat[3], A11: number = FirstMat[4], A12: number = FirstMat[5];
        const A20: number = FirstMat[6], A21: number = FirstMat[7], A22: number = FirstMat[8];

        const B00: number = SecondMat[0], B01: number = SecondMat[1], B02: number = SecondMat[2];
        const B10: number = SecondMat[3], B11: number = SecondMat[4], B12: number = SecondMat[5];
        const B20: number = SecondMat[6], B21: number = SecondMat[7], B22: number = SecondMat[8];

        OutMat[0] = B00 * A00 + B01 * A10 + B02 * A20;
        OutMat[1] = B00 * A01 + B01 * A11 + B02 * A21;
        OutMat[2] = B00 * A02 + B01 * A12 + B02 * A22;
        OutMat[3] = B10 * A00 + B11 * A10 + B12 * A20;
        OutMat[4] = B10 * A01 + B11 * A11 + B12 * A21;
        OutMat[5] = B10 * A02 + B11 * A12 + B12 * A22;
        OutMat[6] = B20 * A00 + B21 * A10 + B22 * A20;
        OutMat[7] = B20 * A01 + B21 * A11 + B22 * A21;
        OutMat[8] = B20 * A02 + B21 * A12 + B22 * A22;
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
        OutMat[1] = MatToTranspose[3];
        OutMat[2] = MatToTranspose[6];
        OutMat[3] = MatToTranspose[1];
        OutMat[4] = MatToTranspose[4];
        OutMat[5] = MatToTranspose[7];
        OutMat[6] = MatToTranspose[2];
        OutMat[7] = MatToTranspose[5];
        OutMat[8] = MatToTranspose[8];
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
        const M12: number = MatToTranspose[5];

        MatToTranspose[1] = MatToTranspose[3];
        MatToTranspose[2] = MatToTranspose[6];
        MatToTranspose[3] = M01;
        MatToTranspose[5] = MatToTranspose[7];
        MatToTranspose[6] = M02;
        MatToTranspose[7] = M12;
    }

    /**
     * Creates 3X3 normal matrix from given 4X4 model matrix 
     * 
     * @param NormalMat {Float32Array}: result normal matrix 
     * @param GivenModelMat {Float32Array}: given normal matrix
     * @returns {void}
     */
    public static CreateNormalMat(NormalMat: Float32Array, GivenModelMat: Float32Array): void 
    {
        const A00: number = GivenModelMat[0], A01: number = GivenModelMat[1], A02: number = GivenModelMat[2], A03: number = GivenModelMat[3];
        const A10: number = GivenModelMat[4], A11: number = GivenModelMat[5], A12: number = GivenModelMat[6], A13: number = GivenModelMat[7];
        const A20: number = GivenModelMat[8], A21: number = GivenModelMat[9], A22: number = GivenModelMat[10], A23: number = GivenModelMat[11];
        const A30: number = GivenModelMat[12], A31: number = GivenModelMat[13], A32: number = GivenModelMat[14], A33: number = GivenModelMat[15];

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

        if(Determinant)
        {
            Determinant = 1.0 / Determinant;

            NormalMat[0] = (A11 * B11 - A12 * B10 + A13 * B09) * Determinant;
            NormalMat[1] = (A12 * B08 - A10 * B11 - A13 * B07) * Determinant;
            NormalMat[2] = (A10 * B10 - A11 * B08 + A13 * B06) * Determinant;
            NormalMat[3] = (A02 * B10 - A01 * B11 - A03 * B09) * Determinant;
            NormalMat[4] = (A00 * B11 - A02 * B08 + A03 * B07) * Determinant;
            NormalMat[5] = (A01 * B08 - A00 * B10 - A03 * B06) * Determinant;
            NormalMat[6] = (A31 * B05 - A32 * B04 + A33 * B03) * Determinant;
            NormalMat[7] = (A32 * B02 - A30 * B05 - A33 * B01) * Determinant;
            NormalMat[8] = (A30 * B04 - A31 * B02 + A33 * B00) * Determinant;
        }
    }
}