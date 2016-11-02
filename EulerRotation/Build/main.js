/**
 * Main function
 *
 * @returns {void}
 */
function Main() {
    var NewEditor = new Editor("Build/euler.js", true);
    NewEditor.Init();
}
/* Wait until the window finishes loading */
window.onload = Main;
