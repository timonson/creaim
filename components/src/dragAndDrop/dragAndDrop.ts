import { Template } from "./template.js"

class DragAndDrop extends HTMLElement {
  private root = this.attachShadow({ mode: "open" })!
  private dom!: {
    slotElement: HTMLElement
  }
  private connected = false
  boundary!: { left: number; top: number }
  constructor() {
    super()
    this.addEventListener("mousedown", this.dragAndDropCurrentTarget)
  }

  get activated(): string | null {
    return this.getAttribute("activated")
  }
  set activated(value: string | null) {
    value == null
      ? this.removeAttribute("activated")
      : this.setAttribute("activated", "")
  }
  // https://javascript.info/mouse-drag-and-drop
  private dragAndDropCurrentTarget(event: MouseEvent) {
    if (event.button !== 0) return
    const targetElement = event.currentTarget as DragAndDrop
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
    function surroundMouseWithElement(
      pageX: number,
      pageY: number,
      element: HTMLElement
    ) {
      return [
        pageX -
          (pageXOffset + element.offsetParent!.getBoundingClientRect().left) -
          element.offsetWidth / 2,
        pageY -
          (pageYOffset + element.offsetParent!.getBoundingClientRect().top) -
          element.offsetHeight / 2,
      ]
    }
    function checkBoundaries(value: number, boundary: number) {
      return value <= 0 ? 0 : Math.min(boundary, value)
    }
    function moveAt(event: MouseEvent) {
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
    // the browser has its own Drag’n’Drop for images and some other elements
    // that runs automatically and conflicts with ours
    targetElement.ondragstart = () => false
  }
  connectedCallback() {
    this.root.innerHTML = Template.render()
    this.dom = {
      slotElement: this.querySelector("*[slot='embedded']") as HTMLElement,
    }
    this.boundary = {
      left: (this.offsetParent as HTMLElement).offsetWidth,
      top: (this.offsetParent as HTMLElement).offsetHeight,
    }
    this.connected = true
  }
  static get observedAttributes() {
    return [, "activated"]
  }
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    switch (name) {
      case "activated":
        newValue !== null
          ? this.classList.add("activated")
          : this.classList.remove("activated")
        break
      default:
    }
  }
  static get is() {
    return "drag-and-drop"
  }
}

customElements.define(DragAndDrop.is, DragAndDrop)

export { DragAndDrop }
