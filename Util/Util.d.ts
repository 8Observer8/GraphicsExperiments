declare class Editor
{
    public static bClearConsole: boolean;
    private static AceEditor: any;
    private static Frame: HTMLIFrameElement;
    private static FrameContent: Document;
    private EditorDiv: HTMLDivElement;
    private ScriptLocation: string;

    constructor(ScriptLocation: string, bClearConsole: boolean);
    public Init(): void;
    private static ReplaceFrameContent(): void;
    private static ReloadFrame(): void;
    private InitEditor(): void;
    private InitFrame(): void;
}