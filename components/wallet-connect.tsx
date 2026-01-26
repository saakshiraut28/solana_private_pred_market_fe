/** @format */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface WalletConnectProps {
  connected: boolean;
  publicKey: string | null;
  onConnect: (pubKey: string) => void;
}

export default function WalletConnect({
  connected,
  publicKey,
  onConnect,
}: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Mock wallet connection
      // In production, use @solana/wallet-adapter-react and @solana/wallet-adapter-wallets
      const mockPubKey = `${Math.random().toString(36).slice(2, 15)}...${Math.random().toString(36).slice(2, 8)}`;
      onConnect(mockPubKey);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (connected && publicKey) {
    return (
      <Button variant="outline" disabled>
        {publicKey}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
