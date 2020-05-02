/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getCss(opts = {}) {
  return `:host {
  display: inline-block;
  border: solid lightgrey 1px;
  padding: 1em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.text-display {
  width: 100%;
  margin-bottom: 2em;
  text-align: center;
}
#show {
  width: 7em;
  height: 4em;
}

h3 {
  text-align: center;
  margin-top: 0;
}
p {
  margin: 0.2em 0 1em;
  font-size: 0.75rem;
  font-style: italic;
  line-height: 1;
}
button {
  cursor: pointer;
}
button:hover {
  background-color: lavender;
}
.leave {
  margin-top: 2em;
  display: flex;
  align-content: space-around;
}
.leave button {
  flex: 1 1 0px;
}
#save-settings {
  margin-right: 0.5em;
}
.button-bg-color {
  background-color: aliceblue;
}`
}

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getHtml(opts = {}) {
  return `<div>
  <h3>Edit Subtext</h3>
  <div class="text-display">
    <button id="show" class="button-bg-color">Edit</button>
  </div>
</div>
<div>
  <h3>Set the Colors</h3>
  <div>
    <color-slider class="node-color"></color-slider>
    <p>Node Color</p>
  </div>
  <div>
    <color-slider class="curve-color"></color-slider>
    <p>Curve Color</p>
  </div>
</div>
<div class="leave">
  <button id="save-settings" class="button-bg-color">Ok</button>
  <button id="cancel-settings" class="button-bg-color">Cancel</button>
</div>`
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
