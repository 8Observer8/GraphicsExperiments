/// <reference path="../../Util/Util.d.ts" />

"use strict";

/**
 * Main function 
 * 
 * @returns {void}
 */
function Main(): void
{
    const NewEditor: Editor = new Editor("Build/windows.js", true);

    NewEditor.Init();
}

/* Wait until the window finishes loading */
window.onload = Main;