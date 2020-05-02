// https://github.com/TrySound/rollup-plugin-string
// Install additionally 'rollup and rollup-pluginutils' as dependency via npm
import { createFilter } from "rollup-pluginutils"

function createString(opts = {}) {
  if (!opts.include) {
    throw Error("include option should be specified")
  }

  const filter = createFilter(opts.include, opts.exclude)

  return {
    name: "createString",
    transform(code, id) {
      if (filter(id)) {
        return {
          // code: `export default ${JSON.stringify(code)};`,
          code: `export default /**
 * @param {{ [key: string]: any }} opts
 * @returns {string}
 */
 function(opts = {}) {
  return \`${code.trim()}\`
}`,
          map: { mappings: "" },
        }
      }
    },
  }
}

export { createString }
