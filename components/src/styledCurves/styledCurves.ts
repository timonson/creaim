import { Template } from "./template.js"

type Point = [number, number]
type DrawingData = {
  start: Point
  end: Point
  offsetXForEnd?: Point
  offsetXYForStart?: Point
  level?: number
  curvedColor?: string
}
type Canvas = CanvasRenderingContext2D & {
  width?: number
  height?: number
  curvedColor?: string
}

class StyledCurves extends HTMLElement {
  private root = this.attachShadow({ mode: "open" })!
  private ctx!: Canvas

  connectedCallback() {
    this.ctx = makeCanvasContext(
      this.root.appendChild(document.createElement("canvas"))
    )
    this.root.children[0].innerHTML = Template.render()
  }

  drawCurves(input: DrawingData | null) {
    if (input == null)
      return this.ctx.clearRect(0, 0, this.ctx.width!, this.ctx.height!)
    else
      drawCubicBezierCurve(
        this.ctx,
        modifyPointsForGradientShape(input),
        input.curvedColor
      )
  }

  get size(): string | null {
    return this.getAttribute("size")
  }
  set size(value: string | null) {
    value === null
      ? this.removeAttribute("size")
      : this.setAttribute("size", value)
  }

  static get observedAttributes() {
    return ["size", "color"]
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (newValue === oldValue || typeof newValue !== "string") return
    switch (name) {
      case "size":
        const [width, height] = newValue.split(":")
        this.ctx = makeCanvasContext(this.root.querySelector("canvas")!, {
          width: parseInt(width),
          height: parseInt(height),
        })
        break
      case "color":
        this.ctx.strokeStyle = newValue
        this.ctx.fillStyle = newValue
    }
  }

  static get is() {
    return "styled-curves"
  }
}

function makeCanvasContext(
  canvas: HTMLCanvasElement,
  options?: Partial<Canvas>,
  ctxType = "2d"
) {
  if (options?.width) canvas.width = options.width
  if (options?.height) canvas.height = options.height
  const ctx = canvas.getContext(ctxType) as Canvas
  ctx.width = canvas.width
  ctx.height = canvas.height
  if (options?.fillStyle) ctx.fillStyle = options.fillStyle
  if (options?.strokeStyle) ctx.strokeStyle = options.strokeStyle
  if (options?.lineWidth) ctx.lineWidth = options.lineWidth
  else ctx.lineWidth = 4
  if (options?.lineJoin) ctx.lineJoin = options.lineJoin
  else ctx.lineJoin = "round"
  return ctx
}

function drawCubicBezierCurve(
  ctx: Canvas,
  [p1, p2, p3]: [Point, Point, Point],
  color?: string
) {
  const unit = (a: number, b: number, u: number) => (b - a) * u + a
  if (color) {
    ctx.strokeStyle = color
    ctx.fillStyle = color
  }
  ctx.beginPath()
  ctx.moveTo(p1[0], p1[1])
  ctx.bezierCurveTo(
    unit(p1[0], p2[0], 0.5),
    unit(p1[1], p2[1], 0.0),
    unit(p1[0], p2[0], 0.5),
    unit(p1[1], p2[1], 1.0),
    p2[0],
    p2[1]
  )
  ctx.bezierCurveTo(
    unit(p2[0], p3[0], 0.5),
    unit(p2[1], p3[1], 0.0),
    unit(p2[0], p3[0], 0.5),
    unit(p2[1], p3[1], 1.0),
    p3[0],
    p3[1]
  )
  ctx.fill()
  ctx.stroke()
  return [p1, p2, p3]
}

function modifyPointsForGradientShape({
  start,
  end,
  level = 1,
  offsetXForEnd = [0, 0],
  offsetXYForStart = [0, 0],
}: DrawingData): [Point, Point, Point] {
  function calculateCurveWidth(level: number) {
    return 48 - 8 * level < 0 ? 0 : 48 - 8 * level
  }
  function centerStartingPoint(x: number, y: number): Point {
    return [x + offsetXYForStart[0] / 2, y + offsetXYForStart[1] / 2]
  }
  const curveWidth = calculateCurveWidth(level)
  const curveOffset = [0, 0]
  Math.abs(start[0] - end[0]) <= Math.abs(start[1] - end[1])
    ? (curveOffset[0] = curveWidth)
    : (curveOffset[1] = curveWidth)
  return start[0] <= end[0]
    ? [
        centerStartingPoint(
          start[0] - curveOffset[0] / 2,
          start[1] - curveOffset[1] / 2
        ),
        [end[0] + offsetXForEnd[1], end[1]],
        centerStartingPoint(
          start[0] + curveOffset[0] / 2,
          start[1] + curveOffset[1] / 2
        ),
      ]
    : [
        centerStartingPoint(
          start[0] - curveOffset[0] / 2,
          start[1] - curveOffset[1] / 2
        ),
        [end[0] + offsetXForEnd[0], end[1]],
        centerStartingPoint(
          start[0] + curveOffset[0] / 2,
          start[1] + curveOffset[1] / 2
        ),
      ]
}

customElements.define(StyledCurves.is, StyledCurves)

export { StyledCurves, DrawingData }
