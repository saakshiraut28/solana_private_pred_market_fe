import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import idl from "./solana_private_prediction_market.json";
import { PROGRAM_ID, RPC_ENDPOINT } from "./constants";
import { Anchor } from "lucide-react";

export function getProgram(wallet: any, connection: any) {
    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });
    const program = new Program(
        idl as any, provider
    );
    return program;
}