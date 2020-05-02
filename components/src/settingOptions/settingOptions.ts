import { Template } from "./template.js"
import "../colorSlider/colorSlider.js"
import { ColorSlider } from "../colorSlider/colorSlider.js"

class SettingOptions extends HTMLElement {
  private root = this.attachShadow({ mode: "open" })
  private opts: { [key: string]: string } = {}
  constructor() {
    super()
  }

  connectedCallback() {
    this.root.innerHTML = Template.render()
  }

  static get observedAttributes() {
    return ["buttons"]
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (newValue === oldValue) return
    switch (name) {
      case "buttons":
        if (typeof newValue === "string") this.opts.buttons = newValue
        break
      default:
    }
  }

  static get is() {
    return "setting-options"
  }
}
customElements.define(SettingOptions.is, SettingOptions)

export { SettingOptions }
