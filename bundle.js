/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss(opts = {}) {
  return `:host {
  position: absolute;
  z-index: 1000;
  outline: none;
  border-radius: 45px;
  border: 0.5px solid dimgrey;
  cursor: auto;
  /* max-width: 12em; */
  /* overflow-x: auto; */
  /* height: auto; */
  /* font-family: Arial; */
  /* font-size: 1.1rem; */
  /* font-weight: bold; */
  /* text-transform: uppercase; */
  /* border: solid darkgrey 1px; */
  /* border-radius: 20px; */
}
:host(:hover) {
  border: solid dimgrey 1.5px;
  transform: scale(1.1);
}
:host(:focus-within) {
  border: solid dimgrey 1.5px;
  /* transform: scale(1.1); */
}
:host(.activated) {
  border: solid darkslategrey 2.5px !important;
}
::slotted(*) {
  border-radius: 45px;
  border: none;
  /* padding: 0.5em 0.6em 0.5em 1.1em; */
  /* margin: auto; */
  /* width: 100%; */
  /* height: 100%; */
  /* position: relative; */
  /* border-radius: inherit; */
  /* border: inherit; */
  /* background-color: inherit; */
  /* font: inherit; */
  /* text-transform: inherit; */
  /* border: none; */
  /* border-radius: inherit; */
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml(opts = {}) {
  return `<slot spellcheck="false" name="embedded"></slot>`
}
/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
const Template = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml,
  getCss,
}
//# sourceMappingURL=template.js.map

class DragAndDrop extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
    this.connected = false
    this.addEventListener("mousedown", this.dragAndDropCurrentTarget)
  }
  get activated() {
    return this.getAttribute("activated")
  }
  set activated(value) {
    value == null
      ? this.removeAttribute("activated")
      : this.setAttribute("activated", "")
  }
  // https://javascript.info/mouse-drag-and-drop
  dragAndDropCurrentTarget(event) {
    if (event.button !== 0) return
    const targetElement = event.currentTarget
    const draggingStartEvent = new CustomEvent("draggingStart", {
      bubbles: true,
      composed: true,
      detail: targetElement,
    })
    const draggingEndEvent = new CustomEvent("draggingEnd", {
      bubbles: true,
      composed: true,
      detail: targetElement,
    })
    function surroundMouseWithElement(pageX, pageY, element) {
      return [
        pageX -
          (pageXOffset + element.offsetParent.getBoundingClientRect().left) -
          element.offsetWidth / 2,
        pageY -
          (pageYOffset + element.offsetParent.getBoundingClientRect().top) -
          element.offsetHeight / 2,
      ]
    }
    function checkBoundaries(value, boundary) {
      return value <= 0 ? 0 : Math.min(boundary, value)
    }
    function moveAt(event) {
      const [calculatedLeft, calculatedTop] = surroundMouseWithElement(
        event.pageX,
        event.pageY,
        targetElement
      )
      targetElement.style.left =
        checkBoundaries(
          calculatedLeft,
          targetElement.boundary.left - targetElement.offsetWidth
        ) + "px"
      targetElement.style.top =
        checkBoundaries(
          calculatedTop,
          targetElement.boundary.top - targetElement.offsetHeight
        ) + "px"
    }
    targetElement.dispatchEvent(draggingStartEvent)
    //  move the ball on mousemove
    document.addEventListener("mousemove", moveAt)
    const cancelId = setTimeout(() => {
      targetElement.style.cursor = "grab"
    }, 100)
    // drop the ball, remove unneeded handlers
    document.addEventListener(
      "mouseup",
      event => {
        targetElement.dispatchEvent(draggingEndEvent)
        clearTimeout(cancelId)
        targetElement.style.cursor = "auto"
        document.removeEventListener("mousemove", moveAt)
      },
      { once: true }
    )
    // the browser has its own Dragâ€™nâ€™Drop for images and some other elements
    // that runs automatically and conflicts with ours
    targetElement.ondragstart = () => false
  }
  connectedCallback() {
    this.root.innerHTML = Template.render()
    this.dom = {
      slotElement: this.querySelector("*[slot='embedded']"),
    }
    this.boundary = {
      left: this.offsetParent.offsetWidth,
      top: this.offsetParent.offsetHeight,
    }
    this.connected = true
  }
  static get observedAttributes() {
    return [, "activated"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "activated":
        newValue !== null
          ? this.classList.add("activated")
          : this.classList.remove("activated")
        break
    }
  }
  static get is() {
    return "drag-and-drop"
  }
}
customElements.define(DragAndDrop.is, DragAndDrop)
//# sourceMappingURL=dragAndDrop.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$1(opts = {}) {
  return `:host {
  font-family: "Nunito";
  display: block;
  position: relative;
  background-color: whitesmoke;
  width: 100%;
  height: 100%;
}

header {
  z-index: 11;
  position: sticky;
  width: 100%;
  width: max-content;
  top: 0;
  left: 0;
}

#change-window-size {
  display: inline-block;
  font-family: "Arial";
  cursor: pointer;
  padding: 0.3em;
  border: 1px solid darkgrey;
  border-radius: 5px;
  color: inherit;
  text-decoration: none;
}
button {
}

button:hover {
  background-color: lightgrey;
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml$1(opts = {}) {
  return `
  <style>
    #help {
    margin:1em;
    background-color:inherit;
  display: inline-block;
  font-family: "Arial";
  font-size: 16px;
  cursor:pointer;
  padding: 0.3em;
  border: 1px solid darkgrey;
  border-radius: 5px;
  color:inherit;
     text-decoration:none; 
}
#help:hover {
  background-color: lightgrey;
}
  </style>
  <header>
  <button id="help">Help</button>
  <any-file-reader
    reading-method="readAsText"
    label="Import Markdown"
    style="position:relative;margin:1em;"
  ></any-file-reader>
  <any-file-downloader
    file-type="text/markdown"
    filename="${new Date().toISOString().slice(0, 19)}.md"
    style="position:relative;margin:1em;"
    >Export Markdown</any-file-downloader
  >
  <div id="change-window-size" style="position:relative;margin:1em;">
    <button id="decrease-window-size">-</button>
    <button id="increase-window-size">+</button>
  </div>
  <color-slider style="position:relative;margin:1em;"></color-slider>
</header>
<styled-curves></styled-curves>
<modal-window> </modal-window>
<template id="drag-and-drop">
  <drag-and-drop tabindex="0">
    <dual-element slot="embedded"></dual-element>
  </drag-and-drop>
</template>
<template id="help-text">
  <div slot="modal-content" >
    <h2 style="text-align:center">Help</h2>
    <ul>
      <li>
        To add a child node just click on a parent node and make a double click
        on free space.
      </li>
      <li>
        Click on the button inside of a node to get options for this specific
        node, including adding subtext (e.g. additional information) and styling
        for the node and its curve.
      </li>
      <li>
        You can remove nodes with the middle mouse button.
      </li>
      <li>Rename the node by double clicking on the text of a node</li>
      <li>
        You can drag nodes to move them.
      </li>
      <li>
        With the right mouse click on a node you can make a special curve (link)
        between two nodes.
      </li>
      <li>
        At the top of the page or options to import and export Markdown
        documents.
      </li>
    </ul>
  </div>
</template>
<template id="setting-options">
  <setting-options slot="modal-content" buttons="aliceblue"></setting-options>
</template>
<template id="subtext-template">
  <div slot="modal-content">
    <textarea></textarea>
    <button id="save-subtext">Save</button>
    <button id="cancel-subtext">Cancel</button>
    <style>
      #save-subtext,
      #cancel-subtext {
        margin: 1em;
        width: 6em;
        height: 2em;
        background-color: aliceblue;
        cursor: pointer;
      }
      #save-subtext:hover,
      #cancel-subtext:hover {
        background-color: lavender;
      }
    </style>
  </div>
</template>
`
}
/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
const Template$1 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml: getHtml$1,
  getCss: getCss$1,
}
//# sourceMappingURL=template.js.map

