declare class DragAndDrop extends HTMLElement {
    private root;
    private dom;
    private connected;
    boundary: {
        left: number;
        top: number;
    };
    constructor();
    get activated(): string | null;
    set activated(value: string | null);
    private dragAndDropCurrentTarget;
    connectedCallback(): void;
    static get observedAttributes(): (string | undefined)[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    static get is(): string;
}
export { DragAndDrop };
