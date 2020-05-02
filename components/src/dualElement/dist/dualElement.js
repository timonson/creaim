function convertDashToCamel(str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}
//# sourceMappingURL=utils.js.map

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss(opts = {}) {
    return `:host {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  width: 12em;
  height: 3em;
  border: 0.5px solid darkslategrey;
  background: linear-gradient(
    to right,
    slategrey calc(25% - 4.3px),
    transparent 0%
  );
}

div {
  margin: 0;
  padding: 0.3em;
  line-height: 1.3;
  max-height: 100%;
  width: 75%;
  flex: 3 3 30px;
  overflow-wrap: anywhere;
  text-align: center;
  display: inline-block;
}

button {
  display: inline-block;
  width: 25%;
  flex: 1 1 10px;
  height: 100%;
  /* background-color: slategrey; */
  background-image: linear-gradient(
    to right,
    rgba(255, 80, 99, 5),
    rgba(17, 26, 152, 1)
  );
  cursor: pointer;
  outline: none;
  border: none;
}

button:hover {
  background-color: darkslategrey;
}`;
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml(opts = {}) {
    return `<button aria-label="Settings"></button>
<div spellcheck="false">${opts.content}</div>`;
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
//# sourceMappingURL=template.js.map

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
        }
    }
    static get is() {
        return "dual-element";
    }
}
customElements.define(DualElement.is, DualElement);
//# sourceMappingURL=dualElement.js.map

export { DualElement };
//# sourceMappingURL=dualElement.js.map
