import { createString } from "./utils/rollup-plugin-string.js"
import sourcemaps from "rollup-plugin-sourcemaps"

function createConfig(opts) {
  return [
    {
      input: [`./components/src/${opts}/templateProfile.js`],
      output: {
        file: `./components/src/${opts}/template.js`,
        format: "esm",
      },
      plugins: [
        createString({
          include: [
            "components/src/**/template.html",
            "components/src/**/template.css",
          ],
        }),
      ],
    },
    {
      input: [`./components/lib/${opts}/${opts}.js`],
      output: {
        file: `./components/src/${opts}/dist/${opts}.js`,
        format: "esm",
        sourcemap: true,
      },
      plugins: [sourcemaps()],
    },
  ]
}

const components = [
  "dualElement",
  "modalWindow",
  "colorSlider",
  "styledCurves",
  "dragAndDrop",
  "settingOptions",
  "anyFileReader",
  "anyFileDownloader",
  "utils", // must be last because it has no templateProfile.hs file!
]
const configs = components
  .map(component => createConfig(component))
  .flat()
  .filter((el, i, array) => i !== array.length - 2)

export default configs
