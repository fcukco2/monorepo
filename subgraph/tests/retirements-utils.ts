import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { Retired } from "../generated/Retirements/Retirements"

export function createRetiredEvent(
  retiree: Address,
  token: Address,
  tcoAmount: BigInt,
  usdcAmount: BigInt
): Retired {
  let retiredEvent = changetype<Retired>(newMockEvent())

  retiredEvent.parameters = new Array()

  retiredEvent.parameters.push(
    new ethereum.EventParam("retiree", ethereum.Value.fromAddress(retiree))
  )
  retiredEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  retiredEvent.parameters.push(
    new ethereum.EventParam(
      "tcoAmount",
      ethereum.Value.fromUnsignedBigInt(tcoAmount)
    )
  )
  retiredEvent.parameters.push(
    new ethereum.EventParam(
      "usdcAmount",
      ethereum.Value.fromUnsignedBigInt(usdcAmount)
    )
  )

  return retiredEvent
}
