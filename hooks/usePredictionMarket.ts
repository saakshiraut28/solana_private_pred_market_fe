import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "@/lib/program";

export function usePredictionMarket() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const createMarket = async (question: string, liquidity: number, endTime: number) => {
        const program = getProgram(wallet, connection);

        const tx = await program.methods.createMarket(question, liquidity, endTime).rpc();
        return tx;
    }

    return { createMarket };
}