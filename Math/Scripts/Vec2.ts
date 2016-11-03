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
/*														 Vec2 Class																		  */
/*																																		  */
/*	Vec2 class is responsible for 2D vector operations necessary for graphics applications. All functions are inlined.					  */
/*																																		  */
/******************************************************************************************************************************************/

"use strict";

abstract class Vec2
{
    /**
     * Creates a new vector 
     * 
     * @returns {Float32Array}
     */
    public static Create(): Float32Array
    {
        return new Float32Array([0, 0]);
    }

    /**
     * Creates a new vector from given values
     * 
     * @param X {number}: x value 
     * @param Y {number}: y value 
     * @returns {Float32Array}
     */
    public static FromValues(X: number, Y: number): Float32Array
    {
        return new Float32Array([X, Y]);
    }

    /**
     * Adds two given vectors 
     * 
     * @param OutVec {Float32Array}: result vector 
     * @param FirstVec {Float32Array}: first vector 
     * @param SecondVec {Float32Array}: second vector 
     * @returns {void}
     */
    public static Add(OutVec:Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void 
    {
        OutVec[0] = FirstVec[0] + SecondVec[0];
        OutVec[1] = FirstVec[1] + SecondVec[1];
    }

    /**
     * Subtracts two given vectors 
     * 
     * @param OutVec {Float32Array}: result vector 
     * @param FirstVec {Float32Array}: first vector 
     * @param SecondVec {Float32Array}: second vector 
     * @returns {void}
     */
    public static Subtract(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void 
    {
        OutVec[0] = FirstVec[0] - SecondVec[0];
        OutVec[1] = FirstVec[1] - SecondVec[1];
    }

    /**
     * Copies the given vector 
     * 
     * @param VecToCopy {Float32Array}: vector to copy 
     * @returns {Float32Array}
     */
    public static Copy(VecToCopy: Float32Array): Float32Array
    {
        return new Float32Array([VecToCopy[0], VecToCopy[1]]);
    }

    /**
     * Clones the given vector 
     * 
     * @param OutVec {Float32Array}: result vector 
     * @param VecToClone {Float32Array}: vector to copy 
     * @returns {void}
     */
    public static Clone(OutVec: Float32Array, VecToClone: Float32Array): void 
    {
        OutVec[0] = VecToClone[0];
        OutVec[1] = VecToClone[1];
    }

    /**
     * Returns the distance between two vectors 
     * 
     * @param FirstVec {Float32Array}: first vector 
     * @param SecondVec {Float32Array}: second vector 
     * @returns {number}
     */
    public static Distance(FirstVec: Float32Array, SecondVec: Float32Array): number
    {
        const X: number = SecondVec[0] - FirstVec[0];
        const Y: number = SecondVec[1] - FirstVec[1];

        return Math.sqrt(X * X + Y * Y);
    }

    /**
     * Returns the squared distance between two vectors 
     * 
     * @param FirstVec {Float32Array}: first vector 
     * @param SecondVec {Float32Array}: second vector 
     * @returns {number}
     */
    public static SquaredDistance(FirstVec: Float32Array, SecondVec: Float32Array): number
    {
        const X: number = SecondVec[0] - FirstVec[0];
        const Y: number = SecondVec[1] - FirstVec[1];

        return X * X + Y * Y;
    }

    /**
     * Returns the dot product of given two vectors 
     * 
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    public static Dot(FirstVec: Float32Array, SecondVec: Float32Array): number
    {
        return FirstVec[0] * SecondVec[0] + FirstVec[1] * SecondVec[1];
    }

    /**
     * Returns true if two given vectors are equal, false otherwise 
     * 
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @return {boolean}
     */
    public static bEquals(FirstVec: Float32Array, SecondVec: Float32Array): boolean
    {
        return FirstVec[0] === SecondVec[0] && FirstVec[1] === SecondVec[1];
    }

    /**
     * Returns the length of the given vector 
     * 
     * @param GivenVec {Float32Array}: given vector 
     * @returns {number}
     */
    public static Length(GivenVec: Float32Array): number
    {
        return Math.sqrt(GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1]);
    }

    /**
     * Returns the squared length of the given vector 
     * 
     * @param GivenVec {Float32Array}: given vector 
     * @returns {number}
     */
    public static SquaredLength(GivenVec: Float32Array): number
    {
        return GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1];
    }

    /**
     * Performs linear interpolation between two given vectors 
     * 
     * @param OutVec {Float32Array}: result vector 
     * @param FirstVec {Float32Array}: first vector 
     * @param SecondVec {Float32Array}: second vector
     * @param Amount {number}: amount of interpolation
     * @returns {void}
     */
    public static Lerp(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array, Amount: number): void 
    {
        OutVec[0] = FirstVec[0] + Amount * (SecondVec[0] - FirstVec[0]);
        OutVec[1] = FirstVec[1] + Amount * (SecondVec[1] - FirstVec[1]);
    }

    /**
     * Multiplies given two vectors 
     * 
     * @param OutVec {Float32Array}: result vector 
     * @param FirstVec {Float32Array}: first vector 
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    public static Multiply(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void 
    {
        OutVec[0] = FirstVec[0] * SecondVec[0];
        OutVec[1] = FirstVec[1] * SecondVec[1];
    }

    /**
     * Multiplies given vector with given scalar value
     * 
     * @param OutVec {Float32Array}: result vector 
     * @param FirstVec {Float32Array}: first vector 
     * @param Amount {number}: scalar amount
     * @returns {void}
     */
    public static MultiplyScalar(OutVec: Float32Array, FirstVec: Float32Array, Amount: number): void 
    {
        OutVec[0] = FirstVec[0] * Amount;
        OutVec[1] = FirstVec[1] * Amount;
    }

    /**
     * Normalizes the given vector 
     * 
     * @param OutVec {Float32Array}: result vector 
     * @param VecToNormalize {Float32Array}: vector to normalize 
     * @returns {void}
     */
    public static Normalize(OutVec: Float32Array, VecToNormalize: Float32Array): void
    {
        let SquaredLength: number = VecToNormalize[0] * VecToNormalize[0] + VecToNormalize[1] * VecToNormalize[1];

        if(SquaredLength > 0)
        {
            SquaredLength = 1.0 / Math.sqrt(SquaredLength);

            OutVec[0] = VecToNormalize[0] * SquaredLength;
            OutVec[1] = VecToNormalize[1] * SquaredLength;
        }
    }

    /**
     * Returns the string representation of the given vector 
     * 
     * @param GivenVec {Float32Array}: given vector 
     * @returns {string}
     */
    public static ToString(GivenVec: Float32Array): string 
    {
        return "Vec2: [" + GivenVec[0] + ", " + GivenVec[1] + "]";
    }
}