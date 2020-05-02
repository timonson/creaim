import {
  fixtureSync,
  oneEvent,
  aTimeout,
} from "../../../../utils/funTestingWc.js"
import { deepEqual as assert } from "../../../../utils/funAssertion.js"
import { DualElement } from "../dist/dualElement.js"

describe("DualElement", function() {
  const tag = `<${DualElement.is}></${DualElement.is}>`
  it("loads default", async () => {
    const el = fixtureSync(tag)
    assert(!!el.offsetParent, true)
  })
  it("", async () => {
    const el = fixtureSync(tag)
  })
  it("", async () => {
    const el = fixtureSync(tag)
  })
})
