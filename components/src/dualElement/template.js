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
}`
}

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getHtml(opts = {}) {
  return `<button aria-label="Settings"></button>
<div spellcheck="false">${opts.content}</div>`
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
    return `<style>${this.getCss(opts)}</style>${this.getHtml(opts)}`
  },
  getHtml,
  getCss,
};

export { Template };
