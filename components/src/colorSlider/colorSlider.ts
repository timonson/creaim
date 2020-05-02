import { Template } from "./template.js"

type Hsb = { h: number; s: number; b: number }
type Rgb = { r: number; g: number; b: number }
type State = {
  sb: { s: number; b: number }
  hsb: { h: number; s: number; b: number }
  rgb: { r: number; g: number; b: number }
  hex: string
}
type Pickers = {
  hue: {
    slider: HTMLElement
    handler: HTMLElement
  }
}
type Values = Record<number, number[]>
class ColorSlider extends HTMLElement {
  private root = this.attachShadow({ mode: "open" })!
  private pickers: Pickers = {} as Pickers
  state: State = {
    sb: { s: 30, b: 95 },
    hsb: { h: 0, s: 30, b: 95 },
    rgb: { r: 255, g: 255, b: 255 },
    hex: "#FFFFFF",
  }
  private opts = { rotation: 0, marginTop: "0", width: 200, height: 12 }
  private connected = false
  constructor() {
    super()
    const onDrag = (callback: (e: MouseEvent) => void) => {
      this.addEventListener("mousemove", callback)
      document.addEventListener(
        "mouseup",
        () => this.removeEventListener("mousemove", callback),
        { once: true }
      )
    }
    this.root.addEventListener("mousedown", event => {
      if (
        event.target == this.pickers.hue.slider ||
        event.target == this.pickers.hue.handler
      ) {
        this.pickHue(
          this.getAttribute("vertical") !== null,
          event as MouseEvent
        )
        onDrag(this.pickHue.bind(this, this.getAttribute("vertical") !== null))
      }
    })
  }

  get hex(): string {
    return "#" + this.state.hex
  }

  pickHue(isVertical: boolean, event: MouseEvent) {
    const { x, y, width, height } = getPickCoordinates(
      event,
      this.pickers.hue.slider
    )
    this.updateState(
      {
        ...this.state.sb,
        h: Math.round(isVertical ? calcH(y, height) : calcH(x, width)),
      },
      isVertical
    )
    event.preventDefault()
  }

  updateState(obj: Hsb | Rgb | string, isVertical?: boolean): State {
    if (typeof obj === "object" && "h" in obj) {
      // make extreme colors on extreme points on the slider
      if (obj.h > 353) return this.updateState({ r: 84, g: 56, b: 58 })
      if (obj.h < 7) return this.updateState("#FFFFFF")
      this.state.hsb = { ...this.state.hsb, ...obj }
      this.state.rgb = toRGB(this.state.hsb)
      this.state.hex = toHex(this.state.rgb)
    } else if (typeof obj === "object" && "r" in obj) {
      this.state.hsb = toHSB(obj)
      this.state.hex = toHex(this.state.rgb)
      this.state.rgb = obj
    } else if (typeof obj === "string") {
      this.state.hsb = toHSB(obj)
      this.state.rgb = toRGB(this.state.hsb)
      this.state.hex = obj
    } else {
      console.error("wrong data for updateState")
    }
    this.state.hex = toHex(this.state.rgb)
    this.updateSvgAttributes(this.state, isVertical)
    this.setAttribute("hex", "#" + this.state.hex)
    this.dispatchEvent(
      new CustomEvent("colorChange", {
        bubbles: true,
        composed: true,
        detail: { hex: "#" + this.state.hex },
      })
    )
    return this.state
  }
  updateSvgAttributes({ hsb, hex }: State, isVertical?: boolean) {
    const coords = getHandlerCoordinates(this.pickers.hue, hsb, isVertical)
    // ;(Object.keys(coords) as (keyof typeof coords)[]).forEach(axis =>
    // this.pickers.hue.handler.setAttribute(`c${axis}`, coords[axis].toString())
    // )
    Object.keys(coords).forEach(axis =>
      this.pickers.hue.handler.setAttribute(
        `c${axis}`,
        coords[axis as keyof typeof coords].toString()
      )
    )
  }
  render() {
    this.root.innerHTML = Template.render(this.opts)
    this.pickers = {
      hue: {
        slider: this.root.getElementById("slider")!,
        handler: this.root.getElementById("sliderHandler")!,
      },
    }
    buildHueSlider(this.pickers.hue.slider, this.root.querySelector("defs")!)
  }
  connectedCallback() {
    this.render()
    this.connected = true
    // setTimeout(() => this.setAttribute("hue", "300"), 300)
  }

  static get observedAttributes() {
    return ["vertical", "hue", "width", "height"]
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (newValue === oldValue) return
    switch (name) {
      case "vertical":
        if (newValue === null) this.opts.rotation = 0
        else {
          this.opts.rotation = 90
          this.opts.marginTop = this.opts.width / 2 + "px"
          if (this.connected) this.render()
        }
        break
      case "height":
        if (newValue === null) this.opts.height = 12
        else {
          this.opts.height = parseInt(newValue)
          if (this.connected) this.render()
        }
        break
      case "width":
        if (newValue === null) this.opts.width = 200
        else {
          this.opts.width = parseInt(newValue)
          if (this.connected) this.render()
        }
        break
      case "hue":
        const hue = parseInt(newValue || "")
        if (!Number.isInteger(hue) || hue < 0 || hue > 360) return
        this.updateState(
          { ...this.state.sb, h: hue },
          this.getAttribute("vertical") !== null
        )
        break
      default:
    }
  }

