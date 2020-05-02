/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss(opts = {}) {
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
}`;
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml(opts = {}) {
    return `<div class="modal">
  <div tabindex="0" class="modal-body">
    <button class="modal-close">close</button>
    <slot name="modal-content"></slot>
  </div>
</div>`;
}
/**
 * @type { {
 * render: (opts?: { padding?:string, width?:string }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { padding?:string, width?:string }) => string
 * } }
 */
const Template = {
    render(opts) {
        return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`;
    },
    getHtml,
    getCss,
};

// @ts-ignore
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
        }
    }
    static get is() {
        return "modal-window";
    }
}
customElements.define(ModalWindow.is, ModalWindow);

export { ModalWindow };
//# sourceMappingURL=modalWindow.js.map
