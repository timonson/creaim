declare class ModalWindow extends HTMLElement {
    root: ShadowRoot;
    dom: {
        modal: HTMLDivElement;
        modalClose: HTMLButtonElement;
        slot: HTMLElement;
    };
    connected: boolean;
    opts: {
        showModal: boolean;
    };
    constructor();
    connectedCallback(): void;
    get showModal(): boolean;
    set showModal(value: boolean);
    showModalAndWaitForClose(): Promise<unknown>;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): true | undefined;
    static get is(): string;
}
export { ModalWindow };
