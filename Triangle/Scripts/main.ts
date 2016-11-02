declare const Editor: any;

/**
 * Main function 
 * 
 * @returns {void}
 */
function Main(): void
{
    const NewEditor: any = <any>new Editor("Build/triangle.js", true);

    NewEditor.Init();
}

/* Wait until the window finishes loading */
window.onload = Main;