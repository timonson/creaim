import { Template } from "./template.js"

function waitForEvent(
  eventTarget: EventTarget,
  eventName: string
): Promise<Event> {
  return new Promise(resolve => {
    function listener(event: Event) {
      resolve(event)
      eventTarget.removeEventListener(eventName, listener)
    }
    eventTarget.addEventListener(eventName, listener)
  })
}

class AnyFileDownloader extends HTMLElement {
  private root = this.attachShadow({ mode: "open" })!
  private dom!: { anchor: HTMLElement }
  opts = { fileType: "", filename: "", content: "" }
  makeDownload!: (
    str: string | (() => string),
    fileType?: string
  ) => Promise<string>
  constructor() {
    super()
    this.makeDownload = this._makeDownload.bind(this)
  }
  connectedCallback() {
    this.opts.content = this.textContent || ""
    this.root.innerHTML = Template.render(this.opts)
    this.dom = {
      anchor: this.root.querySelector("#download-anchor") as HTMLElement,
    }
  }

  private async _makeDownload(
    str: string | (() => string),
    fileType: string = this.getAttribute("file-type") || ""
  ) {
    function setBlob(anchor: HTMLElement, str: string, fileType: string) {
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
      const event = await waitForEvent(this.dom.anchor, "click")
      realString = str()
      setBlob(this.dom.anchor, realString, fileType)
    }
    return realString
  }

  static get observedAttributes() {
    return ["fileType", "filename"]
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (newValue === oldValue) return
    this.opts = { ...this.opts, [name]: newValue }
  }

  get fileType(): string | null {
    return this.getAttribute("file-type")
  }
  set fileType(value: string | null) {
    if (value === null) this.removeAttribute("file-type")
    else this.setAttribute("file-type", value)
  }
  get filename(): string | null {
    return this.getAttribute("filename")
  }
  set filename(value: string | null) {
    if (value === null) this.removeAttribute("filename")
    else this.setAttribute("filename", value)
  }

  static get is() {
    return "any-file-downloader"
  }
}

customElements.define(AnyFileDownloader.is, AnyFileDownloader)

export { AnyFileDownloader }
