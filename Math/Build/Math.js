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
var Vec2 = (function () {
    function Vec2() {
    }
    /**
     * Creates a new vector
     *
     * @returns {Float32Array}
     */
    Vec2.Create = function () {
        return new Float32Array([0, 0]);
    };
    /**
     * Creates a new vector from given values
     *
     * @param X {number}: x value
     * @param Y {number}: y value
     * @returns {Float32Array}
     */
    Vec2.FromValues = function (X, Y) {
        return new Float32Array([X, Y]);
    };
    /**
     * Adds two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec2.Add = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] + SecondVec[0];
        OutVec[1] = FirstVec[1] + SecondVec[1];
    };
    /**
     * Subtracts two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec2.Subtract = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] - SecondVec[0];
        OutVec[1] = FirstVec[1] - SecondVec[1];
    };
    /**
     * Copies the given vector
     *
     * @param VecToCopy {Float32Array}: vector to copy
     * @returns {Float32Array}
     */
    Vec2.Copy = function (VecToCopy) {
        return new Float32Array([VecToCopy[0], VecToCopy[1]]);
    };
    /**
     * Clones the given vector
     *
     * @param OutVec {Float32Array}: result vector
     * @param VecToClone {Float32Array}: vector to copy
     * @returns {void}
     */
    Vec2.Clone = function (OutVec, VecToClone) {
        OutVec[0] = VecToClone[0];
        OutVec[1] = VecToClone[1];
    };
    /**
     * Returns the distance between two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec2.Distance = function (FirstVec, SecondVec) {
        var X = SecondVec[0] - FirstVec[0];
        var Y = SecondVec[1] - FirstVec[1];
        return Math.sqrt(X * X + Y * Y);
    };
    /**
     * Returns the squared distance between two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec2.SquaredDistance = function (FirstVec, SecondVec) {
        var X = SecondVec[0] - FirstVec[0];
        var Y = SecondVec[1] - FirstVec[1];
        return X * X + Y * Y;
    };
    /**
     * Returns the dot product of given two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec2.Dot = function (FirstVec, SecondVec) {
        return FirstVec[0] * SecondVec[0] + FirstVec[1] * SecondVec[1];
    };
    /**
     * Returns true if two given vectors are equal, false otherwise
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @return {boolean}
     */
    Vec2.bEquals = function (FirstVec, SecondVec) {
        return FirstVec[0] === SecondVec[0] && FirstVec[1] === SecondVec[1];
    };
    /**
     * Returns the length of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {number}
     */
    Vec2.Length = function (GivenVec) {
        return Math.sqrt(GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1]);
    };
    /**
     * Returns the squared length of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {number}
     */
    Vec2.SquaredLength = function (GivenVec) {
        return GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1];
    };
    /**
     * Performs linear interpolation between two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @param Amount {number}: amount of interpolation
     * @returns {void}
     */
    Vec2.Lerp = function (OutVec, FirstVec, SecondVec, Amount) {
        OutVec[0] = FirstVec[0] + Amount * (SecondVec[0] - FirstVec[0]);
        OutVec[1] = FirstVec[1] + Amount * (SecondVec[1] - FirstVec[1]);
    };
    /**
     * Multiplies given two vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec2.Multiply = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] * SecondVec[0];
        OutVec[1] = FirstVec[1] * SecondVec[1];
    };
    /**
     * Multiplies given vector with given scalar value
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param Amount {number}: scalar amount
     * @returns {void}
     */
    Vec2.MultiplyScalar = function (OutVec, FirstVec, Amount) {
        OutVec[0] = FirstVec[0] * Amount;
        OutVec[1] = FirstVec[1] * Amount;
    };
    /**
     * Normalizes the given vector
     *
     * @param OutVec {Float32Array}: result vector
     * @param VecToNormalize {Float32Array}: vector to normalize
     * @returns {void}
     */
    Vec2.Normalize = function (OutVec, VecToNormalize) {
        var SquaredLength = VecToNormalize[0] * VecToNormalize[0] + VecToNormalize[1] * VecToNormalize[1];
        if (SquaredLength > 0) {
            SquaredLength = 1.0 / Math.sqrt(SquaredLength);
            OutVec[0] = VecToNormalize[0] * SquaredLength;
            OutVec[1] = VecToNormalize[1] * SquaredLength;
        }
    };
    /**
     * Returns the string representation of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {string}
     */
    Vec2.ToString = function (GivenVec) {
        return "Vec2: [" + GivenVec[0] + ", " + GivenVec[1] + "]";
    };
    return Vec2;
}());
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
/*														 Vec3 Class																		  */
/*																																		  */
/*	Vec3 class is responsible for 3D vector operations necessary for graphics applications. All functions are inlined.					  */
/*																																		  */
/******************************************************************************************************************************************/
var Vec3 = (function () {
    function Vec3() {
    }
    /**
     * Creates a new vector
     *
     * @returns {Float32Array}
     */
    Vec3.Create = function () {
        return new Float32Array([0, 0, 0]);
    };
    /**
     * Creates a new vector from given values
     *
     * @param X {number}: x value
     * @param Y {number}: y value
     * @param Z {number}: z value
     * @returns {Float32Array}
     */
    Vec3.FromValues = function (X, Y, Z) {
        return new Float32Array([X, Y, Z]);
    };
    /**
     * Adds two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec3.Add = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] + SecondVec[0];
        OutVec[1] = FirstVec[1] + SecondVec[1];
        OutVec[2] = FirstVec[2] + SecondVec[2];
    };
    /**
     * Subtracts two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec3.Subtract = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] - SecondVec[0];
        OutVec[1] = FirstVec[1] - SecondVec[1];
        OutVec[2] = FirstVec[2] - SecondVec[2];
    };
    /**
     * Copies the given vector
     *
     * @param VecToCopy {Float32Array}: vector to copy
     * @returns {Float32Array}
     */
    Vec3.Copy = function (VecToCopy) {
        return new Float32Array([VecToCopy[0], VecToCopy[1], VecToCopy[2]]);
    };
    /**
     * Clones the given vector
     *
     * @param OutVec {Float32Array}: result vector
     * @param VecToClone {Float32Array}: vector to copy
     * @returns {void}
     */
    Vec3.Clone = function (OutVec, VecToClone) {
        OutVec[0] = VecToClone[0];
        OutVec[1] = VecToClone[1];
        OutVec[2] = VecToClone[2];
    };
    /**
     * Returns the distance between two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec3.Distance = function (FirstVec, SecondVec) {
        var X = SecondVec[0] - FirstVec[0];
        var Y = SecondVec[1] - FirstVec[1];
        var Z = SecondVec[2] - FirstVec[2];
        return Math.sqrt(X * X + Y * Y + Z * Z);
    };
    /**
     * Returns the squared distance between two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec3.SquaredDistance = function (FirstVec, SecondVec) {
        var X = SecondVec[0] - FirstVec[0];
        var Y = SecondVec[1] - FirstVec[1];
        var Z = SecondVec[2] - FirstVec[2];
        return X * X + Y * Y + Z * Z;
    };
    /**
     * Returns the dot product of given two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec3.Dot = function (FirstVec, SecondVec) {
        return FirstVec[0] * SecondVec[0] + FirstVec[1] * SecondVec[1] + FirstVec[2] * SecondVec[2];
    };
    /**
     * Computes the cross product of given two orthogonal vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec3.Cross = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[1] * SecondVec[2] - FirstVec[2] * SecondVec[1];
        OutVec[1] = FirstVec[2] * SecondVec[0] - FirstVec[0] * SecondVec[2];
        OutVec[2] = FirstVec[0] * SecondVec[1] - FirstVec[1] * SecondVec[0];
    };
    /**
     * Returns true if two given vectors are equal, false otherwise
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @return {boolean}
     */
    Vec3.bEquals = function (FirstVec, SecondVec) {
        return FirstVec[0] === SecondVec[0] && FirstVec[1] === SecondVec[1] && FirstVec[2] === SecondVec[2];
    };
    /**
     * Returns the length of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {number}
     */
    Vec3.Length = function (GivenVec) {
        return Math.sqrt(GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1] + GivenVec[2] * GivenVec[2]);
    };
    /**
     * Returns the squared length of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {number}
     */
    Vec3.SquaredLength = function (GivenVec) {
        return GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1] + GivenVec[2] * GivenVec[2];
    };
    /**
     * Performs linear interpolation between two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @param Amount {number}: amount of interpolation
     * @returns {void}
     */
    Vec3.Lerp = function (OutVec, FirstVec, SecondVec, Amount) {
        OutVec[0] = FirstVec[0] + Amount * (SecondVec[0] - FirstVec[0]);
        OutVec[1] = FirstVec[1] + Amount * (SecondVec[1] - FirstVec[1]);
        OutVec[2] = FirstVec[2] + Amount * (SecondVec[2] - FirstVec[2]);
    };
    /**
     * Multiplies given two vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec3.Multiply = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] * SecondVec[0];
        OutVec[1] = FirstVec[1] * SecondVec[1];
        OutVec[2] = FirstVec[2] * SecondVec[2];
    };
    /**
     * Multiplies given vector with given scalar value
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param Amount {number}: scalar amount
     * @returns {void}
     */
    Vec3.MultiplyScalar = function (OutVec, FirstVec, Amount) {
        OutVec[0] = FirstVec[0] * Amount;
        OutVec[1] = FirstVec[1] * Amount;
        OutVec[2] = FirstVec[2] * Amount;
    };
    /**
     * Normalizes the given vector
     *
     * @param OutVec {Float32Array}: result vector
     * @param VecToNormalize {Float32Array}: vector to normalize
     * @returns {void}
     */
    Vec3.Normalize = function (OutVec, VecToNormalize) {
        var SquaredLength = VecToNormalize[0] * VecToNormalize[0] + VecToNormalize[1] * VecToNormalize[1] + VecToNormalize[2] * VecToNormalize[2];
        if (SquaredLength > 0) {
            SquaredLength = 1.0 / Math.sqrt(SquaredLength);
            OutVec[0] = VecToNormalize[0] * SquaredLength;
            OutVec[1] = VecToNormalize[1] * SquaredLength;
            OutVec[2] = VecToNormalize[2] * SquaredLength;
        }
    };
    /**
     * Returns the string representation of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {string}
     */
    Vec3.ToString = function (GivenVec) {
        return "Vec3: [" + GivenVec[0] + ", " + GivenVec[1] + ", " + GivenVec[2] + "]";
    };
    return Vec3;
}());
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
/*														 Vec4 Class																		  */
/*																																		  */
/*	Vec4 class is responsible for 4D vector operations necessary for graphics applications. All functions are inlined.					  */
/*																																		  */
/******************************************************************************************************************************************/
var Vec4 = (function () {
    function Vec4() {
    }
    /**
     * Creates a new vector
     *
     * @returns {Float32Array}
     */
    Vec4.Create = function () {
        return new Float32Array([0, 0, 0, 0]);
    };
    /**
     * Creates a new vector from given values
     *
     * @param X {number}: x value
     * @param Y {number}: y value
     * @param Z {number}: z value
     * @param W {number}: w value
     * @returns {Float32Array}
     */
    Vec4.FromValues = function (X, Y, Z, W) {
        return new Float32Array([X, Y, Z, W]);
    };
    /**
     * Adds two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec4.Add = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] + SecondVec[0];
        OutVec[1] = FirstVec[1] + SecondVec[1];
        OutVec[2] = FirstVec[2] + SecondVec[2];
        OutVec[3] = FirstVec[3] + SecondVec[3];
    };
    /**
     * Subtracts two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec4.Subtract = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] - SecondVec[0];
        OutVec[1] = FirstVec[1] - SecondVec[1];
        OutVec[2] = FirstVec[2] - SecondVec[2];
        OutVec[3] = FirstVec[3] - SecondVec[3];
    };
    /**
     * Copies the given vector
     *
     * @param VecToCopy {Float32Array}: vector to copy
     * @returns {Float32Array}
     */
    Vec4.Copy = function (VecToCopy) {
        return new Float32Array([VecToCopy[0], VecToCopy[1], VecToCopy[2], VecToCopy[3]]);
    };
    /**
     * Clones the given vector
     *
     * @param OutVec {Float32Array}: result vector
     * @param VecToClone {Float32Array}: vector to copy
     * @returns {void}
     */
    Vec4.Clone = function (OutVec, VecToClone) {
        OutVec[0] = VecToClone[0];
        OutVec[1] = VecToClone[1];
        OutVec[2] = VecToClone[2];
        OutVec[3] = VecToClone[3];
    };
    /**
     * Returns the distance between two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec4.Distance = function (FirstVec, SecondVec) {
        var X = SecondVec[0] - FirstVec[0];
        var Y = SecondVec[1] - FirstVec[1];
        var Z = SecondVec[2] - FirstVec[2];
        var W = SecondVec[3] - FirstVec[3];
        return Math.sqrt(X * X + Y * Y + Z * Z + W * W);
    };
    /**
     * Returns the squared distance between two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec4.SquaredDistance = function (FirstVec, SecondVec) {
        var X = SecondVec[0] - FirstVec[0];
        var Y = SecondVec[1] - FirstVec[1];
        var Z = SecondVec[2] - FirstVec[2];
        var W = SecondVec[3] - FirstVec[3];
        return X * X + Y * Y + Z * Z + W * W;
    };
    /**
     * Returns the dot product of given two vectors
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {number}
     */
    Vec4.Dot = function (FirstVec, SecondVec) {
        return FirstVec[0] * SecondVec[0] + FirstVec[1] * SecondVec[1] + FirstVec[2] * SecondVec[2] + FirstVec[3] * SecondVec[3];
    };
    /**
     * Returns true if two given vectors are equal, false otherwise
     *
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @return {boolean}
     */
    Vec4.bEquals = function (FirstVec, SecondVec) {
        return FirstVec[0] === SecondVec[0] && FirstVec[1] === SecondVec[1] && FirstVec[2] === SecondVec[2] && FirstVec[3] === SecondVec[3];
    };
    /**
     * Returns the length of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {number}
     */
    Vec4.Length = function (GivenVec) {
        return Math.sqrt(GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1] + GivenVec[2] * GivenVec[2] + GivenVec[3] * GivenVec[3]);
    };
    /**
     * Returns the squared length of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {number}
     */
    Vec4.SquaredLength = function (GivenVec) {
        return GivenVec[0] * GivenVec[0] + GivenVec[1] * GivenVec[1] + GivenVec[2] * GivenVec[2] + GivenVec[3] * GivenVec[3];
    };
    /**
     * Performs linear interpolation between two given vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @param Amount {number}: amount of interpolation
     * @returns {void}
     */
    Vec4.Lerp = function (OutVec, FirstVec, SecondVec, Amount) {
        OutVec[0] = FirstVec[0] + Amount * (SecondVec[0] - FirstVec[0]);
        OutVec[1] = FirstVec[1] + Amount * (SecondVec[1] - FirstVec[1]);
        OutVec[2] = FirstVec[2] + Amount * (SecondVec[2] - FirstVec[2]);
        OutVec[3] = FirstVec[3] + Amount * (SecondVec[3] - FirstVec[3]);
    };
    /**
     * Multiplies given two vectors
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param SecondVec {Float32Array}: second vector
     * @returns {void}
     */
    Vec4.Multiply = function (OutVec, FirstVec, SecondVec) {
        OutVec[0] = FirstVec[0] * SecondVec[0];
        OutVec[1] = FirstVec[1] * SecondVec[1];
        OutVec[2] = FirstVec[2] * SecondVec[2];
        OutVec[3] = FirstVec[3] * SecondVec[3];
    };
    /**
     * Multiplies given vector with given scalar value
     *
     * @param OutVec {Float32Array}: result vector
     * @param FirstVec {Float32Array}: first vector
     * @param Amount {number}: scalar amount
     * @returns {void}
     */
    Vec4.MultiplyScalar = function (OutVec, FirstVec, Amount) {
        OutVec[0] = FirstVec[0] * Amount;
        OutVec[1] = FirstVec[1] * Amount;
        OutVec[2] = FirstVec[2] * Amount;
        OutVec[3] = FirstVec[3] * Amount;
    };
    /**
     * Normalizes the given vector
     *
     * @param OutVec {Float32Array}: result vector
     * @param VecToNormalize {Float32Array}: vector to normalize
     * @returns {void}
     */
    Vec4.Normalize = function (OutVec, VecToNormalize) {
        var SquaredLength = VecToNormalize[0] * VecToNormalize[0] + VecToNormalize[1] * VecToNormalize[1] + VecToNormalize[2] * VecToNormalize[2] + VecToNormalize[3] * VecToNormalize[3];
        if (SquaredLength > 0) {
            SquaredLength = 1.0 / Math.sqrt(SquaredLength);
            OutVec[0] = VecToNormalize[0] * SquaredLength;
            OutVec[1] = VecToNormalize[1] * SquaredLength;
            OutVec[2] = VecToNormalize[2] * SquaredLength;
            OutVec[3] = VecToNormalize[3] * SquaredLength;
        }
    };
    /**
     * Returns the string representation of the given vector
     *
     * @param GivenVec {Float32Array}: given vector
     * @returns {string}
     */
    Vec4.ToString = function (GivenVec) {
        return "Vec4: [" + GivenVec[0] + ", " + GivenVec[1] + ", " + GivenVec[2] + ", " + GivenVec[3] + "]";
    };
    return Vec4;
}());
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
var Mat2 = (function () {
    function Mat2() {
    }
    /**
     * Returns a new identity matrix
     *
     * @returns {Float32Array}
     */
    Mat2.Create = function () {
        return new Float32Array([1, 0, 0, 1]);
    };
    /**
     * Copies the given matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {Float32Array}
     */
    Mat2.Copy = function (GivenMat) {
        return new Float32Array([GivenMat[0], GivenMat[1], GivenMat[2], GivenMat[3]]);
    };
    /**
     * Clones the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToClone {Float32Array}: matrix to clone
     * @returns {void}
     */
    Mat2.Clone = function (OutMat, MatToClone) {
        OutMat[0] = MatToClone[0];
        OutMat[1] = MatToClone[1];
        OutMat[2] = MatToClone[2];
        OutMat[3] = MatToClone[3];
    };
    /**
     * Sets the given matrix to the identity matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {void}
     */
    Mat2.SetIdentity = function (GivenMat) {
        GivenMat[0] = 1;
        GivenMat[1] = 0;
        GivenMat[2] = 0;
        GivenMat[3] = 1;
    };
    /**
     * Returns the determinant of the given matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {void}
     */
    Mat2.Determinant = function (GivenMat) {
        return GivenMat[0] * GivenMat[3] - GivenMat[2] * GivenMat[1];
    };
    /**
     * Returns true if two given matrices are equal, false otherwise
     *
     * @param FirstMat {Float32Array}: first matrix
     * @param SecondMat {Float32Array}: second matrix
     * @returns {boolean}
     */
    Mat2.bEquals = function (FirstMat, SecondMat) {
        return FirstMat[0] === SecondMat[0] && FirstMat[1] === SecondMat[1] &&
            FirstMat[2] === SecondMat[2] && FirstMat[3] === SecondMat[3];
    };
    /**
     * Inverts the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToInvert {Float32Array}: matrix to invert
     * @returns {void}
     */
    Mat2.Invert = function (OutMat, MatToInvert) {
        var M00 = MatToInvert[0];
        var M01 = MatToInvert[1];
        var M10 = MatToInvert[2];
        var M11 = MatToInvert[3];
        var Determinant = Mat2.Determinant(MatToInvert);
        if (Determinant) {
            Determinant = 1.0 / Determinant;
            OutMat[0] = M11 * Determinant;
            OutMat[1] = -M01 * Determinant;
            OutMat[2] = -M10 * Determinant;
            OutMat[3] = M00 * Determinant;
        }
    };
    /**
     * Multiplies the given two matrices
     *
     * @param OutMat {Float32Array}: result matrix
     * @param FirstMat {Float32Array}: first matrix
     * @param SecondMat {Float32Array}: second matrix
     * @returns {void}
     */
    Mat2.Multiply = function (OutMat, FirstMat, SecondMat) {
        var A0 = FirstMat[0];
        var A1 = FirstMat[1];
        var A2 = FirstMat[2];
        var A3 = FirstMat[3];
        var B0 = SecondMat[0];
        var B1 = SecondMat[1];
        var B2 = SecondMat[2];
        var B3 = SecondMat[3];
        OutMat[0] = A0 * B0 + A2 * B1;
        OutMat[1] = A1 * B0 + A3 * B1;
        OutMat[2] = A0 * B2 + A2 * B3;
        OutMat[3] = A1 * B2 + A3 * B3;
    };
    /**
     * Transposes the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void}
     */
    Mat2.Transpose = function (OutMat, MatToTranspose) {
        OutMat[0] = MatToTranspose[0];
        OutMat[1] = MatToTranspose[2];
        OutMat[2] = MatToTranspose[1];
        OutMat[3] = MatToTranspose[3];
    };
    /**
     * Transposes the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void}
     */
    Mat2.TransposeItself = function (MatToTranspose) {
        var A1 = MatToTranspose[1];
        MatToTranspose[1] = MatToTranspose[2];
        MatToTranspose[2] = A1;
    };
    return Mat2;
}());
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
var Mat3 = (function () {
    function Mat3() {
    }
    /**
     * Returns a new identity matrix
     *
     * @returns {Float32Array}
     */
    Mat3.Create = function () {
        return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    };
    /**
     * Copies the given matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {Float32Array}
     */
    Mat3.Copy = function (GivenMat) {
        return new Float32Array([GivenMat[0], GivenMat[1], GivenMat[2],
            GivenMat[3], GivenMat[4], GivenMat[5],
            GivenMat[6], GivenMat[7], GivenMat[8]]);
    };
    /**
     * Clones the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToClone {Float32Array}: matrix to clone
     * @returns {void}
     */
    Mat3.Clone = function (OutMat, MatToClone) {
        OutMat[0] = MatToClone[0];
        OutMat[1] = MatToClone[1];
        OutMat[2] = MatToClone[2];
        OutMat[3] = MatToClone[3];
        OutMat[4] = MatToClone[4];
        OutMat[5] = MatToClone[5];
        OutMat[6] = MatToClone[6];
        OutMat[7] = MatToClone[7];
        OutMat[8] = MatToClone[8];
    };
    /**
     * Sets the given matrix to the identity matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {void}
     */
    Mat3.SetIdentity = function (GivenMat) {
        GivenMat[0] = 1;
        GivenMat[1] = 0;
        GivenMat[2] = 0;
        GivenMat[3] = 0;
        GivenMat[3] = 1;
        GivenMat[3] = 0;
        GivenMat[3] = 0;
        GivenMat[3] = 0;
        GivenMat[3] = 1;
    };
    /**
     * Returns the determinant of the given matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {void}
     */
    Mat3.Determinant = function (GivenMat) {
        var M00 = GivenMat[0], M01 = GivenMat[1], M02 = GivenMat[2];
        var M10 = GivenMat[3], M11 = GivenMat[4], M12 = GivenMat[5];
        var M20 = GivenMat[6], M21 = GivenMat[7], M22 = GivenMat[8];
        return M00 * (M22 * M11 - M12 * M21) + M01 * (-M22 * M10 + M12 * M20) + M02 * (M21 * M10 - M11 * M20);
    };
    /**
     * Returns true if two given matrices are equal, false otherwise
     *
     * @param FirstMat {Float32Array}: first matrix
     * @param SecondMat {Float32Array}: second matrix
     * @returns {boolean}
     */
    Mat3.bEquals = function (FirstMat, SecondMat) {
        return FirstMat[0] == SecondMat[0] && FirstMat[1] == SecondMat[1] && FirstMat[2] == SecondMat[2] &&
            FirstMat[3] == SecondMat[3] && FirstMat[4] == SecondMat[4] && FirstMat[5] == SecondMat[5] &&
            FirstMat[6] == SecondMat[6] && FirstMat[7] == SecondMat[7] && FirstMat[8] == SecondMat[8];
    };
    /**
     * Creates 4X4 matrix from given rotation, translation and scale
     *
     * @param OutMat {Float32Array}: result matrix
     * @param TranslationVector {Float32Array}: translation vector
     * @param RotationZ {number}: degree of rotation around z axis in radians
     * @param ScalingVector {Float32Array}: scaling vector
     * @returns {void}
     */
    Mat3.FromRotationTranslationScale = function (OutMat, TranslationVector, RotationZ, ScalingVector) {
        var A = Math.cos(RotationZ);
        var B = Math.sin(RotationZ);
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
    };
    /**
     * Inverts the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToInvert {Float32Array}: matrix to invert
     * @returns {void}
     */
    Mat3.Invert = function (OutMat, MatToInvert) {
        var A00 = MatToInvert[0], A01 = MatToInvert[1], A02 = MatToInvert[2];
        var A10 = MatToInvert[3], A11 = MatToInvert[4], A12 = MatToInvert[5];
        var A20 = MatToInvert[6], A21 = MatToInvert[7], A22 = MatToInvert[8];
        var B01 = A22 * A11 - A12 * A21;
        var B11 = -A22 * A10 + A12 * A20;
        var B21 = A21 * A10 - A11 * A20;
        var Determinant = A00 * B01 + A01 * B11 + A02 * B21;
        if (Determinant) {
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
    };
    /**
     * Multiplies the given two matrices
     *
     * @param OutMat {Float32Array}: result matrix
     * @param FirstMat {Float32Array}: first matrix
     * @param SecondMat {Float32Array}: second matrix
     * @returns {void}
     */
    Mat3.Multiply = function (OutMat, FirstMat, SecondMat) {
        var A00 = FirstMat[0], A01 = FirstMat[1], A02 = FirstMat[2];
        var A10 = FirstMat[3], A11 = FirstMat[4], A12 = FirstMat[5];
        var A20 = FirstMat[6], A21 = FirstMat[7], A22 = FirstMat[8];
        var B00 = SecondMat[0], B01 = SecondMat[1], B02 = SecondMat[2];
        var B10 = SecondMat[3], B11 = SecondMat[4], B12 = SecondMat[5];
        var B20 = SecondMat[6], B21 = SecondMat[7], B22 = SecondMat[8];
        OutMat[0] = B00 * A00 + B01 * A10 + B02 * A20;
        OutMat[1] = B00 * A01 + B01 * A11 + B02 * A21;
        OutMat[2] = B00 * A02 + B01 * A12 + B02 * A22;
        OutMat[3] = B10 * A00 + B11 * A10 + B12 * A20;
        OutMat[4] = B10 * A01 + B11 * A11 + B12 * A21;
        OutMat[5] = B10 * A02 + B11 * A12 + B12 * A22;
        OutMat[6] = B20 * A00 + B21 * A10 + B22 * A20;
        OutMat[7] = B20 * A01 + B21 * A11 + B22 * A21;
        OutMat[8] = B20 * A02 + B21 * A12 + B22 * A22;
    };
    /**
     * Transposes the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void}
     */
    Mat3.Transpose = function (OutMat, MatToTranspose) {
        OutMat[0] = MatToTranspose[0];
        OutMat[1] = MatToTranspose[3];
        OutMat[2] = MatToTranspose[6];
        OutMat[3] = MatToTranspose[1];
        OutMat[4] = MatToTranspose[4];
        OutMat[5] = MatToTranspose[7];
        OutMat[6] = MatToTranspose[2];
        OutMat[7] = MatToTranspose[5];
        OutMat[8] = MatToTranspose[8];
    };
    /**
     * Transposes the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void}
     */
    Mat3.TransposeItself = function (MatToTranspose) {
        var M01 = MatToTranspose[1];
        var M02 = MatToTranspose[2];
        var M12 = MatToTranspose[5];
        MatToTranspose[1] = MatToTranspose[3];
        MatToTranspose[2] = MatToTranspose[6];
        MatToTranspose[3] = M01;
        MatToTranspose[5] = MatToTranspose[7];
        MatToTranspose[6] = M02;
        MatToTranspose[7] = M12;
    };
    return Mat3;
}());
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
var Mat4 = (function () {
    function Mat4() {
    }
    /**
     * Returns a new identity matrix
     *
     * @returns {Float32Array}
     */
    Mat4.Create = function () {
        return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    };
    /**
     * Copies the given matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {Float32Array}
     */
    Mat4.Copy = function (GivenMat) {
        return new Float32Array([GivenMat[0], GivenMat[1], GivenMat[2], GivenMat[3],
            GivenMat[4], GivenMat[5], GivenMat[6], GivenMat[7],
            GivenMat[8], GivenMat[9], GivenMat[10], GivenMat[11],
            GivenMat[12], GivenMat[13], GivenMat[14], GivenMat[15]]);
    };
    /**
     * Clones the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToClone {Float32Array}: matrix to clone
     * @returns {void}
     */
    Mat4.Clone = function (OutMat, MatToClone) {
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
    };
    /**
     * Sets the given matrix to the identity matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {void}
     */
    Mat4.SetIdentity = function (GivenMat) {
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
    };
    /**
     * Returns the determinant of the given matrix
     *
     * @param GivenMat {Float32Array}: given matrix
     * @returns {void}
     */
    Mat4.Determinant = function (GivenMat) {
        var A00 = GivenMat[0], A01 = GivenMat[1], A02 = GivenMat[2], A03 = GivenMat[3];
        var A10 = GivenMat[4], A11 = GivenMat[5], A12 = GivenMat[6], A13 = GivenMat[7];
        var A20 = GivenMat[8], A21 = GivenMat[9], A22 = GivenMat[10], A23 = GivenMat[11];
        var A30 = GivenMat[12], A31 = GivenMat[13], A32 = GivenMat[14], A33 = GivenMat[15];
        var B00 = A00 * A11 - A01 * A10;
        var B01 = A00 * A12 - A02 * A10;
        var B02 = A00 * A13 - A03 * A10;
        var B03 = A01 * A12 - A02 * A11;
        var B04 = A01 * A13 - A03 * A11;
        var B05 = A02 * A13 - A03 * A12;
        var B06 = A20 * A31 - A21 * A30;
        var B07 = A20 * A32 - A22 * A30;
        var B08 = A20 * A33 - A23 * A30;
        var B09 = A21 * A32 - A22 * A31;
        var B10 = A21 * A33 - A23 * A31;
        var B11 = A22 * A33 - A23 * A32;
        return B00 * B11 - B01 * B10 + B02 * B09 + B03 * B08 - B04 * B07 + B05 * B06;
    };
    /**
     * Returns true if two given matrices are equal, false otherwise
     *
     * @param FirstMat {Float32Array}: first matrix
     * @param SecondMat {Float32Array}: second matrix
     * @returns {boolean}
     */
    Mat4.bEquals = function (FirstMat, SecondMat) {
        return FirstMat[0] == SecondMat[0] && FirstMat[1] == SecondMat[1] && FirstMat[2] == SecondMat[2] && FirstMat[3] == SecondMat[3] &&
            FirstMat[4] == SecondMat[4] && FirstMat[5] == SecondMat[5] && FirstMat[6] == SecondMat[6] && FirstMat[7] == SecondMat[7] &&
            FirstMat[8] == SecondMat[8] && FirstMat[9] == SecondMat[9] && FirstMat[10] == SecondMat[10] && FirstMat[11] == SecondMat[11] &&
            FirstMat[12] == SecondMat[12] && FirstMat[13] == SecondMat[13] && FirstMat[14] == SecondMat[14] && FirstMat[15] == SecondMat[15];
    };
    /**
     * Inverts the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToInvert {Float32Array}: matrix to invert
     * @returns {void}
     */
    Mat4.Invert = function (OutMat, MatToInvert) {
        var A00 = MatToInvert[0], A01 = MatToInvert[1], A02 = MatToInvert[2], A03 = MatToInvert[3];
        var A10 = MatToInvert[4], A11 = MatToInvert[5], A12 = MatToInvert[6], A13 = MatToInvert[7];
        var A20 = MatToInvert[8], A21 = MatToInvert[9], A22 = MatToInvert[10], A23 = MatToInvert[11];
        var A30 = MatToInvert[12], A31 = MatToInvert[13], A32 = MatToInvert[14], A33 = MatToInvert[15];
        var B00 = A00 * A11 - A01 * A10;
        var B01 = A00 * A12 - A02 * A10;
        var B02 = A00 * A13 - A03 * A10;
        var B03 = A01 * A12 - A02 * A11;
        var B04 = A01 * A13 - A03 * A11;
        var B05 = A02 * A13 - A03 * A12;
        var B06 = A20 * A31 - A21 * A30;
        var B07 = A20 * A32 - A22 * A30;
        var B08 = A20 * A33 - A23 * A30;
        var B09 = A21 * A32 - A22 * A31;
        var B10 = A21 * A33 - A23 * A31;
        var B11 = A22 * A33 - A23 * A32;
        var Determinant = B00 * B11 - B01 * B10 + B02 * B09 + B03 * B08 - B04 * B07 + B05 * B06;
        if (Determinant) {
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
    };
    /**
     * Multiplies the given two matrices
     *
     * @param OutMat {Float32Array}: result matrix
     * @param FirstMat {Float32Array}: first matrix
     * @param SecondMat {Float32Array}: second matrix
     * @returns {void}
     */
    Mat4.Multiply = function (OutMat, FirstMat, SecondMat) {
        var A00 = FirstMat[0], A01 = FirstMat[1], A02 = FirstMat[2], A03 = FirstMat[3];
        var A10 = FirstMat[4], A11 = FirstMat[5], A12 = FirstMat[6], A13 = FirstMat[7];
        var A20 = FirstMat[8], A21 = FirstMat[9], A22 = FirstMat[10], A23 = FirstMat[11];
        var A30 = FirstMat[12], A31 = FirstMat[13], A32 = FirstMat[14], A33 = FirstMat[15];
        var B0 = SecondMat[0];
        var B1 = SecondMat[1];
        var B2 = SecondMat[2];
        var B3 = SecondMat[3];
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
    };
    /**
     * Transposes the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void}
     */
    Mat4.Transpose = function (OutMat, MatToTranspose) {
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
    };
    /**
     * Transposes the given matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param MatToTranspose {Float32Array}: matrix to transpose
     * @returns {void}
     */
    Mat4.TransposeItself = function (MatToTranspose) {
        var M01 = MatToTranspose[1];
        var M02 = MatToTranspose[2];
        var M03 = MatToTranspose[3];
        var M12 = MatToTranspose[6];
        var M13 = MatToTranspose[7];
        var M23 = MatToTranspose[11];
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
    };
    /**
     * Creates 4X4 camera view matrix
     *
     * @param OutMat {Float32Array}: result matrix
     * @param EyePosition {Float32Array}: position of the camera
     * @param LookAt {Float32Array}: location the camera is looking at
     * @param UpVector {Float32Array}: vector pointing up
     * @returns {void}
     */
    Mat4.CreateViewMat = function (OutMat, EyePosition, LookAt, UpVector) {
        var Z0 = EyePosition[0] - LookAt[0];
        var Z1 = EyePosition[1] - LookAt[1];
        var Z2 = EyePosition[2] - LookAt[2];
        var Length = Z0 * Z0 + Z1 * Z1 + Z2 * Z2;
        if (Length === 0) {
            Z0 = 0;
            Z1 = 0;
            Z2 = 0;
        }
        else {
            Length = 1.0 / Math.sqrt(Length);
            Z0 *= Length;
            Z1 *= Length;
            Z2 *= Length;
        }
        var X0 = UpVector[1] * Z2 - UpVector[2] * Z1;
        var X1 = UpVector[2] * Z0 - UpVector[0] * Z2;
        var X2 = UpVector[0] * Z1 - UpVector[1] * Z0;
        Length = X0 * X0 + X1 * X1 + X2 * X2;
        if (Length === 0) {
            X0 = 0;
            X1 = 0;
            X2 = 0;
        }
        else {
            Length = 1.0 / Math.sqrt(Length);
            X0 *= Length;
            X1 *= Length;
            X2 *= Length;
        }
        var Y0 = Z1 * X2 - Z2 * X1;
        var Y1 = Z2 * X0 - Z0 * X2;
        var Y2 = Z0 * X1 - Z1 * X0;
        Length = Y0 * Y0 + Y1 * Y1 + Y2 * Y2;
        if (Length === 0) {
            Y0 = 0;
            Y1 = 0;
            Y2 = 0;
        }
        else {
            Length = 1.0 / Math.sqrt(Length);
            Y0 *= Length;
            Y1 *= Length;
            Y2 *= Length;
        }
        OutMat[0] = X0;
        OutMat[1] = Y0;
        OutMat[2] = Z0;
        // OutMat[3] = 0;
        OutMat[4] = X1;
        OutMat[5] = Y1;
        OutMat[6] = Z1;
        // OutMat[7] = 0;
        OutMat[8] = X2;
        OutMat[9] = Y2;
        OutMat[10] = Z2;
        // OutMat[11] = 0;
        OutMat[12] = -(X0 * EyePosition[0] + X1 * EyePosition[1] + X2 * EyePosition[2]);
        OutMat[13] = -(Y0 * EyePosition[0] + Y1 * EyePosition[1] + Y2 * EyePosition[2]);
        OutMat[14] = -(Z0 * EyePosition[0] + Z1 * EyePosition[1] + Z2 * EyePosition[2]);
        // OutMat[15] = 1.0;
    };
    /**
     * Creates 4X4 matrix for orthographic projection
     *
     * @param OutMat {Float32Array}: result matrix
     * @param Left {number}: left border of frustum
     * @param Right {number}: right border of frustum
     * @param Top {number}: top border of frustum
     * @param Bottom {number}: bottom border of frustum
     * @param Near {number}: near border of frustum
     * @param Far {number}: far border of frustum
     * @returns {void}
     */
    Mat4.CreateOrthographicProjectionMat = function (OutMat, Left, Right, Top, Bottom, Near, Far) {
        var LR = 1.0 / (Left - Right);
        var BT = 1.0 / (Bottom - Top);
        var NF = 1.0 / (Near - Far);
        OutMat[0] = -2.0 * LR;
        OutMat[5] = -2.0 * BT;
        OutMat[10] = 2.0 * NF;
        OutMat[12] = (Left + Right) * LR;
        OutMat[13] = (Top + Bottom) * BT;
        OutMat[14] = (Near + Far) * NF;
        // OutMat[15] = 1.0;
    };
    /**
     * Creates 4X4 matrix for perspective projection
     *
     * @param OutMat {Float32Array}: result matrix
     * @param AspectRatio {number}: aspect ratio of the viewport
     * @param FOV {number}: vertical field of view
     * @param Near {number}: near border of the frustum
     * @param Far {number}: far border of the frustum
     * @returns {void}
     */
    Mat4.CreatePerspectiveProjectionMat = function (OutMat, AspectRatio, FOV, Near, Far) {
        var F = 1.0 / Math.tan(FOV / 2.0);
        var NF = 1.0 / (Near - Far);
        OutMat[0] = F / AspectRatio;
        OutMat[5] = F;
        OutMat[10] = (Far + Near) * NF;
        OutMat[11] = -1.0;
        OutMat[14] = 2.0 * Far * Near * NF;
        OutMat[15] = 0;
    };
    /**
     * Creates 4X4 model matrix from given rotation, translation and scale
     *
     * @param OutMat {Float32Array}: result matrix
     * @param QuatRotation {Float32Array}: quaternion rotation
     * @param TranslationVector {Float32Array}: translation vector
     * @param ScalingVector {Float32Array}: scaling vector
     * @returns {void}
     */
    Mat4.FromRotationTranslationScale = function (OutMat, QuatRotation, TranslationVector, ScalingVector) {
        var QX = QuatRotation[0], QY = QuatRotation[1], QZ = QuatRotation[2], QW = QuatRotation[3];
        var X2 = QX + QX, Y2 = QY + QY, Z2 = QZ + QZ;
        var XX = QX * X2, YX = QY * X2, YY = QY * Y2;
        var ZX = QZ * X2, ZY = QZ * Y2, ZZ = QZ * Z2;
        var WX = QW * X2, WY = QW * Y2, WZ = QW * Z2;
        OutMat[0] = (1 - (YY + ZZ)) * ScalingVector[0];
        OutMat[1] = (YX + WZ) * ScalingVector[0];
        OutMat[2] = (ZX - WY) * ScalingVector[0];
        OutMat[3] = 0;
        OutMat[4] = (YX - WZ) * ScalingVector[1];
        OutMat[5] = (1 - (XX + ZZ)) * ScalingVector[1];
        OutMat[6] = (ZY + WX) * ScalingVector[1];
        OutMat[7] = 0;
        OutMat[8] = (ZX + WY) * ScalingVector[2];
        OutMat[9] = (ZY - WX) * ScalingVector[2];
        OutMat[10] = (1 - (XX + YY)) * ScalingVector[2];
        OutMat[11] = 0;
        OutMat[12] = TranslationVector[0];
        OutMat[13] = TranslationVector[1];
        OutMat[14] = TranslationVector[2];
        OutMat[15] = 1;
    };
    return Mat4;
}());
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
var Quat = (function () {
    function Quat() {
    }
    /**
     * Returns a new quat
     *
     * @returns {Float32Array}
     */
    Quat.Create = function () {
        return new Float32Array([0, 0, 0, 1]);
    };
    /**
     * Copies the given quat
     *
     * @param QuatToCopy {Float32Array}: quat to copy
     * @returns {Float32Array}
     */
    Quat.Copy = function (QuatToCopy) {
        return new Float32Array([QuatToCopy[0], QuatToCopy[1], QuatToCopy[2], QuatToCopy[3]]);
    };
    /**
     * Clones the given quat
     *
     * @param OutQuat {Float32Array}: result quat
     * @param QuatToClone {Float32Array}: quat to copy
     * @returns {void}
     */
    Quat.Clone = function (OutQuat, QuatToClone) {
        OutQuat[0] = QuatToClone[0];
        OutQuat[1] = QuatToClone[1];
        OutQuat[2] = QuatToClone[2];
        OutQuat[3] = QuatToClone[3];
    };
    /**
     * Returns true if two given quats are equal, false otherwise
     *
     * @param FirstQuat {Float32Array}: first quat
     * @param SecondQuat {Float32Array}: second quat
     * @return {boolean}
     */
    Quat.bEquals = function (FirstQuat, SecondQuat) {
        return FirstQuat[0] === SecondQuat[0] && FirstQuat[1] === SecondQuat[1] && FirstQuat[2] === SecondQuat[2] && FirstQuat[3] === SecondQuat[3];
    };
    /**
     * Sets the given quat to identity quat
     *
     * @param GivenQuat {Float32Array}: given quat
     * @returns {void}
     */
    Quat.SetIdentity = function (GivenQuat) {
        GivenQuat[0] = 0;
        GivenQuat[1] = 0;
        GivenQuat[2] = 0;
        GivenQuat[3] = 1;
    };
    /**
     * Sets a quaternion from given axis of rotation and degree of rotation in radians
     *
     * @param OutQuat {Float32Array}: result quat
     * @param Axis {Float32Array}: axis of rotation
     * @param Angle {number}: angle in radians
     * @returns {void}
     */
    Quat.SetFromAxisAngle = function (OutQuat, Axis, Angle) {
        Angle *= 0.5;
        var S = Math.sin(Angle);
        OutQuat[0] = S * Axis[0];
        OutQuat[1] = S * Axis[1];
        OutQuat[2] = S * Axis[2];
        OutQuat[3] = Math.cos(Angle);
    };
    /**
     * Multiplies two given quats
     *
     * @param OutQuat {Float32Array}: result quat
     * @param FirstQuat {Float32Array}: first quat
     * @param SecondQuat {Float32Array}: second quat
     * @returns {void}
     */
    Quat.Multiply = function (OutQuat, FirstQuat, SecondQuat) {
        var AX = FirstQuat[0], AY = FirstQuat[1], AZ = FirstQuat[2], AW = FirstQuat[3];
        var BX = SecondQuat[0], BY = SecondQuat[1], BZ = SecondQuat[2], BW = SecondQuat[3];
        OutQuat[0] = AX * BW + AW * BX + AY * BZ - AZ * BY;
        OutQuat[1] = AY * BW + AW * BY + AZ * BX - AX * BZ;
        OutQuat[2] = AZ * BW + AW * BZ + AX * BY - AY * BX;
        OutQuat[3] = AW * BW - AX * BX - AY * BY - AZ * BZ;
    };
    /**
     * Normalizes the given quat
     *
     * @param OutQuat {Float32Array}: result quat
     * @param QuatToNormalize {Float32Array}: quat to normalize
     * @returns {void}
     */
    Quat.Normalize = function (OutQuat, QuatToNormalize) {
        var SquaredLength = QuatToNormalize[0] * QuatToNormalize[0] + QuatToNormalize[1] * QuatToNormalize[1] + QuatToNormalize[2] * QuatToNormalize[2] + QuatToNormalize[3] * QuatToNormalize[3];
        if (SquaredLength > 0) {
            SquaredLength = 1.0 / Math.sqrt(SquaredLength);
            OutQuat[0] = QuatToNormalize[0] * SquaredLength;
            OutQuat[1] = QuatToNormalize[1] * SquaredLength;
            OutQuat[2] = QuatToNormalize[2] * SquaredLength;
            OutQuat[3] = QuatToNormalize[3] * SquaredLength;
        }
    };
    /**
     * Returns the string representation of the given quat
     *
     * @param GivenQuat {Float32Array}: given quat
     * @returns {string}
     */
    Quat.ToString = function (GivenQuat) {
        return "Vec4: [" + GivenQuat[0] + ", " + GivenQuat[1] + ", " + GivenQuat[2] + ", " + GivenQuat[3] + "]";
    };
    return Quat;
}());
