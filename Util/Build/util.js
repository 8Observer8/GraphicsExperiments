"use strict";
var Editor = (function () {
    function Editor(ScriptLocation, bClearConsole) {
        this.ScriptLocation = ScriptLocation;
        Editor.bClearConsole = bClearConsole;
    }
    Editor.prototype.Init = function () {
        this.InitEditor();
        this.InitFrame();
        Editor.ReloadFrame(Editor.FrameContent, Editor.AceEditor);
    };
    Editor.ReloadFrame = function (FrameContent, AceEditor) {
        if (Editor.bClearConsole) {
            console.clear();
        }
        FrameContent.open();
        FrameContent.write("<link rel='stylesheet' href='../Styles/normalize.css'/>");
        FrameContent.write("<body></body>");
        FrameContent.write("<script src='../Math/Build/Math.min.js'></script>");
        FrameContent.write("<script src='../Dev/Build/dev.js'></script>");
        FrameContent.write("<script>" + AceEditor.getValue() + "</script>");
        FrameContent.close();
    };
    Editor.prototype.InitEditor = function () {
        Editor.AceEditor = ace.edit("editor");
        Editor.AceEditor.$blockScrolling = Infinity;
        Editor.AceEditor.setTheme("ace/theme/twilight");
        Editor.AceEditor.getSession().setMode("ace/mode/javascript");
        Editor.AceEditor.getSession().setTabSize(4);
        Editor.AceEditor.getSession().setUseSoftTabs(false);
        this.EditorDiv = document.getElementById('editor');
        if (this.EditorDiv === null) {
            throw new Error("Editor div not found");
        }
        this.EditorDiv.style.fontSize = '12pt';
        Editor.AceEditor.getSession().setUseWrapMode(true);
        Editor.AceEditor.setHighlightActiveLine(true);
    };
    Editor.prototype.InitFrame = function () {
        this.Frame = document.getElementById("demoFrame");
        Editor.FrameContent = this.Frame.contentWindow.document;
        Editor.AceEditor.getSession().on('change', function () {
            Editor.ReloadFrame(Editor.FrameContent, Editor.AceEditor);
        });
        var Client = new XMLHttpRequest();
        Client.open('GET', this.ScriptLocation);
        Client.onreadystatechange = function () {
            Editor.AceEditor.setValue(Client.responseText);
        };
        Client.send();
    };
    return Editor;
}());
