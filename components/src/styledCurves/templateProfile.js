import getCss from "./template.css"

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
}

export { Template }
