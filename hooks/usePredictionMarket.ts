import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "@/lib/program";

export function usePredictionMarket() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const program = getProgram(wallet, connection);

    const createMarket = async (question: string, liquidity: number, endTime: number) => {
        const tx = await program.methods.createMarket(question, liquidity, endTime).rpc();
        return tx;
    }

    const placeBet = async (marketId: string, amount: number, isYes: boolean) => {
        const tx = await program.methods.placeBet(marketId, amount, isYes).rpc();
        return tx;
    }

    return { createMarket, placeBet };
}