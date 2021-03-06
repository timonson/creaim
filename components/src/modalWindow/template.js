/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getCss(opts = {}) {
  return `:host{
display:block;
}
.modal {
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  bottom:0;
  right:0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.2);
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}
.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
.modal-body {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: ${opts.padding || "6em"} ;
  width: ${opts.width || "auto"};
  height: ${opts.height || "auto"};
  max-height:100%;
  max-width:100%;
  border-radius: 0.5rem;
  overflow:auto;
}
.modal-close {
position: absolute;
top: 0.3em;
right: 0.3em;
padding: 0.3em;
cursor: pointer;
font-size: 2em;
height: 0.8em;
width: 0.8em;
text-indent: 20em;
overflow: hidden;
border: 0;
background-color:inherit;
}
.modal-close::after {
position: absolute;
line-height: 0.5;
top: 0.14em;
left: 0.12em;
text-indent: 0;
content: "\\00D7";
}`
}

/**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function getHtml(opts = {}) {
  return `<div class="modal">
  <div tabindex="0" class="modal-body">
    <button class="modal-close">close</button>
    <slot name="modal-content"></slot>
  </div>
</div>`
}

/**
 * @type { {
 * render: (opts?: { padding?:string, width?:string }) => string
 * getHtml: (opts?: { [key: string]: any }) => string
 * getCss: (opts?: { padding?:string, width?:string }) => string
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
