import {
  fixtureSync,
  oneEvent,
  aTimeout,
} from "../../../../utils/testing-helpers.js"
import { deepEqual as assert } from "../../../../utils/deepEqual.js"
import { AnyFileReader } from "../dist/anyFileReader.js"

describe("AnyFileReader", function() {
  const tag = `<${AnyFileReader.is}></${AnyFileReader.is}>`
  it("loads default", async () => {
    const el = fixtureSync(tag)
    assert(!!el.offsetParent, true)
  })
  it("check if input element is loaded", async () => {
    const el = fixtureSync(tag)
    assert(
      el.shadowRoot.querySelector('input[type="file"]') instanceof HTMLElement,
      true
    )
  })
  it("check colorChange event", async () => {})
})
