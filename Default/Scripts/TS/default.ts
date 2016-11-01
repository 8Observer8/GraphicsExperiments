/* Canvas element */
const CANVAS: HTMLCanvasElement = document.createElement("canvas");

/* WebGL context */
const GL: WebGLRenderingContext = <WebGLRenderingContext>CANVAS.getContext("webgl", {antialias: false});

document.body.appendChild(CANVAS);

/**
 * Resizes the context 
 * 
 * @returns void
 */
function Resize()
{
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
function Main()
{
    if(GL === null)
    {
        throw new Error("WebGL is not supported");
    }
    else
    {
        CANVAS.width = window.innerWidth;

        CANVAS.height = window.innerHeight;

        GL.clearColor(0.5, 0.5, 1.0, 1.0);

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);

        GL.clear(GL.COLOR_BUFFER_BIT);
    }
}

Main();