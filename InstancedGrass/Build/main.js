/// <reference path="../../Util/Util.d.ts" />
"use strict";
/**
 * Main function
 *
 * @returns {void}
 */
function Main() {
    var NewEditor = new Editor("Build/grass.js", true);
    NewEditor.Init();
}
/* Wait until the window finishes loading */
window.onload = Main;
