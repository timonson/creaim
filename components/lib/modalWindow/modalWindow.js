// @ts-ignore
import { Template } from "./template.js";
class ModalWindow extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.connected = false;
        this.opts = { showModal: false };
    }
    connectedCallback() {
        this.root.innerHTML = Template.render({ padding: "2em" });
        this.dom = {
            modal: this.root.querySelector(".modal"),
            modalClose: this.root.querySelector(".modal-close"),
            slot: this.querySelector('*[slot="modal-content"]'),
        };
        this.connected = true;
        if (this.opts.showModal)
            this.showModal = true;
    }
    get showModal() {
        return this.hasAttribute("show-modal") ? true : false;
    }
    set showModal(value) {
        value === false
            ? this.dispatchEvent(new CustomEvent("modalClose"))
            : this.showModalAndWaitForClose();
    }
    showModalAndWaitForClose() {
        return new Promise(resolve => {
            const toggleModal = () => {
                if (!this.dom.modal.classList.contains("show-modal")) {
                    return this.setAttribute("show-modal", "");
                }
                else {
                    this.removeAttribute("show-modal");
                    this.dom.modalClose.removeEventListener("click", toggleModal);
                    this.removeEventListener("modalClose", toggleModal);
                    this.dom.modal.removeEventListener("click", handleClickOnModalWindow);
                    resolve();
                }
            };
            const handleClickOnModalWindow = (event) => {
                if (event.target === this.dom.modal) {
                    toggleModal();
                }
            };
            this.dom.modalClose.addEventListener("click", toggleModal);
            this.addEventListener("modalClose", toggleModal);
            this.dom.modal.addEventListener("click", handleClickOnModalWindow);
            toggleModal();
        });
    }
    static get observedAttributes() {
        return ["show-modal"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue)
            return;
        this.dom.slot = this.querySelector('*[slot="modal-content"]');
        switch (name) {
            case "show-modal":
                if (!this.connected)
                    return (this.opts.showModal = true);
                if (newValue === null) {
                    this.dom.modal.classList.remove("show-modal");
                    this.dom.slot.style.visibility = "hidden";
                    this.dom.slot.style.opacity = "0";
                }
                else {
                    this.dom.modal.classList.add("show-modal");
                    this.root.querySelector(".modal-body").focus();
                    this.dom.slot.style.visibility = "visible";
                    this.dom.slot.style.opacity = "1";
                }
                break;
            default:
        }
    }
    static get is() {
        return "modal-window";
    }
}
customElements.define(ModalWindow.is, ModalWindow);
export { ModalWindow };
//# sourceMappingURL=modalWindow.js.map