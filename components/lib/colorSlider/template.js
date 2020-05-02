/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getCss(opts = {}) {
    return `:host {
  display: inline-block;
  transform: rotate(${opts.rotation}deg);
  margin-top: ${opts.marginTop};
}
svg circle {
  cursor: pointer;
}`;
}
/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
function getHtml(opts = {}) {
    return `<svg width="${opts.width}" height="${opts.height}">
  <defs>
    <linearGradient id="pickerHue">
      <stop offset="0" stop-color="#fff" stop-opacity="1" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect
    id="slider"
    width="${opts.width}"
    height="${opts.height - 1}"
    y="0"
    rx="5"
    ry="${opts.height / 3 + 1}"
  />
  <circle
    id="sliderHandler"
    r="${opts.height / 3}"
    cx="5"
    cy="${opts.height / 3 + 1}"
    fill="none"
    stroke="#fff"
    stroke-width="2"
  />
</svg>`;
}
/**
 * @type { {
 * render: (opts: { rotation: string | number }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts: { rotation: string | number }) => string
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