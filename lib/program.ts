import { Program, AnchorProvider } from "@coral-xyz/anchor";
import idl from "./solana_private_prediction_market.json";

export function getProgram(wallet: any, connection: any) {
    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });
    const program = new Program(
        idl as any, provider
    );
    return program;
}