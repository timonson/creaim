import { Template } from "./template.js"

const readingMethods = new Set([
  "readAsArrayBuffer",
  "readAsBinaryString",
  "readAsDataURL",
  "readAsText",
] as const)
type ReadingMethods = typeof readingMethods extends Set<infer T> ? T : never

class AnyFileReader extends HTMLElement {
  private root = this.attachShadow({ mode: "open" })!
  private dom!: { input: HTMLInputElement; label: HTMLLabelElement }
  private opts = { label: "" }
  waitForFile!: AsyncGenerator
  connectedCallback() {
    this.root.innerHTML = Template.render(this.opts)
    this.dom = {
      input: this.root.querySelector("#file-upload") as HTMLInputElement,
      label: this.root.querySelector("label") as HTMLLabelElement,
    }

    this.waitForFile = this.fileDataGenerator(
      this.dom.input,
      this.readingMethod,
      this.fileType
    )

    // click on 'input' element when pressing enter on focused label:
    this.dom.label.addEventListener("keydown", (event: Event) => {
      if ((event as KeyboardEvent).key === "Enter") {
        this.dom.input.click()
      }
    })
  }

  private fileDataGenerator = async function*(
    inputElement: HTMLInputElement,
    readingMethod: ReadingMethods,
    fileType: string | null
  ) {
    while (true) {
      yield await new Promise((resolve, reject) => {
        function handleFileSelection(event: Event) {
          const files = inputElement.files
          if (!files?.length) return reject("No file!")
          const file = files.item(0)!
          if (typeof fileType === "string" && !validFileType(file, fileType))
            reject("A file with wrong filetype was selected")
          return read(file, readingMethod)
          function read(file: File, readingMethod: ReadingMethods) {
            const reader = new FileReader()
            reader[readingMethod](file)
            return (reader.onload = (event: Event) => {
              resolve(reader.result)
            })
          }
        }
        function validFileType(file: File, fileType: string) {
          return fileType
            .split(",")
            .map((s: string) => s.trim())
            .includes(file.type)
        }
        inputElement.addEventListener(
          "change",
          (event: Event) => handleFileSelection(event),
          { once: true }
        )
      })
    }
  }

  static get observedAttributes() {
    return ["reading-method", "file-type", "label"]
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (newValue === oldValue) return
    switch (name) {
      case "reading-method":
        if ((readingMethods as Set<any>).has(newValue)) return
        else
          return console.error(
            "The custom element 'any-file-reader' needs a valid 'reading-method' attribute: " +
              JSON.stringify([...readingMethods])
          )
        break
      case "file-type":
        // if (newValue === null) return this.removeAttribute(name)
        break
      case "label":
        this.opts = { ...this.opts, [name]: newValue || "" }
        this.root.innerHTML = Template.render(this.opts)
        break
      default:
    }
  }

  get readingMethod(): ReadingMethods {
    return this.getAttribute("reading-method") as ReadingMethods
  }
  set readingMethod(value: ReadingMethods) {
    this.setAttribute("reading-method", value)
  }
  get fileType(): string | null {
    return this.getAttribute("file-type")
  }
  set fileType(value: string | null) {
    if (value === null) this.removeAttribute("file-type")
    else this.setAttribute("file-type", value)
  }

  static get is() {
    return "any-file-reader"
  }
}

customElements.define(AnyFileReader.is, AnyFileReader)

export { AnyFileReader }
