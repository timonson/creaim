import "../colorSlider/colorSlider.js";
declare class SettingOptions extends HTMLElement {
    private root;
    private opts;
    constructor();
    connectedCallback(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    static get is(): string;
}
export { SettingOptions };
