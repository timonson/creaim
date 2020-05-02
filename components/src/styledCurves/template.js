/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getCss(opts = {}) {
  return `:host{
display: block;
    position : relative;
    background-color : inherit;
    height : 100%;
    width :100%;
  }`
}

/**
 * @type { {
 * render: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { [key: string]: any }) => string
 * } }
 */
const Template = {
  render(opts) {
    return `<style>${this.getCss(opts)}</style>`
  },
  getCss,
};

export { Template };
