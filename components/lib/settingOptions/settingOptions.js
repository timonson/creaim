import { Template } from "./template.js";
import "../colorSlider/colorSlider.js";
class SettingOptions extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.opts = {};
    }
    connectedCallback() {
        this.root.innerHTML = Template.render();
    }
    static get observedAttributes() {
        return ["buttons"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue)
            return;
        switch (name) {
            case "buttons":
                if (typeof newValue === "string")
                    this.opts.buttons = newValue;
                break;
            default:
        }
    }
    static get is() {
        return "setting-options";
    }
}
customElements.define(SettingOptions.is, SettingOptions);
export { SettingOptions };
//# sourceMappingURL=settingOptions.js.map