  static get is() {
    return "color-slider"
  }
}

function toHSB(color: string | Rgb): Hsb {
  // RGB
  if (typeof color === "object") {
    const keys = Object.keys(color)
    if (!keys.length) return { h: 0, s: 0, b: 0 }
    const rgb = color
    const min = Math.min(rgb.r, rgb.g, rgb.b)
    const max = Math.max(rgb.r, rgb.g, rgb.b)
    const d = max - min
    const s = max == 0 ? 0 : d / max
    const b = max / 255
    let h
    switch (max) {
      case min:
        h = 0
        break
      case rgb.r:
        h = rgb.g - rgb.b + d * (rgb.g < rgb.b ? 6 : 0)
        h /= 6 * d
        break
      case rgb.g:
        h = rgb.b - rgb.r + d * 2
        h /= 6 * d
        break
      case rgb.b:
        h = rgb.r - rgb.g + d * 4
        h /= 6 * d
        break
      default:
        h = 0
    }
    const hsb = {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      b: Math.round(b * 100),
    }
    return hsb
  } else {
    // HEX
    const convert = (color: string) => {
      const s = color.match(/[\d\w]{2}/g)
      if (s) return s.map((val: string) => parseInt(val, 16))
      else return { h: 0, s: 0, b: 0 }
    }
    const converted = convert(color)
    if (Array.isArray(converted))
      return toHSB({ r: converted[0], g: converted[1], b: converted[2] })
    else return { h: 0, s: 0, b: 0 }
  }
}

function toHex(rgb: State["rgb"]) {
  return Object.keys(rgb)
    .reduce((str, key) => {
      let hex = rgb[key as keyof typeof rgb].toString(16)
      if (hex.length < 2) hex = `0${hex}`
      return str + hex
    }, "")
    .toUpperCase()
}

function toRGB(hsb: State["hsb"]) {
  const h = Number(hsb.h) / 360
  const i = Math.floor(h * 6)
  const values: Values = (() => {
    const [s, b] = [hsb.s, hsb.b].map(val => Number(val) / 100)
    const f = h * 6 - i
    const p = b * (1 - s)
    const q = b * (1 - f * s)
    const t = b * (1 - (1 - f) * s)

    return {
      0: [b, t, p],
      1: [q, b, p],
      2: [p, b, t],
      3: [p, q, b],
      4: [t, p, b],
      5: [b, p, q],
    }
  })()

  const [r, g, b] = values[i % 6].map((value: number) =>
    Math.round(value * 255)
  )
  return { r, g, b }
}

function getHandlerCoordinates(
  picker: Pickers["hue"],
  color: State["hsb"],
  isVertical?: boolean
) {
  const rect = picker.slider.getBoundingClientRect()
  let x = isVertical
    ? (color.h / 360) * rect.height
    : (color.h / 360) * rect.width
  if (x < 5) x = 5
  else if (isVertical && x > rect.height - 5) x = rect.height - 5
  else if (!isVertical && x > rect.width - 5) x = rect.width - 5
  return { x }
}

function getPickCoordinates(event: MouseEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const { width, height } = rect
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return { width, height, x, y }
}

function calcH(x: number, width: number) {
  if (x > width) return 360
  if (x < 0) return 0
  return (x / width) * 360
}

// function calcS(x: number, width: number) {
// if (x > width) return 100
// if (x < 0) return 0
// return (x / width) * 100
// }

// function calcB(y: number, height: number) {
// if (y > height) return 0
// if (y < 0) return 100
// return (1 - y / height) * 100
// }

// hue slider gradient
// ===============================================================================================

function create(
  el: string,
  attr: { "stop-color"?: string; offset?: string; id?: string }
) {
  return Object.keys(attr).reduce((layer, key) => {
    layer.setAttribute(key, attr[key as keyof typeof attr]!.toString())
    return layer
  }, document.createElementNS("http://www.w3.org/2000/svg", el))
}

function defineColorStops(
  steps = 20,
  arr: { "stop-color": string; offset: string }[] = [],
  hue = 0,
  max = 360
): { "stop-color": string; offset: string }[] {
  arr.push({
    "stop-color": `hsl(${hue}, 100%, 50%)`,
    offset: (hue / max).toFixed(2),
  })
  return hue >= max ? arr : defineColorStops(steps, arr, hue + max / steps)
}

function buildHueSlider(hue: HTMLElement, defs: SVGDefsElement) {
  const gradientId = "sliderGradient"
  const gradient = create("linearGradient", {
    id: gradientId,
  })

  defineColorStops().forEach(color =>
    gradient.appendChild(create("stop", color))
  )
  defs.appendChild(gradient)
  hue.setAttribute("fill", `url(#${gradientId})`)
}

customElements.define(ColorSlider.is, ColorSlider)

export { ColorSlider }