function getRadian(degree) {
  return (Math.PI * degree) / 180
}
function getX(r, radian, Cx = 0) {
  return Cx + r * Math.cos(radian)
}
function getY(r, radian, Cy = 0) {
  return Cy + r * Math.sin(radian)
}
function getEqualParts(amount) {
  const range = 360 / amount
  return Array.from(Array(amount), (e, i) => i * range)
}
function getCirclePoints(amount, radius, [Cx, Cy] = [0, 0]) {
  return getEqualParts(amount).map(degree => [
    Math.round(getX(radius, getRadian(degree), Cx)),
    Math.round(getY(radius, getRadian(degree), Cy)),
  ])
}
//# sourceMappingURL=circleMath.js.map

// const mdString = `# How to Learn
function makeFlatMarkdownHeaderBlocks(markdown) {
  function findparentHeader(earlierResults, prevHeader) {
    var _a
    const parentHeader =
      (_a = [...earlierResults]
        .reverse()
        .find(el => el.depth < prevHeader[1].length)) === null || _a === void 0
        ? void 0
        : _a.header
    return parentHeader ? parentHeader : null
  }
  const result = []
  const heading = /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/gm
  const findings = [...markdown.matchAll(heading)]
  let prevHeader = []
  const text = []
  for (const match of findings) {
    if (prevHeader.length === 0) {
      prevHeader = match
    } else {
      const start = markdown.indexOf(prevHeader[0]) + prevHeader[0].length
      const end = markdown.indexOf(match[0])
      text.push(markdown.slice(start, end))
      result.push({
        header: prevHeader[2],
        text: text[text.length - 1],
        depth: prevHeader[1].length,
        parentHeader: findparentHeader(result, prevHeader),
        childrenTokens: [],
      })
      prevHeader = match
      if (result.length === findings.length - 1) {
        result.push({
          header: match[2],
          text: markdown.slice(markdown.indexOf(match[0]) + match[0].length),
          depth: match[1].length,
          parentHeader: findparentHeader(result, prevHeader),
          childrenTokens: [],
        })
      }
    }
  }
  return result
}
function makeDeepMarkdownHeaderBlocks(mdString) {
  const flatTokenList = makeFlatMarkdownHeaderBlocks(mdString)
  for (const token of flatTokenList) {
    const children = flatTokenList.filter(t => t.parentHeader === token.header)
    token.childrenTokens = children
  }
  return flatTokenList.filter(t => t.depth === flatTokenList[0].depth)
}
//# sourceMappingURL=markdownBlocks.js.map

function convertDashToCamel(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase()
  })
}
/*
 * Short version is:
 *   <div
 *     contenteditable="true"
 *     onInput="e => console.log('Text inside div', e.currentTarget.textContent)"
 *   >
 *     Text inside div
 *   </div>
 */
function makeElementEditableSanely(element, callback) {
  function makeEditable(event) {
    element.contentEditable = "true"
    element.blur()
    element.focus()
    document.execCommand("selectAll", false, undefined)
    event.preventDefault()
    event.stopPropagation()
    const resetContentEditable = event => {
      element.contentEditable = "false"
      element.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("click", handleClickContentEditable)
      if (typeof callback === "function") callback(element)
    }
    const handleKeyDown = event => {
      if (event.key === "Tab") {
        resetContentEditable()
      }
    }
    const handleClickContentEditable = event => {
      if (event.clientX === 0 && event.clientY === 0) {
        event.preventDefault()
        event.stopPropagation()
      } else resetContentEditable()
    }
    element.addEventListener("keydown", handleKeyDown)
    document.addEventListener("click", handleClickContentEditable)
  }
  element.addEventListener("dblclick", makeEditable)
  element.addEventListener("keydown", event => {
    if (event.key === "Enter") makeEditable(event)
  })
}
function findElementInEventPath(event, searchTag) {
  function predicate(eventTarget, searchTag) {
    if (eventTarget instanceof HTMLElement)
      return eventTarget.tagName === searchTag
    else return false
  }
  const foundElement = event
    .composedPath()
    .find(eventTarget => predicate(eventTarget, searchTag))
  return foundElement ? foundElement : null
}
function loadCss(path, target = document.head) {
  return new Promise(function (resolve, reject) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = path
    target.appendChild(link)
    link.onload = () => resolve()
  })
}
function changeCss(element, cssMap) {
  if (element instanceof HTMLElement)
    cssMap.forEach(([prop, value]) => (element.style[prop] = value))
  else console.error(`element is not of type HTMLElement`)
}
//# sourceMappingURL=utils.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$2(opts = {}) {
  return `:host {
  display: inline-block;
  transform: rotate(${opts.rotation}deg);
  margin-top: ${opts.marginTop};
}
svg circle {
  cursor: pointer;
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml$2(opts = {}) {
  return `<svg width="${opts.width}" height="${opts.height}">
  <defs>
    <linearGradient id="pickerHue">
      <stop offset="0" stop-color="#fff" stop-opacity="1" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect
    id="slider"
    width="${opts.width}"
    height="${opts.height - 1}"
    y="0"
    rx="5"
    ry="${opts.height / 3 + 1}"
  />
  <circle
    id="sliderHandler"
    r="${opts.height / 3}"
    cx="5"
    cy="${opts.height / 3 + 1}"
    fill="none"
    stroke="#fff"
    stroke-width="2"
  />
