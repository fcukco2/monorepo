import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Retired } from "../generated/schema"
import { Retired as RetiredEvent } from "../generated/Retirements/Retirements"
import { handleRetired } from "../src/retirements"
import { createRetiredEvent } from "./retirements-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let retiree = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let tcoAmount = BigInt.fromI32(234)
    let usdcAmount = BigInt.fromI32(234)
    let newRetiredEvent = createRetiredEvent(
      retiree,
      token,
      tcoAmount,
      usdcAmount
    )
    handleRetired(newRetiredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Retired created and stored", () => {
    assert.entityCount("Retired", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Retired",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "retiree",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Retired",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Retired",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tcoAmount",
      "234"
    )
    assert.fieldEquals(
      "Retired",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "usdcAmount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
