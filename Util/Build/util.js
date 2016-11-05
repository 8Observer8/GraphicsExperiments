"use strict";
var Editor = (function () {
    function Editor(ScriptLocation, bClearConsole) {
        this.ScriptLocation = ScriptLocation;
        Editor.bClearConsole = bClearConsole;
    }
    Editor.prototype.Init = function () {
        this.InitEditor();
        this.InitFrame();
    };
    Editor.ReplaceFrameContent = function () {
        Editor.FrameContent = Editor.Frame.contentWindow.document;
        Editor.FrameContent.open();
        Editor.FrameContent.write("<link rel='stylesheet' href='../Styles/normalize.css'/>");
        Editor.FrameContent.write("<body></body>");
        Editor.FrameContent.write("<script src='../Math/Build/Math.min.js'></script>");
        Editor.FrameContent.write("<script src='../Dev/Build/dev.js'></script>");
        Editor.FrameContent.write("<script>" + Editor.AceEditor.getValue() + "</script>");
        Editor.FrameContent.close();
    };
    Editor.ReloadFrame = function () {
        if (Editor.bClearConsole) {
            console.clear();
        }
        Editor.Frame.src = Editor.Frame.src;
        Editor.Frame.onload = Editor.ReplaceFrameContent;
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
        Editor.Frame = document.getElementById("demoFrame");
        Editor.FrameContent = Editor.Frame.contentWindow.document;
        document.addEventListener("keydown", function (Evt) {
            if (Evt.ctrlKey && Evt.keyCode === 13) {
                Editor.ReloadFrame();
            }
        });
        var Client = new XMLHttpRequest();
        Client.open('GET', this.ScriptLocation);
        Client.onreadystatechange = function () {
            Editor.AceEditor.setValue(Client.responseText);
            Editor.ReloadFrame();
        };
        Client.send();
    };
    return Editor;
}());