</svg>`
}
/**
 * @type { {
 * render: (opts: { rotation: string | number }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts: { rotation: string | number }) => string
 * } }
 */
const Template$2 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml: getHtml$2,
  getCss: getCss$2,
}
//# sourceMappingURL=template.js.map

class ColorSlider extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
    this.pickers = {}
    this.state = {
      sb: { s: 30, b: 95 },
      hsb: { h: 0, s: 30, b: 95 },
      rgb: { r: 255, g: 255, b: 255 },
      hex: "#FFFFFF",
    }
    this.opts = { rotation: 0, marginTop: "0", width: 200, height: 12 }
    this.connected = false
    const onDrag = callback => {
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
        this.pickHue(this.getAttribute("vertical") !== null, event)
        onDrag(this.pickHue.bind(this, this.getAttribute("vertical") !== null))
      }
    })
  }
  get hex() {
    return "#" + this.state.hex
  }
  pickHue(isVertical, event) {
    const { x, y, width, height } = getPickCoordinates(
      event,
      this.pickers.hue.slider
    )
    this.updateState(
      Object.assign(Object.assign({}, this.state.sb), {
        h: Math.round(isVertical ? calcH(y, height) : calcH(x, width)),
      }),
      isVertical
    )
    event.preventDefault()
  }
  updateState(obj, isVertical) {
    if (typeof obj === "object" && "h" in obj) {
      // make extreme colors on extreme points on the slider
      if (obj.h > 353) return this.updateState({ r: 84, g: 56, b: 58 })
      if (obj.h < 7) return this.updateState("#FFFFFF")
      this.state.hsb = Object.assign(Object.assign({}, this.state.hsb), obj)
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
  updateSvgAttributes({ hsb, hex }, isVertical) {
    const coords = getHandlerCoordinates(this.pickers.hue, hsb, isVertical)
    // ;(Object.keys(coords) as (keyof typeof coords)[]).forEach(axis =>
    // this.pickers.hue.handler.setAttribute(`c${axis}`, coords[axis].toString())
    // )
    Object.keys(coords).forEach(axis =>
      this.pickers.hue.handler.setAttribute(`c${axis}`, coords[axis].toString())
    )
  }
  render() {
    this.root.innerHTML = Template$2.render(this.opts)
    this.pickers = {
      hue: {
        slider: this.root.getElementById("slider"),
        handler: this.root.getElementById("sliderHandler"),
      },
    }
    buildHueSlider(this.pickers.hue.slider, this.root.querySelector("defs"))
  }
  connectedCallback() {
    this.render()
    this.connected = true
    // setTimeout(() => this.setAttribute("hue", "300"), 300)
  }
  static get observedAttributes() {
    return ["vertical", "hue", "width", "height"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
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
          Object.assign(Object.assign({}, this.state.sb), { h: hue }),
          this.getAttribute("vertical") !== null
        )
        break
    }
  }
  static get is() {
    return "color-slider"
  }
}
function toHSB(color) {
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
    const convert = color => {
      const s = color.match(/[\d\w]{2}/g)
      if (s) return s.map(val => parseInt(val, 16))
      else return { h: 0, s: 0, b: 0 }
    }
    const converted = convert(color)
    if (Array.isArray(converted))
      return toHSB({ r: converted[0], g: converted[1], b: converted[2] })
    else return { h: 0, s: 0, b: 0 }
  }
}
function toHex(rgb) {
  return Object.keys(rgb)
    .reduce((str, key) => {
      let hex = rgb[key].toString(16)
      if (hex.length < 2) hex = `0${hex}`
      return str + hex
    }, "")
    .toUpperCase()
}
function toRGB(hsb) {
  const h = Number(hsb.h) / 360
  const i = Math.floor(h * 6)
  const values = (() => {
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
  const [r, g, b] = values[i % 6].map(value => Math.round(value * 255))
  return { r, g, b }
}
function getHandlerCoordinates(picker, color, isVertical) {
  const rect = picker.slider.getBoundingClientRect()
  let x = isVertical
    ? (color.h / 360) * rect.height
    : (color.h / 360) * rect.width
  if (x < 5) x = 5
  else if (isVertical && x > rect.height - 5) x = rect.height - 5
  else if (!isVertical && x > rect.width - 5) x = rect.width - 5
  return { x }
}
function getPickCoordinates(event, el) {
  const rect = el.getBoundingClientRect()
  const { width, height } = rect
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return { width, height, x, y }
}
function calcH(x, width) {
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
function create(el, attr) {
  return Object.keys(attr).reduce((layer, key) => {
    layer.setAttribute(key, attr[key].toString())
    return layer
  }, document.createElementNS("http://www.w3.org/2000/svg", el))
}
function defineColorStops(steps = 20, arr = [], hue = 0, max = 360) {
  arr.push({
    "stop-color": `hsl(${hue}, 100%, 50%)`,
    offset: (hue / max).toFixed(2),
  })
  return hue >= max ? arr : defineColorStops(steps, arr, hue + max / steps)
}
function buildHueSlider(hue, defs) {
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
//# sourceMappingURL=colorSlider.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$3(opts = {}) {
  return `:host{
display: block;
    position : relative;
    background-color : inherit;
    height : 100%;
    width :100%;
  }`
}
/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
const Template$3 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>`
  },
  getCss: getCss$3,
}
//# sourceMappingURL=template.js.map

