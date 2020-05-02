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
  /* border: solid darkslategrey 2.5px !important; */
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
}`;
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml(opts = {}) {
    return `<slot spellcheck="false" name="embedded"></slot>`;
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
        return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`;
    },
    getHtml,
    getCss,
};

class DragAndDrop extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.connected = false;
        this.addEventListener("mousedown", this.dragAndDropCurrentTarget);
    }
    get activated() {
        return this.getAttribute("activated");
    }
    set activated(value) {
        value == null
            ? this.removeAttribute("activated")
            : this.setAttribute("activated", "");
    }
    // https://javascript.info/mouse-drag-and-drop
    dragAndDropCurrentTarget(event) {
        if (event.button !== 0)
            return;
        const targetElement = event.currentTarget;
        const draggingStartEvent = new CustomEvent("draggingStart", {
            bubbles: true,
            composed: true,
            detail: targetElement,
        });
        const draggingEndEvent = new CustomEvent("draggingEnd", {
            bubbles: true,
            composed: true,
            detail: targetElement,
        });
        function surroundMouseWithElement(pageX, pageY, element) {
            return [
                pageX -
                    (pageXOffset + element.offsetParent.getBoundingClientRect().left) -
                    element.offsetWidth / 2,
                pageY -
                    (pageYOffset + element.offsetParent.getBoundingClientRect().top) -
                    element.offsetHeight / 2,
            ];
        }
        function checkBoundaries(value, boundary) {
            return value <= 0 ? 0 : Math.min(boundary, value);
        }
        function moveAt(event) {
            const [calculatedLeft, calculatedTop] = surroundMouseWithElement(event.pageX, event.pageY, targetElement);
            targetElement.style.left =
                checkBoundaries(calculatedLeft, targetElement.boundary.left - targetElement.offsetWidth) + "px";
            targetElement.style.top =
                checkBoundaries(calculatedTop, targetElement.boundary.top - targetElement.offsetHeight) + "px";
        }
        targetElement.dispatchEvent(draggingStartEvent);
        //  move the ball on mousemove
        document.addEventListener("mousemove", moveAt);
        const cancelId = setTimeout(() => {
            targetElement.style.cursor = "grab";
        }, 100);
        // drop the ball, remove unneeded handlers
        document.addEventListener("mouseup", event => {
            targetElement.dispatchEvent(draggingEndEvent);
            clearTimeout(cancelId);
            targetElement.style.cursor = "auto";
            document.removeEventListener("mousemove", moveAt);
        }, { once: true });
        // the browser has its own Drag’n’Drop for images and some other elements
        // that runs automatically and conflicts with ours
        targetElement.ondragstart = () => false;
    }
    connectedCallback() {
        this.root.innerHTML = Template.render();
        this.dom = {
            slotElement: this.querySelector("*[slot='embedded']"),
        };
        this.boundary = {
            left: this.offsetParent.offsetWidth,
            top: this.offsetParent.offsetHeight,
        };
        this.connected = true;
    }
    static get observedAttributes() {
        return [, "activated"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "activated":
                newValue !== null
                    ? this.classList.add("activated")
                    : this.classList.remove("activated");
                break;
        }
    }
    static get is() {
        return "drag-and-drop";
    }
}
customElements.define(DragAndDrop.is, DragAndDrop);

export { DragAndDrop };
//# sourceMappingURL=dragAndDrop.js.map
