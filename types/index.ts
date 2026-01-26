export interface Market {
    id: string
    title: string
    description: string
    yesPrice: number // 0-1, probability
    noPrice: number // 0-1, probability
    totalVolume: number // in lamports
    liquidity: number // in lamports
    expiresAt: Date
    creator: string // pubkey
}

export interface Trade {
    marketId: string
    side: 'yes' | 'no'
    amount: number
    price: number
    timestamp: Date
}

export interface UserPosition {
    marketId: string
    yesBal: number
    noBal: number
}
