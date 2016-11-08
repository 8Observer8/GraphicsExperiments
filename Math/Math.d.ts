declare abstract class Vec2
{
    public static Create(): Float32Array;
    public static FromValues(X: number, Y: number): Float32Array;
    public static Add(OutVec:Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static Subtract(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static Copy(VecToCopy: Float32Array): Float32Array;
    public static Clone(OutVec: Float32Array, VecToClone: Float32Array): void;
    public static Distance(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static SquaredDistance(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static Dot(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static bEquals(FirstVec: Float32Array, SecondVec: Float32Array): boolean;
    public static Length(GivenVec: Float32Array): number;
    public static SquaredLength(GivenVec: Float32Array): number;
    public static Lerp(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array, Amount: number): void;
    public static Multiply(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static MultiplyScalar(OutVec: Float32Array, FirstVec: Float32Array, Amount: number): void;
    public static Normalize(OutVec: Float32Array, VecToNormalize: Float32Array): void;
    public static ToString(GivenVec: Float32Array): string;
}
declare abstract class Vec3
{
    public static Create(): Float32Array;
    public static FromValues(X: number, Y: number, Z: number): Float32Array;
    public static Add(OutVec:Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static Subtract(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static Copy(VecToCopy: Float32Array): Float32Array;
    public static Clone(OutVec: Float32Array, VecToClone: Float32Array): void;
    public static Distance(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static SquaredDistance(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static Dot(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static Cross(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static bEquals(FirstVec: Float32Array, SecondVec: Float32Array): boolean;
    public static Length(GivenVec: Float32Array): number;
    public static SquaredLength(GivenVec: Float32Array): number;
    public static Lerp(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array, Amount: number): void;
    public static Multiply(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static MultiplyScalar(OutVec: Float32Array, FirstVec: Float32Array, Amount: number): void;
    public static Normalize(OutVec: Float32Array, VecToNormalize: Float32Array): void;
    public static ToString(GivenVec: Float32Array): string;
}
declare abstract class Vec4 
{
    public static Create(): Float32Array;
    public static FromValues(X: number, Y: number, Z: number, W: number): Float32Array;
    public static Add(OutVec:Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static Subtract(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static Copy(VecToCopy: Float32Array): Float32Array;
    public static Clone(OutVec: Float32Array, VecToClone: Float32Array): void;
    public static Distance(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static SquaredDistance(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static Dot(FirstVec: Float32Array, SecondVec: Float32Array): number;
    public static bEquals(FirstVec: Float32Array, SecondVec: Float32Array): boolean;
    public static Length(GivenVec: Float32Array): number;
    public static SquaredLength(GivenVec: Float32Array): number;
    public static Lerp(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array, Amount: number): void;
    public static Multiply(OutVec: Float32Array, FirstVec: Float32Array, SecondVec: Float32Array): void;
    public static MultiplyScalar(OutVec: Float32Array, FirstVec: Float32Array, Amount: number): void;
    public static Normalize(OutVec: Float32Array, VecToNormalize: Float32Array): void;
    public static ToString(GivenVec: Float32Array): string;
}
declare abstract class Mat2
{
    public static Create(): Float32Array;
    public static Copy(GivenMat: Float32Array): Float32Array;
    public static Clone(OutMat: Float32Array, MatToClone: Float32Array): void;
    public static SetIdentity(GivenMat: Float32Array): void;
    public static Determinant(GivenMat: Float32Array): number;
    public static bEquals(FirstMat: Float32Array, SecondMat: Float32Array): boolean;
    public static Invert(OutMat: Float32Array, MatToInvert: Float32Array): void;
    public static Multiply(OutMat: Float32Array, FirstMat: Float32Array, SecondMat: Float32Array): void;
    public static Transpose(OutMat: Float32Array, MatToTranspose: Float32Array): void;
    public static TransposeItself(MatToTranspose: Float32Array): void;
}
declare abstract class Mat3
{
    public static Create(): Float32Array;
    public static Copy(GivenMat: Float32Array): Float32Array;
    public static Clone(OutMat: Float32Array, MatToClone: Float32Array): void;
    public static SetIdentity(GivenMat: Float32Array): void;
    public static Determinant(GivenMat: Float32Array): number;
    public static bEquals(FirstMat: Float32Array, SecondMat: Float32Array): boolean;
    public static Invert(OutMat: Float32Array, MatToInvert: Float32Array): void;
    public static Multiply(OutMat: Float32Array, FirstMat: Float32Array, SecondMat: Float32Array): void;
    public static Transpose(OutMat: Float32Array, MatToTranspose: Float32Array): void;
    public static TransposeItself(MatToTranspose: Float32Array): void;
    public static FromRotationTranslationScale(OutMat: Float32Array, TranslationVector: Float32Array, RotationZ: number, ScalingVector: Float32Array): void;
    public static CreateNormalMat(NormalMat: Float32Array, GivenModelMat: Float32Array): void;
}
declare abstract class Mat4 
{
    public static Create(): Float32Array;
    public static Copy(GivenMat: Float32Array): Float32Array;
    public static Clone(OutMat: Float32Array, MatToClone: Float32Array): void;
    public static SetIdentity(GivenMat: Float32Array): void;
    public static Determinant(GivenMat: Float32Array): number;
    public static bEquals(FirstMat: Float32Array, SecondMat: Float32Array): boolean;
    public static Invert(OutMat: Float32Array, MatToInvert: Float32Array): void;
    public static Multiply(OutMat: Float32Array, FirstMat: Float32Array, SecondMat: Float32Array): void;
    public static Transpose(OutMat: Float32Array, MatToTranspose: Float32Array): void;
    public static TransposeItself(MatToTranspose: Float32Array): void;
    public static CreateViewMat(OutMat: Float32Array, EyePosition: Float32Array, LookAt: Float32Array, UpVector: Float32Array): void;
    public static CreateOrthographicProjectionMat(OutMat: Float32Array, Left: number, Right: number, Top: number, Bottom: number, Near: number, Far: number): void;
    public static CreatePerspectiveProjectionMat(OutMat: Float32Array, AspectRatio: number, FOV: number, Near: number, Far: number): void;
    public static FromRotationTranslationScale(OutMat: Float32Array, QuatRotation: Float32Array, TranslationVector: Float32Array, ScalingVector: Float32Array): void;
}
declare abstract class Quat 
{
    public static Create(): Float32Array;
    public static Copy(QuatToCopy: Float32Array): Float32Array;
    public static Clone(OutQuat: Float32Array, QuatToClone: Float32Array): void;
    public static bEquals(FirstQuat: Float32Array, SecondQuat: Float32Array): boolean;
    public static SetIdentity(GivenQuat: Float32Array): void;
    public static SetFromAxisAngle(OutQuat: Float32Array, Axis: Float32Array, Angle: number): void;
    public static Multiply(OutQuat: Float32Array, FirstQuat: Float32Array, SecondQuat: Float32Array): void;
    public static Normalize(OutQuat: Float32Array, QuatToNormalize: Float32Array): void;
    public static ToString(GivenQuat: Float32Array): string;
    public static MultiplyWithVector(ResultVec: Float32Array, QuatToMultiplyWith: Float32Array, GivenVec: Float32Array): void;
}