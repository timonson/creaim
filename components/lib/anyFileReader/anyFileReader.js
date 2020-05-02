var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { Template } from "./template.js";
const readingMethods = new Set([
    "readAsArrayBuffer",
    "readAsBinaryString",
    "readAsDataURL",
    "readAsText",
]);
class AnyFileReader extends HTMLElement {
    constructor() {
        super(...arguments);
        this.root = this.attachShadow({ mode: "open" });
        this.opts = { label: "" };
        this.fileDataGenerator = function (inputElement, readingMethod, fileType) {
            return __asyncGenerator(this, arguments, function* () {
                while (true) {
                    yield yield __await(yield __await(new Promise((resolve, reject) => {
                        function handleFileSelection(event) {
                            var _a;
                            const files = inputElement.files;
                            if (!((_a = files) === null || _a === void 0 ? void 0 : _a.length))
                                return reject("No file!");
                            const file = files.item(0);
                            if (typeof fileType === "string" && !validFileType(file, fileType))
                                reject("A file with wrong filetype was selected");
                            return read(file, readingMethod);
                            function read(file, readingMethod) {
                                const reader = new FileReader();
                                reader[readingMethod](file);
                                return (reader.onload = (event) => {
                                    resolve(reader.result);
                                });
                            }
                        }
                        function validFileType(file, fileType) {
                            return fileType
                                .split(",")
                                .map((s) => s.trim())
                                .includes(file.type);
                        }
                        inputElement.addEventListener("change", (event) => handleFileSelection(event), { once: true });
                    })));
                }
            });
        };
    }
    connectedCallback() {
        this.root.innerHTML = Template.render(this.opts);
        this.dom = {
            input: this.root.querySelector("#file-upload"),
            label: this.root.querySelector("label"),
        };
        this.waitForFile = this.fileDataGenerator(this.dom.input, this.readingMethod, this.fileType);
        // click on 'input' element when pressing enter on focused label:
        this.dom.label.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.dom.input.click();
            }
        });
    }
    static get observedAttributes() {
        return ["reading-method", "file-type", "label"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue)
            return;
        switch (name) {
            case "reading-method":
                if (readingMethods.has(newValue))
                    return;
                else
                    return console.error("The custom element 'any-file-reader' needs a valid 'reading-method' attribute: " +
                        JSON.stringify([...readingMethods]));
                break;
            case "file-type":
                // if (newValue === null) return this.removeAttribute(name)
                break;
            case "label":
                this.opts = Object.assign(Object.assign({}, this.opts), { [name]: newValue || "" });
                this.root.innerHTML = Template.render(this.opts);
                break;
            default:
        }
    }
    get readingMethod() {
        return this.getAttribute("reading-method");
    }
    set readingMethod(value) {
        this.setAttribute("reading-method", value);
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
    static get is() {
        return "any-file-reader";
    }
}
customElements.define(AnyFileReader.is, AnyFileReader);
export { AnyFileReader };
//# sourceMappingURL=anyFileReader.js.map