/// <reference path='../../Math/Math.d.ts' />
/// <reference path='../../Dev/Dev.d.ts' />
/// <reference path='../../Include/webgl2.d.ts' />
"use strict";
/* Canvas element */
var CANVAS = document.createElement("canvas");
document.body.appendChild(CANVAS);
/* WebGL context */
var GL = CANVAS.getContext("webgl2", { antialias: false });
if (GL === null) {
    throw new Error("WebGL2 is not supported");
}
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
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    GL.clearColor(0.5, 0.5, 1.0, 1.0);
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT);
}
Init();
