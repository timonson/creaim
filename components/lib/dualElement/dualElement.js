import { convertDashToCamel } from "../utils/utils.js";
import { Template } from "./template.js";
class DualElement extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.opts = { content: "" };
        this.connected = false;
    }
    connectedCallback() {
        this.root.innerHTML = Template.render(this.opts);
        this.connected = true;
    }
    static get observedAttributes() {
        return ["content"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue)
            return;
        switch (name) {
            case "content":
                this.opts = Object.assign(Object.assign({}, this.opts), { [convertDashToCamel(name)]: newValue || "" });
                if (this.connected)
                    this.root.querySelector("div").textContent = this.opts.content;
                break;
            default:
        }
    }
    static get is() {
        return "dual-element";
    }
}
customElements.define(DualElement.is, DualElement);
export { DualElement };
//# sourceMappingURL=dualElement.js.map