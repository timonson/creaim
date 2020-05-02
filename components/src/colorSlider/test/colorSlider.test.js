import {
  fixtureSync,
  oneEvent,
  aTimeout,
} from "../../../../utils/testing-helpers.js"
import { deepEqual as assert } from "../../../../utils/deepEqual.js"
import { ColorSlider } from "../dist/colorSlider.js"

describe("ColorSlider", function() {
  // this.timeout(5000) // all tests in this suite get 10 seconds before timeout
  const tag = `<${ColorSlider.is}></${ColorSlider.is}>`
  it("loads default", async () => {
    const el = fixtureSync(tag)
    assert(!!el.offsetParent, true)
  })
  it("check hex getter", async () => {
    const el = fixtureSync(tag)
    assert(el.hex.startsWith("#"), true)
    assert(typeof parseInt(el.hex.slice(1)), "number")
  })
  it("check colorChange event", async () => {
    const el = fixtureSync(tag)
    setTimeout(() => el.setAttribute("hue", "200"))
    const event = await oneEvent(document.body, "colorChange")
    assert(typeof parseInt(event.detail.hex.slice(1)), "number")
  })
})
