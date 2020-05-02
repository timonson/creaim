declare class AnyFileDownloader extends HTMLElement {
    private root;
    private dom;
    opts: {
        fileType: string;
        filename: string;
        content: string;
    };
    makeDownload: (str: string | (() => string), fileType?: string) => Promise<string>;
    constructor();
    connectedCallback(): void;
    private _makeDownload;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get fileType(): string | null;
    set fileType(value: string | null);
    get filename(): string | null;
    set filename(value: string | null);
    static get is(): string;
}
export { AnyFileDownloader };
