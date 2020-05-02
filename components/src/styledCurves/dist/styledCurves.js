/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss(opts = {}) {
    return `:host{
display: block;
    position : relative;
    background-color : inherit;
    height : 100%;
    width :100%;
  }`;
}
/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
const Template = {
    render(opts) {
        return `<style>${this.getCss(opts)}</style>`;
    },
    getCss,
};

class StyledCurves extends HTMLElement {
    constructor() {
        super(...arguments);
        this.root = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.ctx = makeCanvasContext(this.root.appendChild(document.createElement("canvas")));
        this.root.children[0].innerHTML = Template.render();
    }
    drawCurves(input) {
        if (input == null)
            return this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        else
            drawCubicBezierCurve(this.ctx, modifyPointsForGradientShape(input), input.curvedColor);
    }
    get size() {
        return this.getAttribute("size");
    }
    set size(value) {
        value === null
            ? this.removeAttribute("size")
            : this.setAttribute("size", value);
    }
    static get observedAttributes() {
        return ["size", "color"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue || typeof newValue !== "string")
            return;
        switch (name) {
            case "size":
                const [width, height] = newValue.split(":");
                this.ctx = makeCanvasContext(this.root.querySelector("canvas"), {
                    width: parseInt(width),
                    height: parseInt(height),
                });
                break;
            case "color":
                this.ctx.strokeStyle = newValue;
                this.ctx.fillStyle = newValue;
        }
    }
    static get is() {
        return "styled-curves";
    }
}
function makeCanvasContext(canvas, options, ctxType = "2d") {
    var _a, _b, _c, _d, _e, _f;
    if ((_a = options) === null || _a === void 0 ? void 0 : _a.width)
        canvas.width = options.width;
    if ((_b = options) === null || _b === void 0 ? void 0 : _b.height)
        canvas.height = options.height;
    const ctx = canvas.getContext(ctxType);
    ctx.width = canvas.width;
    ctx.height = canvas.height;
    if ((_c = options) === null || _c === void 0 ? void 0 : _c.fillStyle)
        ctx.fillStyle = options.fillStyle;
    if ((_d = options) === null || _d === void 0 ? void 0 : _d.strokeStyle)
        ctx.strokeStyle = options.strokeStyle;
    if ((_e = options) === null || _e === void 0 ? void 0 : _e.lineWidth)
        ctx.lineWidth = options.lineWidth;
    else
        ctx.lineWidth = 4;
    if ((_f = options) === null || _f === void 0 ? void 0 : _f.lineJoin)
        ctx.lineJoin = options.lineJoin;
    else
        ctx.lineJoin = "round";
    return ctx;
}
function drawCubicBezierCurve(ctx, [p1, p2, p3], color) {
    const unit = (a, b, u) => (b - a) * u + a;
    if (color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.bezierCurveTo(unit(p1[0], p2[0], 0.5), unit(p1[1], p2[1], 0.0), unit(p1[0], p2[0], 0.5), unit(p1[1], p2[1], 1.0), p2[0], p2[1]);
    ctx.bezierCurveTo(unit(p2[0], p3[0], 0.5), unit(p2[1], p3[1], 0.0), unit(p2[0], p3[0], 0.5), unit(p2[1], p3[1], 1.0), p3[0], p3[1]);
    ctx.fill();
    ctx.stroke();
    return [p1, p2, p3];
}
function modifyPointsForGradientShape({ start, end, level = 1, offsetXForEnd = [0, 0], offsetXYForStart = [0, 0], }) {
    function calculateCurveWidth(level) {
        return 48 - 8 * level < 0 ? 0 : 48 - 8 * level;
    }
    function centerStartingPoint(x, y) {
        return [x + offsetXYForStart[0] / 2, y + offsetXYForStart[1] / 2];
    }
    const curveWidth = calculateCurveWidth(level);
    const curveOffset = [0, 0];
    Math.abs(start[0] - end[0]) <= Math.abs(start[1] - end[1])
        ? (curveOffset[0] = curveWidth)
        : (curveOffset[1] = curveWidth);
    return start[0] <= end[0]
        ? [
            centerStartingPoint(start[0] - curveOffset[0] / 2, start[1] - curveOffset[1] / 2),
            [end[0] + offsetXForEnd[1], end[1]],
            centerStartingPoint(start[0] + curveOffset[0] / 2, start[1] + curveOffset[1] / 2),
        ]
        : [
            centerStartingPoint(start[0] - curveOffset[0] / 2, start[1] - curveOffset[1] / 2),
            [end[0] + offsetXForEnd[0], end[1]],
            centerStartingPoint(start[0] + curveOffset[0] / 2, start[1] + curveOffset[1] / 2),
        ];
}
customElements.define(StyledCurves.is, StyledCurves);

export { StyledCurves };
//# sourceMappingURL=styledCurves.js.map
