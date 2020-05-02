/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getCss(opts = {}) {
  return `:host {
  display: inline-block;
  font-family: "Arial";
}
input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap; /* 1 */
  clip-path: inset(50%);
  border: 0;
}

label {
  padding: 0.3em;
  border: 1px solid darkgrey;
  border-radius: 5px;
  cursor: pointer;
}

label:hover {
  background-color: lightgrey;
}

label:focus {
  outline: auto 1px rgb(77, 144, 254);
}`
}

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getHtml(opts = {}) {
  return `<label tabindex="0" for="file-upload">${opts.label||""}</label>
<input tabindex="-1" type="file" name="file-data" id="file-upload" />`
}

/**
 * @type { {
 * render: (opts?: { label: string  }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { label: string  }) => string
 * } }
 */
const Template = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml,
  getCss,
};

export { Template };