class StyledCurves extends HTMLElement {
  constructor() {
    super(...arguments)
    this.root = this.attachShadow({ mode: "open" })
  }
  connectedCallback() {
    this.ctx = makeCanvasContext(
      this.root.appendChild(document.createElement("canvas"))
    )
    this.root.children[0].innerHTML = Template$3.render()
  }
  drawCurves(input) {
    if (input == null)
      return this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)
    else
      drawCubicBezierCurve(
        this.ctx,
        modifyPointsForGradientShape(input),
        input.curvedColor
      )
  }
  get size() {
    return this.getAttribute("size")
  }
  set size(value) {
    value === null
      ? this.removeAttribute("size")
      : this.setAttribute("size", value)
  }
  static get observedAttributes() {
    return ["size", "color"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue || typeof newValue !== "string") return
    switch (name) {
      case "size":
        const [width, height] = newValue.split(":")
        this.ctx = makeCanvasContext(this.root.querySelector("canvas"), {
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
function makeCanvasContext(canvas, options, ctxType = "2d") {
  if (options === null || options === void 0 ? void 0 : options.width)
    canvas.width = options.width
  if (options === null || options === void 0 ? void 0 : options.height)
    canvas.height = options.height
  const ctx = canvas.getContext(ctxType)
  ctx.width = canvas.width
  ctx.height = canvas.height
  if (options === null || options === void 0 ? void 0 : options.fillStyle)
    ctx.fillStyle = options.fillStyle
  if (options === null || options === void 0 ? void 0 : options.strokeStyle)
    ctx.strokeStyle = options.strokeStyle
  if (options === null || options === void 0 ? void 0 : options.lineWidth)
    ctx.lineWidth = options.lineWidth
  else ctx.lineWidth = 4
  if (options === null || options === void 0 ? void 0 : options.lineJoin)
    ctx.lineJoin = options.lineJoin
  else ctx.lineJoin = "round"
  return ctx
}
function drawCubicBezierCurve(ctx, [p1, p2, p3], color) {
  const unit = (a, b, u) => (b - a) * u + a
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
}) {
  function calculateCurveWidth(level) {
    return 48 - 8 * level < 0 ? 0 : 48 - 8 * level
  }
  function centerStartingPoint(x, y) {
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
//# sourceMappingURL=styledCurves.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$4(opts = {}) {
  return `:host {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  width: 12em;
  height: 3em;
  border: 0.5px solid darkslategrey;
  background: linear-gradient(
    to right,
    slategrey calc(25% - 4.3px),
    transparent 0%
  );
}

div {
  margin: 0;
  padding: 0.3em;
  line-height: 1.3;
  max-height: 100%;
  width: 75%;
  flex: 3 3 30px;
  overflow-wrap: anywhere;
  text-align: center;
  display: inline-block;
}

button {
  display: inline-block;
  width: 25%;
  flex: 1 1 10px;
  height: 100%;
  background-color: slategrey;
  cursor: pointer;
  outline: none;
  border: none;
}

button:hover {
  background-color: darkslategrey;
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml$3(opts = {}) {
  return `<button aria-label="Settings"></button>
<div spellcheck="false">${opts.content}</div>`
}
/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
const Template$4 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml: getHtml$3,
  getCss: getCss$4,
}
//# sourceMappingURL=template.js.map

class DualElement extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
    this.opts = { content: "" }
    this.connected = false
  }
  connectedCallback() {
    this.root.innerHTML = Template$4.render(this.opts)
    this.connected = true
  }
  static get observedAttributes() {
    return ["content"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    switch (name) {
      case "content":
        this.opts = Object.assign(Object.assign({}, this.opts), {
          [convertDashToCamel(name)]: newValue || "",
        })
        if (this.connected)
          this.root.querySelector("div").textContent = this.opts.content
        break
    }
  }
  static get is() {
    return "dual-element"
  }
}
customElements.define(DualElement.is, DualElement)
//# sourceMappingURL=dualElement.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$5(opts = {}) {
  return `:host {
  display: inline-block;
  font-family: "Arial";
}
input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap; /* 1 */
  clip-path: inset(50%);
  border: 0;
}

label {
  padding: 0.3em;
  border: 1px solid darkgrey;
  border-radius: 5px;
  cursor: pointer;
}

label:hover {
  background-color: lightgrey;
}

label:focus {
  outline: auto 1px rgb(77, 144, 254);
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml$4(opts = {}) {
  return `<label tabindex="0" for="file-upload">${opts.label || ""}</label>
<input tabindex="-1" type="file" name="file-data" id="file-upload" />`
}
/**
 * @type { {
 * render: (opts?: { label: string  }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { label: string  }) => string
 * } }
 */
const Template$5 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml: getHtml$4,
  getCss: getCss$5,
}
//# sourceMappingURL=template.js.map

var __await =
  (undefined && undefined.__await) ||
  function (v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v)
  }
var __asyncGenerator =
  (undefined && undefined.__asyncGenerator) ||
  function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.")
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = []
    return (
      (i = {}),
      verb("next"),
      verb("throw"),
      verb("return"),
      (i[Symbol.asyncIterator] = function () {
        return this
      }),
      i
    )
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v)
          })
        }
    }
    function resume(n, v) {
      try {
        step(g[n](v))
      } catch (e) {
        settle(q[0][3], e)
      }
    }
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r)
    }
    function fulfill(value) {
      resume("next", value)
    }
    function reject(value) {
      resume("throw", value)
    }
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1])
    }
  }
