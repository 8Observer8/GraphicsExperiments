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

/// <reference path='../../Include/webgl2.d.ts' />

"use strict";

/**
 * Compiles the given shaders and returns the program object
 * 
 * @param GL: {WebGLRenderingContext}: WebGL context
 * @param VertexShaderSource {string}: source of the vertex shader 
 * @param FragmentShaderSource {string}: source of the fragment shader
 * @returns {WebGLProgram | null}
 */
function CompileShaders(GL: WebGLRenderingContext | WebGL2RenderingContext, VertexShaderSource: string, FragmentShaderSource: string): WebGLProgram | null
{
    const VertexShader: WebGLShader | null = GL.createShader(GL.VERTEX_SHADER);

    GL.shaderSource(VertexShader, VertexShaderSource);

    GL.compileShader(VertexShader);

    let Success: boolean = GL.getShaderParameter(VertexShader, GL.COMPILE_STATUS);

    if(!Success)
    {
        throw new Error("Vertex shader compilation failed: " + GL.getShaderInfoLog(VertexShader));
    }

    const FragmentShader: WebGLShader | null = GL.createShader(GL.FRAGMENT_SHADER);

    GL.shaderSource(FragmentShader, FragmentShaderSource);

    GL.compileShader(FragmentShader);

    Success = GL.getShaderParameter(FragmentShader, GL.COMPILE_STATUS);

    if(!Success)
    {
        throw new Error("Fragment shader compilation failed: " + GL.getShaderInfoLog(FragmentShader));
    }

    const ShaderProgram: WebGLProgram | null = GL.createProgram();

    GL.attachShader(ShaderProgram, VertexShader);

    GL.attachShader(ShaderProgram, FragmentShader);

    GL.linkProgram(ShaderProgram);

    Success = GL.getProgramParameter(ShaderProgram, GL.LINK_STATUS);

    if(!Success)
    {
        throw new Error("Shader linking failed: " + GL.getProgramInfoLog(ShaderProgram));
    }

    GL.deleteShader(VertexShader);

    GL.deleteShader(FragmentShader);

    return ShaderProgram;
}