function CompileShaders(GL, VertexShaderSource, FragmentShaderSource) {
    var VertexShader = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(VertexShader, VertexShaderSource);
    GL.compileShader(VertexShader);
    var Success = GL.getShaderParameter(VertexShader, GL.COMPILE_STATUS);
    if (!Success) {
        throw new Error("Vertex shader compilation failed: " + GL.getShaderInfoLog(VertexShader));
    }
    var FragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(FragmentShader, FragmentShaderSource);
    GL.compileShader(FragmentShader);
    Success = GL.getShaderParameter(FragmentShader, GL.COMPILE_STATUS);
    if (!Success) {
        throw new Error("Fragment shader compilation failed: " + GL.getShaderInfoLog(FragmentShader));
    }
    var ShaderProgram = GL.createProgram();
    GL.attachShader(ShaderProgram, VertexShader);
    GL.attachShader(ShaderProgram, FragmentShader);
    GL.linkProgram(ShaderProgram);
    Success = GL.getProgramParameter(ShaderProgram, GL.LINK_STATUS);
    if (!Success) {
        throw new Error("Shader linking failed: " + GL.getProgramInfoLog(ShaderProgram));
    }
    GL.deleteShader(VertexShader);
    GL.deleteShader(FragmentShader);
    return ShaderProgram;
}
