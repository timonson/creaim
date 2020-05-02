export { isHTMLElement, convertDashToCamel, convertCamelToDash, coupleSettersAndGettersToAttributes, makeElementEditableSanely, findElementInEventPath, changeCss, loadCss, };
function isHTMLElement(element) {
    return element instanceof HTMLElement;
}
function convertDashToCamel(str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}
function convertCamelToDash(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}
function coupleSettersAndGettersToAttributes(thisObj, camelCasePropsAsStrings) {
    for (const propertyName of camelCasePropsAsStrings) {
        Object.defineProperty(thisObj, propertyName, {
            get: function () {
                return this.getAttribute(convertCamelToDash(propertyName));
            },
            set: function (value) {
                return value
                    ? this.setAttribute(convertCamelToDash(propertyName), value)
                    : this.removeAttribute(convertCamelToDash(propertyName));
            },
        });
    }
}
/*
 * Short version is:
 *   <div
 *     contenteditable="true"
 *     onInput="e => console.log('Text inside div', e.currentTarget.textContent)"
 *   >
 *     Text inside div
 *   </div>
 */
function makeElementEditableSanely(element, callback) {
    function makeEditable(event) {
        element.contentEditable = "true";
        element.blur();
        element.focus();
        document.execCommand("selectAll", false, undefined);
        event.preventDefault();
        event.stopPropagation();
        const resetContentEditable = (event) => {
            element.contentEditable = "false";
            element.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("click", handleClickContentEditable);
            if (typeof callback === "function")
                callback(element);
        };
        const handleKeyDown = (event) => {
            if (event.key === "Tab") {
                resetContentEditable(event);
            }
        };
        const handleClickContentEditable = (event) => {
            if (event.clientX === 0 && event.clientY === 0) {
                event.preventDefault();
                event.stopPropagation();
            }
            else
                resetContentEditable(event);
        };
        element.addEventListener("keydown", handleKeyDown);
        document.addEventListener("click", handleClickContentEditable);
    }
    element.addEventListener("dblclick", makeEditable);
    element.addEventListener("keydown", event => {
        if (event.key === "Enter")
            makeEditable(event);
    });
}
function findElementInEventPath(event, searchTag) {
    function predicate(eventTarget, searchTag) {
        if (eventTarget instanceof HTMLElement)
            return eventTarget.tagName === searchTag;
        else
            return false;
    }
    const foundElement = event
        .composedPath()
        .find((eventTarget) => predicate(eventTarget, searchTag));
    return foundElement ? foundElement : null;
}
function loadCss(path, target = document.head) {
    return new Promise(function (resolve, reject) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        target.appendChild(link);
        link.onload = () => resolve();
    });
}
function changeCss(element, cssMap) {
    if (element instanceof HTMLElement)
        cssMap.forEach(([prop, value]) => (element.style[prop] = value));
    else
        console.error(`element is not of type HTMLElement`);
}
//# sourceMappingURL=utils.js.map