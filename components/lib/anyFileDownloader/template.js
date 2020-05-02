/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss(opts = {}) {
    return `:host {
  display: inline-block;
  font-family: "Arial";
  cursor:pointer;
}
a {
  padding: 0.3em;
  border: 1px solid darkgrey;
  border-radius: 5px;
  color:inherit;
     text-decoration:none; 
}

a:hover {
  background-color: lightgrey;
}`;
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml(opts = {}) {
    return `<a id="download-anchor" download="${opts.filename}">${opts.content}</a>`;
}
/**
 * @type { {
 * render: (opts?: { filename?: string, fileType?:string, content?:string  }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any   }) => string
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