const readingMethods = new Set([
  "readAsArrayBuffer",
  "readAsBinaryString",
  "readAsDataURL",
  "readAsText",
])
class AnyFileReader extends HTMLElement {
  constructor() {
    super(...arguments)
    this.root = this.attachShadow({ mode: "open" })
    this.opts = { label: "" }
    this.fileDataGenerator = function (inputElement, readingMethod, fileType) {
      return __asyncGenerator(this, arguments, function* () {
        while (true) {
          yield yield __await(
            yield __await(
              new Promise((resolve, reject) => {
                function handleFileSelection(event) {
                  const files = inputElement.files
                  if (
                    !(files === null || files === void 0
                      ? void 0
                      : files.length)
                  )
                    return reject("No file!")
                  const file = files.item(0)
                  if (
                    typeof fileType === "string" &&
                    !validFileType(file, fileType)
                  )
                    reject("A file with wrong filetype was selected")
                  return read(file, readingMethod)
                  function read(file, readingMethod) {
                    const reader = new FileReader()
                    reader[readingMethod](file)
                    return (reader.onload = event => {
                      resolve(reader.result)
                    })
                  }
                }
                function validFileType(file, fileType) {
                  return fileType
                    .split(",")
                    .map(s => s.trim())
                    .includes(file.type)
                }
                inputElement.addEventListener(
                  "change",
                  event => handleFileSelection(),
                  { once: true }
                )
              })
            )
          )
        }
      })
    }
  }
  connectedCallback() {
    this.root.innerHTML = Template$5.render(this.opts)
    this.dom = {
      input: this.root.querySelector("#file-upload"),
      label: this.root.querySelector("label"),
    }
    this.waitForFile = this.fileDataGenerator(
      this.dom.input,
      this.readingMethod,
      this.fileType
    )
    // click on 'input' element when pressing enter on focused label:
    this.dom.label.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        this.dom.input.click()
      }
    })
  }
  static get observedAttributes() {
    return ["reading-method", "file-type", "label"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    switch (name) {
      case "reading-method":
        if (readingMethods.has(newValue)) return
        else
          return console.error(
            "The custom element 'any-file-reader' needs a valid 'reading-method' attribute: " +
              JSON.stringify([...readingMethods])
          )
      case "file-type":
        // if (newValue === null) return this.removeAttribute(name)
        break
      case "label":
        this.opts = Object.assign(Object.assign({}, this.opts), {
          [name]: newValue || "",
        })
        this.root.innerHTML = Template$5.render(this.opts)
        break
    }
  }
  get readingMethod() {
    return this.getAttribute("reading-method")
  }
  set readingMethod(value) {
    this.setAttribute("reading-method", value)
  }
  get fileType() {
    return this.getAttribute("file-type")
  }
  set fileType(value) {
    if (value === null) this.removeAttribute("file-type")
    else this.setAttribute("file-type", value)
  }
  static get is() {
    return "any-file-reader"
  }
}
customElements.define(AnyFileReader.is, AnyFileReader)
//# sourceMappingURL=anyFileReader.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$6(opts = {}) {
  return `:host {
  display: inline-block;
  font-family: "Arial";
  cursor:pointer;
}
a {
  padding: 0.3em;
  border: 1px solid darkgrey;
  border-radius: 5px;
  color:inherit;
     text-decoration:none; 
}

a:hover {
  background-color: lightgrey;
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml$5(opts = {}) {
  return `<a id="download-anchor" download="${opts.filename}">${opts.content}</a>`
}
/**
 * @type { {
 * render: (opts?: { filename?: string, fileType?:string, content?:string  }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any   }) => string
 * } }
 */
const Template$6 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml: getHtml$5,
  getCss: getCss$6,
}
//# sourceMappingURL=template.js.map

var __awaiter =
  (undefined && undefined.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
function waitForEvent(eventTarget, eventName) {
  return new Promise(resolve => {
    function listener(event) {
      resolve(event)
      eventTarget.removeEventListener(eventName, listener)
    }
    eventTarget.addEventListener(eventName, listener)
  })
}
class AnyFileDownloader extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
    this.opts = { fileType: "", filename: "", content: "" }
    this.makeDownload = this._makeDownload.bind(this)
  }
  connectedCallback() {
    this.opts.content = this.textContent || ""
    this.root.innerHTML = Template$6.render(this.opts)
    this.dom = {
      anchor: this.root.querySelector("#download-anchor"),
    }
  }
  _makeDownload(str, fileType = this.getAttribute("file-type") || "") {
    return __awaiter(this, void 0, void 0, function* () {
      function setBlob(anchor, str, fileType) {
        const blob = new Blob([str], { type: fileType })
        const url = URL.createObjectURL(blob)
        anchor.setAttribute("href", url)
        return blob
      }
      let realString = ""
      if (typeof str === "string") {
        realString = str
        setBlob(this.dom.anchor, str, fileType)
      } else {
        const event = yield waitForEvent(this.dom.anchor, "click")
        realString = str()
        setBlob(this.dom.anchor, realString, fileType)
      }
      return realString
    })
  }
  static get observedAttributes() {
    return ["fileType", "filename"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    this.opts = Object.assign(Object.assign({}, this.opts), {
      [name]: newValue,
    })
  }
  get fileType() {
    return this.getAttribute("file-type")
  }
  set fileType(value) {
    if (value === null) this.removeAttribute("file-type")
    else this.setAttribute("file-type", value)
  }
  get filename() {
    return this.getAttribute("filename")
  }
  set filename(value) {
    if (value === null) this.removeAttribute("filename")
    else this.setAttribute("filename", value)
  }
  static get is() {
    return "any-file-downloader"
  }
}
customElements.define(AnyFileDownloader.is, AnyFileDownloader)
//# sourceMappingURL=anyFileDownloader.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$7(opts = {}) {
  return `:host{
display:block;
}
.modal {
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  bottom:0;
  right:0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.2);
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}
.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
.modal-body {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: ${opts.padding || "6em"} ;
  width: ${opts.width || "auto"};
  height: ${opts.height || "auto"};
  max-height:100%;
  max-width:100%;
  border-radius: 0.5rem;
  overflow:auto;
}
.modal-close {
position: absolute;
top: 0.3em;
right: 0.3em;
padding: 0.3em;
cursor: pointer;
font-size: 2em;
height: 0.8em;
width: 0.8em;
text-indent: 20em;
overflow: hidden;
border: 0;
background-color:inherit;
}
.modal-close::after {
position: absolute;
line-height: 0.5;
top: 0.14em;
left: 0.12em;
text-indent: 0;
content: "\\00D7";
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml$6(opts = {}) {
  return `<div class="modal">
  <div tabindex="0" class="modal-body">
    <button class="modal-close">close</button>
    <slot name="modal-content"></slot>
  </div>
</div>`
}
/**
 * @type { {
 * render: (opts?: { padding?:string, width?:string }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { padding?:string, width?:string }) => string
 * } }
 */
const Template$7 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml: getHtml$6,
  getCss: getCss$7,
}
//# sourceMappingURL=template.js.map

class ModalWindow extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
  }
  connectedCallback() {
    this.root.innerHTML = Template$7.render({ padding: "3em" })
    this.dom = {
      modal: this.root.querySelector(".modal"),
      modalClose: this.root.querySelector(".modal-close"),
    }
  }
  get showModal() {
    return this.hasAttribute("show-modal") ? true : false
  }
  set showModal(value) {
    value === false
      ? this.dispatchEvent(new CustomEvent("modalClose"))
      : this.showModalAndWaitForClose()
  }
  showModalAndWaitForClose() {
    return new Promise(resolve => {
      const toggleModal = () => {
        if (!this.dom.modal.classList.contains("show-modal")) {
          return this.setAttribute("show-modal", "")
        } else {
          this.removeAttribute("show-modal")
          this.dom.modalClose.removeEventListener("click", toggleModal)
          this.removeEventListener("modalClose", toggleModal)
          this.dom.modal.removeEventListener("click", handleClickOnModalWindow)
          resolve()
        }
      }
      const handleClickOnModalWindow = event => {
        if (event.target === this.dom.modal) {
          toggleModal()
        }
      }
      this.dom.modalClose.addEventListener("click", toggleModal)
      this.addEventListener("modalClose", toggleModal)
      this.dom.modal.addEventListener("click", handleClickOnModalWindow)
      toggleModal()
    })
  }
  static get observedAttributes() {
    return ["show-modal"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    switch (name) {
      case "show-modal":
        if (newValue === null) this.dom.modal.classList.remove("show-modal")
        else {
          this.dom.modal.classList.add("show-modal")
          this.root.querySelector(".modal-body").focus()
        }
        break
    }
  }
  static get is() {
    return "modal-window"
  }
}
customElements.define(ModalWindow.is, ModalWindow)
//# sourceMappingURL=modalWindow.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss$8(opts = {}) {
  return `:host {
  display: inline-block;
  border: solid lightgrey 1px;
  padding: 1em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.text-display {
  width: 100%;
  margin-bottom: 2em;
  text-align: center;
}
#show {
  width: 7em;
  height: 4em;
}

h3 {
  text-align: center;
  margin-top: 0;
}
p {
  margin: 0.2em 0 1em;
  font-size: 0.75rem;
  font-style: italic;
  line-height: 1;
}
button {
  cursor: pointer;
}
button:hover {
  background-color: lavender;
}
.leave {
  margin-top: 2em;
  display: flex;
  align-content: space-around;
}
.leave button {
  flex: 1 1 0px;
}
#save-settings {
  margin-right: 0.5em;
}
.button-bg-color {
  background-color: aliceblue;
}`
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml$7(opts = {}) {
  return `<div>
  <h3>Display or Edit Subtext</h3>
  <div class="text-display">
    <button id="show" class="button-bg-color">Edit</button>
  </div>
</div>
<div>
  <h3>Set the Colors</h3>
  <div>
    <color-slider class="node-color"></color-slider>
    <p>Node Color</p>
  </div>
  <div>
    <color-slider class="curve-color"></color-slider>
    <p>Curve Color</p>
  </div>
</div>
<div class="leave">
  <button id="save-settings" class="button-bg-color">Ok</button>
  <button id="cancel-settings" class="button-bg-color">Cancel</button>
</div>`
}
/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
const Template$8 = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml: getHtml$7,
  getCss: getCss$8,
}
//# sourceMappingURL=template.js.map

