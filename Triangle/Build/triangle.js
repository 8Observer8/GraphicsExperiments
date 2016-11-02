/* Canvas element */
var CANVAS = document.createElement("canvas");
/* WebGL context */
var GL = CANVAS.getContext("webgl", { antialias: false });
document.body.appendChild(CANVAS);
/**
 * Resizes the context
 *
 * @returns void
 */
function Resize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
}
window.addEventListener("resize", Resize);
/**
 * Main function
 *
 * @returns void
 */
function Init() {
    if (GL === null) {
        throw new Error("WebGL is not supported");
    }
    else {
        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;
        var VertexShaderSource = "#version 100\n            attribute mediump vec2 aPosition;\n            void main(void){gl_Position = vec4(aPosition, 1, 1);}";
        var FragmentShaderSource = "#version 100\n            precision mediump float;\n            void main(void){gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0);}";
        var ShaderProgram = CompileShaders(GL, VertexShaderSource, FragmentShaderSource);
        var Vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);
        var Indices = new Uint16Array([0, 1, 2]);
        var VertexBuffer = GL.createBuffer();
        var IndexBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, Vertices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, Indices, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
        GL.useProgram(ShaderProgram);
        GL.bindBuffer(GL.ARRAY_BUFFER, VertexBuffer);
        var VertexPosition = GL.getAttribLocation(ShaderProgram, "aPosition");
        GL.enableVertexAttribArray(VertexPosition);
        GL.vertexAttribPointer(VertexPosition, 2, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.clearColor(0.5, 0.5, 1.0, 1.0);
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, IndexBuffer);
        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
    }
}
Init();
