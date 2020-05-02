var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Template } from "./template.js";
function waitForEvent(eventTarget, eventName) {
    return new Promise(resolve => {
        function listener(event) {
            resolve(event);
            eventTarget.removeEventListener(eventName, listener);
        }
        eventTarget.addEventListener(eventName, listener);
    });
}
class AnyFileDownloader extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.opts = { fileType: "", filename: "", content: "" };
        this.makeDownload = this._makeDownload.bind(this);
    }
    connectedCallback() {
        this.opts.content = this.textContent || "";
        this.root.innerHTML = Template.render(this.opts);
        this.dom = {
            anchor: this.root.querySelector("#download-anchor"),
        };
    }
    _makeDownload(str, fileType = this.getAttribute("file-type") || "") {
        return __awaiter(this, void 0, void 0, function* () {
            function setBlob(anchor, str, fileType) {
                const blob = new Blob([str], { type: fileType });
                const url = URL.createObjectURL(blob);
                anchor.setAttribute("href", url);
                return blob;
            }
            let realString = "";
            if (typeof str === "string") {
                realString = str;
                setBlob(this.dom.anchor, str, fileType);
            }
            else {
                const event = yield waitForEvent(this.dom.anchor, "click");
                realString = str();
                setBlob(this.dom.anchor, realString, fileType);
            }
            return realString;
        });
    }
    static get observedAttributes() {
        return ["fileType", "filename"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue)
            return;
        this.opts = Object.assign(Object.assign({}, this.opts), { [name]: newValue });
    }
    get fileType() {
        return this.getAttribute("file-type");
    }
    set fileType(value) {
        if (value === null)
            this.removeAttribute("file-type");
        else
            this.setAttribute("file-type", value);
    }
    get filename() {
        return this.getAttribute("filename");
    }
    set filename(value) {
        if (value === null)
            this.removeAttribute("filename");
        else
            this.setAttribute("filename", value);
    }
    static get is() {
        return "any-file-downloader";
    }
}
customElements.define(AnyFileDownloader.is, AnyFileDownloader);
export { AnyFileDownloader };
//# sourceMappingURL=anyFileDownloader.js.map