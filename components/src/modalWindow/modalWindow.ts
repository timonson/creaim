// @ts-ignore
import { Template } from "./template.js"

class ModalWindow extends HTMLElement {
  root = this.attachShadow({ mode: "open" })!
  dom!: {
    modal: HTMLDivElement
    modalClose: HTMLButtonElement
    slot: HTMLElement
  }
  connected = false
  opts = { showModal: false }
  constructor() {
    super()
  }

  connectedCallback() {
    this.root.innerHTML = Template.render({ padding: "2em" })
    this.dom = {
      modal: this.root.querySelector(".modal") as HTMLDivElement,
      modalClose: this.root.querySelector(".modal-close") as HTMLButtonElement,
      slot: this.querySelector('*[slot="modal-content"]') as HTMLElement,
    }
    this.connected = true
    if (this.opts.showModal) this.showModal = true
  }

  get showModal(): boolean {
    return this.hasAttribute("show-modal") ? true : false
  }
  set showModal(value: boolean) {
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
      const handleClickOnModalWindow = (event: Event) => {
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

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (newValue === oldValue) return
    this.dom.slot=this.querySelector('*[slot="modal-content"]') as HTMLElement
    switch (name) {
      case "show-modal":
        if (!this.connected) return (this.opts.showModal = true)
        if (newValue === null) {
          this.dom.modal.classList.remove("show-modal")
          this.dom.slot.style.visibility = "hidden"
          this.dom.slot.style.opacity = "0"
        } else {
          this.dom.modal.classList.add("show-modal")
          ;(this.root.querySelector(".modal-body")! as HTMLElement).focus()
          this.dom.slot.style.visibility = "visible"
          this.dom.slot.style.opacity = "1"
        }
        break
      default:
    }
  }

  static get is() {
    return "modal-window"
  }
}

customElements.define(ModalWindow.is, ModalWindow)

export { ModalWindow }
