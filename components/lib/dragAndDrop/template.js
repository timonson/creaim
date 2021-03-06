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
export { Template };
//# sourceMappingURL=template.js.map