class SettingOptions extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })
    this.opts = {}
  }
  connectedCallback() {
    this.root.innerHTML = Template$8.render()
  }
  static get observedAttributes() {
    return ["buttons"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    switch (name) {
      case "buttons":
        if (typeof newValue === "string") this.opts.buttons = newValue
        break
    }
  }
  static get is() {
    return "setting-options"
  }
}
customElements.define(SettingOptions.is, SettingOptions)
//# sourceMappingURL=settingOptions.js.map

class LightClone {
  constructor(source) {
    this.depth = 5
    this.curveColor = "slateblue"
    this.parentDnd = null
    this.dndChildren = []
    this.mdText = ""
    this.content = ""
    this.source = source
    this.offsetWidth = this.source.offsetWidth
    this.offsetHeight = this.source.offsetHeight
    this.left = () => this.source.style.left
    this.top = () => this.source.style.top
    this.boundary = { left: source.boundary.left, top: source.boundary.top }
  }
}
class MappingElement extends HTMLElement {
  constructor() {
    super()
    this.clickData = { detail: 0, startX: 0, startY: 0 }
    this.dndElements = []
    this.activeDnd = null
    this.root = this.attachShadow({ mode: "open" })
    this.addEventListener("dblclick", event => {
      if (findElementInEventPath(event, "STYLED-CURVES"))
        this.addDndElement(
          this.dom.dndTemplate,
          this.getMousePositionRelativeToElement(event)
        )
    })
    this.addEventListener("mousedown", event => {
      this.preventAutomaticTextSelectionOnDoubleClick(event)
      this.storeMouseClickData(event)
      if (event.button === 2) this.drawSpecialCurve(event)
    })
    this.addEventListener("mouseup", event => {
      if (event.button === 1) this.removeElement(this.root.activeElement)
      else this.handleActiveDndElement(event, this.root.activeElement)
    })
    this.addEventListener("wheel", this.zoomAndAdapt)
    this.addEventListener("draggingStart", this.drawOnEveryAnimationFrame)
    window.addEventListener("resize", () => this.draw())
    this.addEventListener("click", event => {
      this.unzoom(event)
    })
    this.addEventListener("colorChange", this.changeBgColor)
  }
  connectedCallback() {
    this.root.innerHTML = Template$1.render()
    this.dom = {
      styledCurves: this.root.querySelector("styled-curves"),
      anyFileReader: this.root.querySelector("any-file-reader"),
      anyFileDownloader: this.root.querySelector("any-file-downloader"),
      colorSlider: this.root.querySelector("color-slider"),
      modalWindow: this.root.querySelector("modal-window"),
      dndTemplate: this.root.querySelector("#drag-and-drop"),
      helpTemplate: this.root.querySelector("#help-text"),
      settingOptionsTemplate: this.root.querySelector("#setting-options"),
      subtextTemplate: this.root.querySelector("#subtext-template"),
    }
    this.addDndElement(this.dom.dndTemplate, [
      this.offsetWidth / 2,
      this.offsetHeight / 2,
    ])
    this.dom.modalWindow.shadowRoot.querySelector(
      ".modal-body"
    ).style.backgroundColor = "gainsboro"
    this.dom.anyFileReader.waitForFile.next().then(markdownObj => {
      this.removeElement(this.dndElements[0])
      this.style.width = "3000px"
      this.style.height = "3000px"
      this.addDndElement(this.dom.dndTemplate, [
        this.offsetWidth / 2,
        this.offsetHeight / 2,
      ])
      setTimeout(() =>
        this.makeTheDrawing(
          makeDeepMarkdownHeaderBlocks(markdownObj.value),
          700,
          [1500, 1500]
        )
      )
    })

    this.root
      .querySelector("#help")
      .addEventListener("click", () => this.showHelp())

    loadCss(
      "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css",
      this.dom.modalWindow
    )
    loadCss(
      "https://unpkg.com/easymde/dist/easymde.min.css",
      this.dom.modalWindow
    )
    loadCss("https://fonts.googleapis.com/css?family=Nunito&display=swap", this)
    this.dom.anyFileDownloader.makeDownload(
      this.makeMarkdownExportString.bind(this)
    )
    this.root
      .querySelector("#increase-window-size")
      .addEventListener("click", () => {
        const compStyles = window.getComputedStyle(this)
        this.style.width = `${
          parseInt(compStyles.getPropertyValue("width")) + 200
        }px`
        this.style.height = `${
          parseInt(compStyles.getPropertyValue("height")) + 200
        }px`
      })
    this.root
      .querySelector("#decrease-window-size")
      .addEventListener("click", () => {
        const compStyles = window.getComputedStyle(this)
        this.style.width = `${
          parseInt(compStyles.getPropertyValue("width")) - 200
        }px`
        this.style.height = `${
          parseInt(compStyles.getPropertyValue("height")) - 200
        }px`
      })
  }
  showHelp() {
    this.dom.modalWindow.append(this.dom.helpTemplate.content.cloneNode(true))
    this.dom.modalWindow.showModalAndWaitForClose().then(() => {
      setTimeout(
        () =>
          this.dom.modalWindow.removeChild(
            this.dom.modalWindow.querySelector("*[slot='modal-content']")
          ),
        400
      )
    })
  }

