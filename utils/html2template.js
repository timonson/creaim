const targetFile = "template.ts"
const fs = require("fs")
const dirname = require("path").dirname
const extname = require("path").extname
const chokidar = require("chokidar")
// Initialize watcher.
const watcher = chokidar.watch(
  ["./components/src/**/template.html", "./components/src/**/template.css"],
  {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  }
)

// const destinationTemplate = process.argv[2]
// const sourceHtmlFile = process.argv[3]
// const sourceCssFile = process.argv[4]

function writeUpdatedFunctionToTemplateFile(fileType, code, oldTemplate) {
  const regex = new RegExp(`${fileType}\\(opts.*?\\) {[\\s\\S]*?\`\\s*},`)
  const newTemplate = oldTemplate.replace(
    regex,
    `${fileType}(opts: Opts) { return \`
  ${code}
  \` },`
  )
  return newTemplate
}

function updateTemplateFile(destinationTemplate, srcFile) {
  if (!srcFile) {
    console.error("No source file specified")
    process.exit(1)
  }

  if (!destinationTemplate) {
    console.error("No desintation JS file specified")
    process.exit(1)
  }

  const oldTemplateJs = fs.readFileSync(destinationTemplate, "utf8")
  const srcString = fs.readFileSync(srcFile, "utf8")
  const fileType = extname(srcFile).slice(1)

  switch (fileType) {
    case "html":
      const html = srcString.trimStart().trim()
      return fs.writeFileSync(
        destinationTemplate,
        writeUpdatedFunctionToTemplateFile(fileType, html, oldTemplateJs)
      )
      break
    case "css":
      const css = srcString
        .replace(/<style>/gi, "")
        .replace(/<\/style>/gi, "")
        .trimStart()
        .trim()
      return fs.writeFileSync(
        destinationTemplate,
        writeUpdatedFunctionToTemplateFile(fileType, css, oldTemplateJs)
      )

      break
    default:
  }
}

watcher
  .on("add", path => updateTemplateFile(dirname(path) + "/" + targetFile, path))
  .on("change", path =>
    updateTemplateFile(dirname(path) + "/" + targetFile, path)
  )
