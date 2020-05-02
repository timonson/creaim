declare class DualElement extends HTMLElement {
    private root;
    private opts;
    private dom;
    private connected;
    constructor();
    connectedCallback(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    static get is(): string;
}
export { DualElement };
