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

        if (isNaN(liquidityInSol) || liquidityInSol <= 0) {
            throw new Error("Invalid liquidity amount");
        }
        if (isNaN(endTime) || endTime <= 0) {
            throw new Error("Invalid end time");
        }

        const liquidity = new BN(liquidityInSol * 1e9);
        const endTimeBn = new BN(endTime);

        const [marketPda, marketBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("market"), wallet.publicKey.toBuffer(),],
            program.programId
        );

        const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault"), marketPda.toBuffer(),],
            program.programId
        )

        console.log("creating market with PDA:", marketPda.toString());
        console.log("vault PDA:", vaultPda.toBase58());

        const tx = await program.methods
            .createMarket(question, liquidity, endTimeBn)
            .accounts({
                market: marketPda,
                vault: vaultPda,
                creator: wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        return { tx, marketId: marketPda.toString() };

    };

    const placeBet = async (marketId: string, amountInSol: number, isYes: boolean) => {
        if (!wallet.publicKey) throw new Error("Wallet not connected");

        const marketPubkey = new PublicKey(marketId);
        const amount = new BN(amountInSol * 1e9);

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                marketPubkey.toBuffer(),
            ],
            program.programId
        )

        const [userPositionPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("user_position"),
                marketPubkey.toBuffer(),
                wallet.publicKey.toBuffer(),
            ],
            program.programId
        );

        console.log("Placing bet on market:", marketPubkey.toString());
        console.log("User position PDA:", userPositionPda.toString());

        const tx = await program.methods
            .placeBet(amount, isYes)
            .accounts({
                market: marketPubkey,
                user: wallet.publicKey,
                userPosition: userPositionPda,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        return tx;
    };

    return { createMarket, placeBet };
}