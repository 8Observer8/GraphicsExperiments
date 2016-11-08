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
/*														 Quat Class																		  */
/*																																		  */
/*	Quat class is responsible for representing 3D rotations and orientations                                        					  */
/*																																		  */
/******************************************************************************************************************************************/

abstract class Quat
{
    /**
     * Returns a new quat 
     * 
     * @returns {Float32Array}
     */
    public static Create(): Float32Array
    {
        return new Float32Array([0, 0, 0, 1]);
    }

    /**
     * Copies the given quat 
     * 
     * @param QuatToCopy {Float32Array}: quat to copy 
     * @returns {Float32Array}
     */
    public static Copy(QuatToCopy: Float32Array): Float32Array
    {
        return new Float32Array([QuatToCopy[0], QuatToCopy[1], QuatToCopy[2], QuatToCopy[3]]);
    }

    /**
     * Clones the given quat 
     * 
     * @param OutQuat {Float32Array}: result quat 
     * @param QuatToClone {Float32Array}: quat to copy 
     * @returns {void}
     */
    public static Clone(OutQuat: Float32Array, QuatToClone: Float32Array): void 
    {
        OutQuat[0] = QuatToClone[0];
        OutQuat[1] = QuatToClone[1];
        OutQuat[2] = QuatToClone[2];
        OutQuat[3] = QuatToClone[3];
    }

    /**
     * Returns true if two given quats are equal, false otherwise 
     * 
     * @param FirstQuat {Float32Array}: first quat
     * @param SecondQuat {Float32Array}: second quat
     * @return {boolean}
     */
    public static bEquals(FirstQuat: Float32Array, SecondQuat: Float32Array): boolean
    {
        return FirstQuat[0] === SecondQuat[0] && FirstQuat[1] === SecondQuat[1] && FirstQuat[2] === SecondQuat[2] && FirstQuat[3] === SecondQuat[3];
    }

    /**
     * Sets the given quat to identity quat 
     * 
     * @param GivenQuat {Float32Array}: given quat 
     * @returns {void}
     */
    public static SetIdentity(GivenQuat: Float32Array): void 
    {
        GivenQuat[0] = 0;
        GivenQuat[1] = 0;
        GivenQuat[2] = 0;
        GivenQuat[3] = 1;
    }

    /**
     * Sets a quaternion from given axis of rotation and degree of rotation in radians 
     * 
     * @param OutQuat {Float32Array}: result quat 
     * @param Axis {Float32Array}: axis of rotation 
     * @param Angle {number}: angle in radians 
     * @returns {void}
     */
    public static SetFromAxisAngle(OutQuat: Float32Array, Axis: Float32Array, Angle: number): void
    {
        Angle *= 0.5;

        const S: number = Math.sin(Angle);

        OutQuat[0] = S * Axis[0];
        OutQuat[1] = S * Axis[1];
        OutQuat[2] = S * Axis[2];
        OutQuat[3] = Math.cos(Angle);
    }

    /**
     * Multiplies two given quats 
     * 
     * @param OutQuat {Float32Array}: result quat 
     * @param FirstQuat {Float32Array}: first quat 
     * @param SecondQuat {Float32Array}: second quat 
     * @returns {void}
     */
    public static Multiply(OutQuat: Float32Array, FirstQuat: Float32Array, SecondQuat: Float32Array): void 
    {
        const AX: number = FirstQuat[0], AY: number = FirstQuat[1], AZ: number = FirstQuat[2], AW: number = FirstQuat[3];

        const BX: number = SecondQuat[0], BY: number = SecondQuat[1], BZ: number = SecondQuat[2], BW: number = SecondQuat[3];

        OutQuat[0] = AX * BW + AW * BX + AY * BZ - AZ * BY;
        OutQuat[1] = AY * BW + AW * BY + AZ * BX - AX * BZ;
        OutQuat[2] = AZ * BW + AW * BZ + AX * BY - AY * BX;
        OutQuat[3] = AW * BW - AX * BX - AY * BY - AZ * BZ;
    }

    /**
     * Normalizes the given quat 
     * 
     * @param OutQuat {Float32Array}: result quat 
     * @param QuatToNormalize {Float32Array}: quat to normalize 
     * @returns {void}
     */
    public static Normalize(OutQuat: Float32Array, QuatToNormalize: Float32Array): void 
    {
        let SquaredLength: number = QuatToNormalize[0] * QuatToNormalize[0] + QuatToNormalize[1] * QuatToNormalize[1] + QuatToNormalize[2] * QuatToNormalize[2] + QuatToNormalize[3] * QuatToNormalize[3];

        if(SquaredLength > 0)
        {
            SquaredLength = 1.0 / Math.sqrt(SquaredLength);

            OutQuat[0] = QuatToNormalize[0] * SquaredLength;
            OutQuat[1] = QuatToNormalize[1] * SquaredLength;
            OutQuat[2] = QuatToNormalize[2] * SquaredLength;
            OutQuat[3] = QuatToNormalize[3] * SquaredLength;
        }
    }

    /**
     * Rotates the given vector with a quaternion 
     * 
     * @param ResultVec {Float32Array}: result rotated vector 
     * @param QuatToMultiplyWith {Float32Array}: given quaternion rotation 
     * @param GivenVec {Float32Array}: given vector to rotate 
     * @returns {void}
     */
    public static MultiplyWithVector(ResultVec: Float32Array, QuatToMultiplyWith: Float32Array, GivenVec: Float32Array): void 
    {
        const A0: number = QuatToMultiplyWith[0] * 2.0;
        const A1: number = QuatToMultiplyWith[1] * 2.0;
        const A2: number = QuatToMultiplyWith[2] * 2.0;
        const A3: number = QuatToMultiplyWith[0] * A0;
        const A4: number = QuatToMultiplyWith[1] * A1;
        const A5: number = QuatToMultiplyWith[2] * A2;
        const A6: number = QuatToMultiplyWith[0] * A1;
        const A7: number = QuatToMultiplyWith[0] * A2;
        const A8: number = QuatToMultiplyWith[1] * A2;
        const A9: number = QuatToMultiplyWith[3] * A0;
        const A10: number = QuatToMultiplyWith[3] * A1;
        const A11: number = QuatToMultiplyWith[3] * A2;

        ResultVec[0] = (1.0 - (A4 + A5)) * GivenVec[0] + (A6 - A11) * GivenVec[1] + (A7 + A10) * GivenVec[2];
        ResultVec[1] = (A6 + A11) * GivenVec[0] + (1.0 - (A3 + A5)) * GivenVec[1] + (A8 - A9) * GivenVec[2];
        ResultVec[2] = (A7 - A10) * GivenVec[0] + (A8 + A9) * GivenVec[1] + (1.0 - (A3 + A4)) * GivenVec[2];
    }

    /**
     * Returns the string representation of the given quat 
     * 
     * @param GivenQuat {Float32Array}: given quat 
     * @returns {string}
     */
    public static ToString(GivenQuat: Float32Array): string 
    {
        return "Vec4: [" + GivenQuat[0] + ", " + GivenQuat[1] + ", " + GivenQuat[2] + ", " + GivenQuat[3] + "]";
    }
}