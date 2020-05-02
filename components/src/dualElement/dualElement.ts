import { convertDashToCamel } from "../utils/utils.js"
import { Template } from "./template.js"

class DualElement extends HTMLElement {
  private root = this.attachShadow({ mode: "open" })!
  private opts = { content: "" }
  private dom!: any
  private connected = false
  constructor() {
    super()
  }

  connectedCallback() {
    this.root.innerHTML = Template.render(this.opts)
    this.connected = true
  }

  static get observedAttributes() {
    return ["content"]
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (newValue === oldValue) return
    switch (name) {
      case "content":
        this.opts = {
          ...this.opts,
          [convertDashToCamel(name)]: newValue || "",
        }
        if (this.connected)
          this.root.querySelector("div")!.textContent = this.opts.content
        break
      default:
    }
  }

  static get is() {
    return "dual-element"
  }
}

customElements.define(DualElement.is, DualElement)

export { DualElement }