  makeTheDrawing(mdBlocks, distance, position) {
    getCirclePoints(mdBlocks.length, distance, position).map((position, i) => {
      this.addDndElement(this.dom.dndTemplate, position, mdBlocks[i])
      if (mdBlocks[i].childrenTokens.length !== 0)
        this.makeTheDrawing(
          mdBlocks[i].childrenTokens,
          mdBlocks[i].parentHeader === null ? distance - 350 : distance - 50,
          position
        )
    })
  }
  makeMarkdownExportString() {
    function isPresent(t) {
      return t !== undefined && t !== null
    }
    const presentDndElements = this.dndElements.filter(isPresent)
    const highestDepth = presentDndElements.reduce(
      (acc, dnd) => (dnd.depth > acc ? dnd.depth : acc),
      0
    )
    const sortedDndsByDepth = presentDndElements.reduce((acc, dnd) => {
      if (typeof dnd.depth === "number")
        acc[dnd.depth] ? acc[dnd.depth].push(dnd) : (acc[dnd.depth] = [dnd])
      return acc
    }, Array(highestDepth))
    const r = [...sortedDndsByDepth].reverse().map(depthBatch =>
      depthBatch.map(dnd => {
        const index = presentDndElements.findIndex(dndFromAll => {
          return dnd.parentDnd === dndFromAll
        })
        if (index >= 0 && dnd.parentDnd) {
          presentDndElements[index].dndChildren.push(dnd)
          return dnd
        }
      })
    )
    function stringifyDragAndDrop(dnd) {
      return (
        "#".repeat(dnd.depth) +
        " " +
        dnd.content +
        "\n\n" +
        (dnd.mdText ? dnd.mdText + "\n\n" : "")
      )
    }
    function stringifyDragAndDropsRecursively(dnd) {
      return dnd.dndChildren.length > 0
        ? !dnd.depth
          ? dnd.dndChildren
              .map(dnd => stringifyDragAndDropsRecursively(dnd))
              .reduce((acc, el) => acc + el, "")
          : stringifyDragAndDrop(dnd) +
            dnd.dndChildren
              .map(dnd => stringifyDragAndDropsRecursively(dnd))
              .reduce((acc, el) => acc + el, "")
        : stringifyDragAndDrop(dnd)
    }
    return stringifyDragAndDropsRecursively({
      dndChildren: presentDndElements.filter(dnd => dnd.depth === 1),
    })
  }
  addDndElement(dndTemplate, [x, y], token = null) {
    const isOnlyDnd = this.dndElements.length === 0
    changeCss(dndTemplate.content.querySelector("drag-and-drop"), [
      ["backgroundColor", isOnlyDnd ? "green" : "white"],
      ["fontSize", isOnlyDnd ? "0.9em" : "0.9em"],
      ["text-transform", isOnlyDnd ? "uppercase" : "capitalize"],
      ["left", x + "px"],
      ["top", y + "px"],
    ])
    this.root.appendChild(dndTemplate.content.cloneNode(true))
    const dndElement = this.root.lastElementChild
    const dualElement = dndElement.querySelector("dual-element")
    dndElement.content = isOnlyDnd
      ? "root"
      : (token === null || token === void 0 ? void 0 : token.header) ||
        `node#${this.dndElements.length}`
    dualElement.setAttribute("content", dndElement.content)
    makeElementEditableSanely(
      dualElement.shadowRoot.querySelector("div"),
      element => (dndElement.content = element.textContent)
    )
    dndElement.mdText =
      (token === null || token === void 0 ? void 0 : token.text) || ""
    dndElement.boundary = { left: this.offsetWidth, top: this.offsetHeight }
    dndElement.dndChildren = []
    dndElement.parentDnd = token
      ? token.parentHeader
        ? this.dndElements.find(dnd => dnd.content === token.parentHeader)
        : this.dndElements[0]
      : this.activeDnd
    const firstDndElement = this.dndElements[0]
    if (!dndElement.parentDnd && !(firstDndElement instanceof LightClone)) {
      dndElement.parentDnd = firstDndElement
      this.activeDnd = firstDndElement || dndElement
      this.activeDnd.activated = ""
    }
    dndElement.depth = dndElement.parentDnd
      ? dndElement.parentDnd.depth + 1 <= 6
        ? dndElement.parentDnd.depth + 1
        : 6
      : 0
    dndElement
      .querySelector("dual-element")
      .shadowRoot.querySelector("button")
      .addEventListener("click", this.handleSettingOptions.bind(this))
    this.dndElements.push(dndElement)
    return this.draw()
  }
  draw() {
    this.dom.styledCurves.size = `${this.offsetWidth}:${this.offsetHeight}`
    return (this.dndElements = this.dndElements
      .map((dnd, i, array) => {
        if (i === 0) {
          this.dom.styledCurves.drawCurves(null)
          return dnd
        } else if (dnd == null) {
          return null
        } else if (array.indexOf(dnd.parentDnd) === -1) {
          if (dnd instanceof HTMLElement) {
            this.root.removeChild(dnd)
            this.removeCollectedClones(dnd)
          }
          return (array[i] = null)
        } else {
          this.dom.styledCurves.drawCurves(this.generateDrawingInput(dnd))
          return dnd
        }
      })
      .filter(dnd => dnd != null))
  }
  generateDrawingInput(dnd) {
    return {
      start: [
        // parent side
        parseInt(dnd.parentDnd.style.left) - this.dom.styledCurves.offsetLeft,
        parseInt(dnd.parentDnd.style.top) - this.dom.styledCurves.offsetTop,
      ],
      end: [
        // new dnd side
        parseInt(dnd instanceof LightClone ? dnd.left() : dnd.style.left) -
          this.dom.styledCurves.offsetLeft,
        parseInt(dnd instanceof LightClone ? dnd.top() : dnd.style.top) -
          this.dom.styledCurves.offsetTop,
      ],
      offsetXForEnd: [dnd.offsetWidth, 0],
      offsetXYForStart: [dnd.parentDnd.offsetWidth, dnd.parentDnd.offsetHeight],
      level: dnd.depth,
      curvedColor: dnd.curveColor || "brown",
    }
  }
  drawOnEveryAnimationFrame() {
    let rafCancel
    const dragAndDraw = dndElements => {
      this.draw()
      return (rafCancel = requestAnimationFrame(() => dragAndDraw()))
    }
    rafCancel = requestAnimationFrame(() => dragAndDraw(this.dndElements))
    this.addEventListener(
      "draggingEnd",
      () => cancelAnimationFrame(rafCancel),
      { once: true }
    )
    return void 0
  }
  zoomAndAdapt(event) {
    function zoom(event) {
      event.preventDefault()
      let scale = parseFloat(event.currentTarget.style.transform.slice(6)) || 1
      scale += (event.deltaY * -0.01) / 2
      // Restrict scale
      scale = Math.min(Math.max(0.125, scale), 4)
      event.currentTarget.style.transform = `scale(${scale})`
      return scale
    }
    const zoomValue = zoom(event)
    // this.style.width = `${innerWidth / zoomValue}px`
    // this.style.height = `${innerHeight / zoomValue}px`
    // this.style.transformOrigin = "top left"
    // return this.draw()
  }
  unzoom(event) {
    if (this.style.transform === "none" || this.style.transform === "") return
    this.style.transform = "none"
    const target = findElementInEventPath(event, "DRAG-AND-DROP")
    if (target) {
      target.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      })
    }
    return void 0
  }
  preventAutomaticTextSelectionOnDoubleClick(event) {
    // https://stackoverflow.com/questions/880512/prevent-text-selection-after-double-click
    if (event.detail > 1) {
      event.preventDefault()
    }
  }
  storeMouseClickData(event) {
    this.clickData.startX = event.pageX
    this.clickData.startY = event.pageY
    return void 0
  }
  handleActiveDndElement(event, activeElement) {
    if (
      (activeElement === null || activeElement === void 0
        ? void 0
        : activeElement.tagName) === "DRAG-AND-DROP" &&
      activeElement !== this.activeDnd &&
      event.button === 0
    ) {
      const delta = 6
      const diffX = Math.abs(event.pageX - this.clickData.startX)
      const diffY = Math.abs(event.pageY - this.clickData.startY)
      this.clickData.detail = event.detail
      if (diffX < delta && diffY < delta) {
        return setTimeout(() => {
          if (this.clickData.detail > 1) return
          if (this.activeDnd && "activated" in this.activeDnd) {
            this.activeDnd.activated = null
          }
          this.activeDnd = activeElement
          return this.activeDnd ? (this.activeDnd.activated = "") : null
        }, 250)
      }
    }
  }
  removeCollectedClones(dnd) {
    if ("dndClones" in dnd)
      return dnd.dndClones
        .map(el => this.dndElements.indexOf(el))
        .forEach(index => (this.dndElements[index] = null))
  }
  removeElement(activeElement) {
    if (activeElement && activeElement.tagName === "DRAG-AND-DROP") {
      const indexOfDndToRemove = this.dndElements.indexOf(
        this.root.removeChild(activeElement)
      )
      const dndToRemove = this.dndElements[indexOfDndToRemove]
      this.removeCollectedClones(dndToRemove)
      this.dndElements[indexOfDndToRemove] = null
      if (this.activeDnd && "activated" in this.activeDnd)
        this.activeDnd.activated = null
      const firstDndElement = this.dndElements[0]
      if (firstDndElement && !(firstDndElement instanceof LightClone)) {
        this.activeDnd = firstDndElement
        this.activeDnd.activated = ""
      } else this.activeDnd = null
      return this.draw()
    }
    return null
  }
  getMousePositionRelativeToElement(event) {
    const rect = event.target.getBoundingClientRect()
    return [event.clientX - rect.left, event.clientY - rect.top]
  }
  drawSpecialCurve(event) {
    const clickedOnDndElement = findElementInEventPath(event, "DRAG-AND-DROP")
    if (clickedOnDndElement && clickedOnDndElement !== this.activeDnd) {
      const dndClone = new LightClone(clickedOnDndElement)
      clickedOnDndElement.dndClones
        ? clickedOnDndElement.dndClones.push(dndClone)
        : (clickedOnDndElement.dndClones = [dndClone])
      dndClone.parentDnd = this.activeDnd
      this.dndElements.push(dndClone)
      this.draw()
      this.root.addEventListener(
        "contextmenu",
        event => {
          event.preventDefault()
        },
        { once: true }
      )
    }
  }
  changeBgColor(event) {
    if (event.composedPath()[0] === this.dom.colorSlider) {
      return (this.style.backgroundColor = event.detail.hex)
    }
  }
  handleSettingOptions(event) {
    const dndToConfigure = findElementInEventPath(event, "DRAG-AND-DROP")
    if (dndToConfigure instanceof DragAndDrop && "depth" in dndToConfigure) {
      this.dom.modalWindow.append(
        this.dom.settingOptionsTemplate.content.cloneNode(true)
      )
      const settingOptionsEl = this.dom.modalWindow.querySelector(
        "setting-options"
      )
      settingOptionsEl.shadowRoot.addEventListener("colorChange", event =>
        this.changeOptionsColors(event, dndToConfigure)
      )
      settingOptionsEl.shadowRoot
        .querySelector("#show")
        .addEventListener("click", event =>
          this.handleTextDisplay(event, dndToConfigure)
        )
      settingOptionsEl.shadowRoot
        .querySelector(".leave")
        .addEventListener("click", this.handleLeaveOptions.bind(this))
      this.dom.modalWindow.showModalAndWaitForClose().then(() => {
        setTimeout(
          () =>
            this.dom.modalWindow.removeChild(
              this.dom.modalWindow.querySelector("*[slot='modal-content']")
            ),
          400
        )
      })
    }
  }
  changeOptionsColors(event, dndToConfigure) {
    if (
      event.composedPath()[0] ===
      event.currentTarget.querySelector(".curve-color")
    ) {
      dndToConfigure.curveColor = event.detail.hex
      this.draw()
    } else if (
      event.composedPath()[0] ===
      event.currentTarget.querySelector(".node-color")
    ) {
      dndToConfigure.style.backgroundColor = event.detail.hex
    }
  }
  handleTextDisplay(event, dndToConfigure) {
    this.dom.modalWindow
      .querySelector("setting-options")
      .replaceWith(this.dom.subtextTemplate.content.cloneNode(true))
    const subtextElement = this.dom.modalWindow.querySelector("div[slot]")
    // @ts-ignore
    const easyMDE = new window.EasyMDE({
      initialValue: dndToConfigure.mdText,
      element: subtextElement.querySelector("textarea"),
    })
    const codeMirror = subtextElement.querySelector(".CodeMirror")
    codeMirror.style.height = `${window.innerHeight * 0.63}px`
    subtextElement
      .querySelector("#save-subtext")
      .addEventListener("click", event => {
        dndToConfigure.mdText = easyMDE.value()
        this.dom.modalWindow.showModal = false
      })
    subtextElement
      .querySelector("#cancel-subtext")
      .addEventListener("click", event => {
        this.dom.modalWindow.showModal = false
      })
  }
  handleLeaveOptions(event) {
    this.dom.modalWindow.showModal = false
  }
  static get is() {
    return "mapping-element"
  }
}
customElements.define(MappingElement.is, MappingElement)
