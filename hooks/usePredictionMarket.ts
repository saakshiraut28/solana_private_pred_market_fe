import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN, web3 } from "@coral-xyz/anchor";
import { getProgram } from "@/lib/program";

export function usePredictionMarket() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const program = getProgram(wallet, connection);

    const createMarket = async (question: string, liquidityInSol: number, endTime: number) => {
        if (!wallet.publicKey) throw new Error("Wallet not connected");

        const liquidity = new BN(liquidityInSol * 1e9);
        const endTimeBn = new BN(endTime);

        const marketKeypair = web3.Keypair.generate();

        const tx = await program.methods
            .createMarket(question, liquidity, endTimeBn)
            .accounts({
                market: marketKeypair.publicKey,
                creator: wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([marketKeypair])
            .rpc();

        return { tx, marketId: marketKeypair.publicKey.toString() };
    };

    const placeBet = async (marketId: string, amountInSol: number, isYes: boolean) => {
        if (!wallet.publicKey) throw new Error("Wallet not connected");

        const marketPubkey = new PublicKey(marketId);
        const amount = new BN(amountInSol * 1e9);

        const [userPosition] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("user_position"),
                marketPubkey.toBuffer(),
                wallet.publicKey.toBuffer(),
            ],
            program.programId
        );

        const tx = await program.methods
            .placeBet(amount, isYes)
            .accounts({
                market: marketPubkey,
                user: wallet.publicKey,
                userPosition: userPosition,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        return tx;
    };

    return { createMarket, placeBet };
}