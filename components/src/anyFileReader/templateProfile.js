import getCss from "./template.css"
import getHtml from "./template.html"

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
}

export { Template }
