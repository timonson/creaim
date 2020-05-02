declare const readingMethods: Set<"readAsArrayBuffer" | "readAsBinaryString" | "readAsDataURL" | "readAsText">;
declare type ReadingMethods = typeof readingMethods extends Set<infer T> ? T : never;
declare class AnyFileReader extends HTMLElement {
    private root;
    private dom;
    private opts;
    waitForFile: AsyncGenerator;
    connectedCallback(): void;
    private fileDataGenerator;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get readingMethod(): ReadingMethods;
    set readingMethod(value: ReadingMethods);
    get fileType(): string | null;
    set fileType(value: string | null);
    static get is(): string;
}
export { AnyFileReader };
