/* Editor object */
var Editor;

/* Frame object */
var Frame;

/* Content of the frame */
var FrameContent;

/**
 * Reload the frame
 */
function ReloadFrame()
{
    console.clear();

    FrameContent.open();

    FrameContent.write("<link rel='stylesheet' href='../Styles/normalize.css'/><body></body><script>"
     + Editor.getValue() + 
     "</script>");

    FrameContent.close();
}

/**
 * Main function
 */
function Main()
{
    /************************************* EDITOR *************************************/

    Editor = ace.edit("editor");

    Editor.$blockScrolling = Infinity;

    Editor.setTheme("ace/theme/twilight");

    Editor.getSession().setMode("ace/mode/javascript");

    Editor.getSession().setTabSize(4);

    Editor.getSession().setUseSoftTabs(false);

    document.getElementById('editor').style.fontSize='12pt';

    Editor.getSession().setUseWrapMode(true);

    Editor.setHighlightActiveLine(true);

    Editor.getSession().on('change', ReloadFrame);

    /**********************************************************************************/

    /************************************** FRAME *************************************/

    Frame = document.getElementById("demoFrame");

    FrameContent = Frame.contentWindow.document;

    var Client = new XMLHttpRequest();

    Client.open('GET', 'Scripts/JS/triangle.js');

    Client.onreadystatechange = function() 
    {
        Editor.setValue(Client.responseText);
    }

    Client.send();

    ReloadFrame();

    /**********************************************************************************/
}

/* Wait until the window finishes loading */
window.onload = Main;