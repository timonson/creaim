declare type Point = [number, number];
declare type DrawingData = {
    start: Point;
    end: Point;
    offsetXForEnd?: Point;
    offsetXYForStart?: Point;
    level?: number;
    curvedColor?: string;
};
declare class StyledCurves extends HTMLElement {
    private root;
    private ctx;
    connectedCallback(): void;
    drawCurves(input: DrawingData | null): void;
    get size(): string | null;
    set size(value: string | null);
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    static get is(): string;
}
export { StyledCurves, DrawingData };
