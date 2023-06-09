import { Retired as RetiredEvent } from "../generated/Retirements/Retirements"
import { Retired } from "../generated/schema"

export function handleRetired(event: RetiredEvent): void {
  let entity = new Retired(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.retiree = event.params.retiree
  entity.token = event.params.token
  entity.tcoAmount = event.params.tcoAmount
  entity.usdcAmount = event.params.usdcAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
