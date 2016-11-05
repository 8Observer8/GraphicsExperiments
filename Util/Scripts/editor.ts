/*
* The MIT License (MIT)
* Copyright (c) <2016> <Omar Huseynov>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
* persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
* ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
* THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

/* ace global var */
declare let ace: any;

class Editor
{
    /* Whether to clear the console or not */
    public static bClearConsole: boolean;

    /* Ace editor */
    private static AceEditor: any;

    /* Frame object */
    private static Frame: HTMLIFrameElement;

    /* Content of the frame */
    private static FrameContent: Document;

    /* Div element containing editor */
    private EditorDiv: HTMLDivElement;

    /* Location of the script file to load and run */
    private ScriptLocation: string;

    /**
     * @constructor
     * 
     * @param ScriptLocation {string}: location of the script file to load and run
     * @param bClearConsole {boolean}: whether to clear the console or not
     */
    constructor(ScriptLocation: string, bClearConsole: boolean)
    {
        this.ScriptLocation = ScriptLocation;

        Editor.bClearConsole = bClearConsole;
    }

    /**
     * Main initialization function 
     * 
     * @returns {void}
     */
    public Init(): void 
    {
        this.InitEditor();

        this.InitFrame();
    }

    /**
     * Replaces the content of the frame 
     * 
     * @returns {void}
     */
    private static ReplaceFrameContent(): void 
    {
        Editor.FrameContent = Editor.Frame.contentWindow.document;

        Editor.FrameContent.open();

        Editor.FrameContent.write("<link rel='stylesheet' href='../Styles/normalize.css'/>");

        Editor.FrameContent.write("<body></body>");

        Editor.FrameContent.write("<script src='../Math/Build/Math.min.js'></script>");

        Editor.FrameContent.write("<script src='../Dev/Build/dev.js'></script>");

        Editor.FrameContent.write("<script>" + Editor.AceEditor.getValue() + "</script>");

        Editor.FrameContent.close();
    }

    /**
     * Reloaded the frame 
     */
    private static ReloadFrame(): void 
    {
        if(Editor.bClearConsole)
        {
            console.clear();
        }

        Editor.Frame.src = Editor.Frame.src;

        Editor.Frame.onload = Editor.ReplaceFrameContent;
    }

    /**
     * Initializes the frame
     */
    private InitEditor(): void 
    {
        Editor.AceEditor = ace.edit("editor");

        Editor.AceEditor.$blockScrolling = Infinity;

        Editor.AceEditor.setTheme("ace/theme/twilight");

        Editor.AceEditor.getSession().setMode("ace/mode/javascript");

        Editor.AceEditor.getSession().setTabSize(4);

        Editor.AceEditor.getSession().setUseSoftTabs(false);

        this.EditorDiv = <HTMLDivElement>document.getElementById('editor');

        if(this.EditorDiv === null)
        {
            throw new Error("Editor div not found");
        }

        this.EditorDiv.style.fontSize='12pt';

        Editor.AceEditor.getSession().setUseWrapMode(true);

        Editor.AceEditor.setHighlightActiveLine(true);
    }

    /**
     * Initializes the frame 
     * 
     * @returns {void}
     */
    private InitFrame(): void
    {
        Editor.Frame = <HTMLIFrameElement>document.getElementById("demoFrame");

        Editor.FrameContent = Editor.Frame.contentWindow.document;

        document.addEventListener("keydown", function(Evt: KeyboardEvent)
        {

            if(Evt.ctrlKey && Evt.keyCode === 13) // ENTER 
            {
                Editor.ReloadFrame();
            }

        });

        var Client = new XMLHttpRequest();

        Client.open('GET', this.ScriptLocation);

        Client.onreadystatechange = function() 
        {
            Editor.AceEditor.setValue(Client.responseText);

            Editor.ReloadFrame();
        }

        Client.send();
    }
}