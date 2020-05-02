declare type Hsb = {
    h: number;
    s: number;
    b: number;
};
declare type Rgb = {
    r: number;
    g: number;
    b: number;
};
declare type State = {
    sb: {
        s: number;
        b: number;
    };
    hsb: {
        h: number;
        s: number;
        b: number;
    };
    rgb: {
        r: number;
        g: number;
        b: number;
    };
    hex: string;
};
declare class ColorSlider extends HTMLElement {
    private root;
    private pickers;
    state: State;
    private opts;
    private connected;
    constructor();
    get hex(): string;
    pickHue(isVertical: boolean, event: MouseEvent): void;
    updateState(obj: Hsb | Rgb | string, isVertical?: boolean): State;
    updateSvgAttributes({ hsb, hex }: State, isVertical?: boolean): void;
    render(): void;
    connectedCallback(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    static get is(): string;
}
export { ColorSlider };
