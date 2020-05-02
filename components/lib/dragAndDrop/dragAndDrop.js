import { Template } from "./template.js";
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
            default:
        }
    }
    static get is() {
        return "drag-and-drop";
    }
}
customElements.define(DragAndDrop.is, DragAndDrop);
export { DragAndDrop };
//# sourceMappingURL=dragAndDrop.js.map