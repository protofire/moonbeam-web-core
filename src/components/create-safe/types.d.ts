import type { BigNumber } from 'ethers'

export type NamedAddress = {
  name: string
  address: string
  ens?: string
}

export type SafeFormData = NamedAddress & {
  threshold: number
  owners: NamedAddress[]
}

export type PendingSafeTx = {
  data: string
  from: string
  nonce: number
  to: string
  value: BigNumber
  startBlock: number
}

export type PendingSafeData = SafeFormData & {
  txHash?: string
  tx?: PendingSafeTx
  safeAddress?: string
  saltNonce: number
}

export type PendingSafeByChain = Record<string, PendingSafeData | undefined>
