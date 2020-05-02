import {
  fixtureSync,
  oneEvent,
  aTimeout,
} from "../../../../utils/testing-helpers.js"
import { deepEqual as assert } from "../../../../utils/deepEqual.js"
import { AnyFileDownloader } from "../dist/anyFileDownloader.js"

describe("AnyFileDownloader", function() {
  const tag = `<${AnyFileDownloader.is}></${AnyFileDownloader.is}>`
  it("loads default", async () => {
    const el = fixtureSync(tag)
    assert(!!el.offsetParent, true)
  })
  it("check if input element is loaded", async () => {
    const el = fixtureSync(tag)
  })
  it("check colorChange event", async () => {})
})
