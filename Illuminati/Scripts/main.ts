declare const Editor: any;

"use strict";

/**
 * Main function 
 * 
 * @returns {void}
 */
function Main(): void
{
    const NewEditor: any = <any>new Editor("Build/illuminati.js", true);

    NewEditor.Init();
}

/* Wait until the window finishes loading */
window.onload = Main;