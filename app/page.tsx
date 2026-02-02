/** @format */

"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MarketList from "@/components/market-list";
import CreateMarketModal from "@/components/create-market-modal";
import TradeModal from "@/components/trade-modal";
import type { Market } from "@/types";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePredictionMarket } from "@/hooks/usePredictionMarket";

export default function Home() {
  const { publicKey, connected } = useWallet();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);

  useEffect(() => {
    setMarkets([
      {
        id: "1",
        title: "Will BTC exceed $100k by Q2 2025?",
        description: "Bitcoin price prediction",
        yesPrice: 0.65,
        noPrice: 0.35,
        totalVolume: 150000,
        liquidity: 25000,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        creator: "Creator1",
      },
      {
        id: "2",
        title: "Will SOL reach $50 by end of 2025?",
        description: "Solana price prediction",
        yesPrice: 0.58,
        noPrice: 0.42,
        totalVolume: 89000,
        liquidity: 18000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        creator: "Creator2",
      },
      {
        id: "3",
        title: "Will Ethereum 2.0 staking rewards exceed 5%?",
        description: "ETH staking prediction",
        yesPrice: 0.72,
        noPrice: 0.28,
        totalVolume: 210000,
        liquidity: 42000,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        creator: "Creator3",
      },
    ]);
  }, []);

  const handleCreateMarket = (newMarket: Omit<Market, "id">) => {
    const marketWithId: Market = {
      id: crypto.randomUUID(), // temp frontend id
      ...newMarket,
    };

    setMarkets((prev) => [marketWithId, ...prev]);
    setShowCreateModal(false);
  };


  const handleTrade = (
    marketId: string,
    side: "yes" | "no",
    amount: number,
  ) => {
    const updatedMarkets = markets.map((m) => {
      if (m.id === marketId) {
        const adjustment = amount / 100000;
        if (side === "yes") {
          return {
            ...m,
            yesPrice: Math.min(0.99, m.yesPrice + adjustment),
            noPrice: Math.max(0.01, m.noPrice - adjustment),
          };
        } else {
          return {
            ...m,
            yesPrice: Math.max(0.01, m.yesPrice - adjustment),
            noPrice: Math.min(0.99, m.noPrice + adjustment),
          };
        }
      }
      return m;
    });
    setMarkets(updatedMarkets);
    setShowTradeModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                Ω
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground">PredictMarket</h1>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!connected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <Card className="p-12 text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                Connect your Solana wallet to start predicting and trading
              </p>
              <WalletMultiButton />
            </Card>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Input placeholder="Search markets..." className="flex-1" />
              <Button
                onClick={() => setShowCreateModal(true)}
                className="md:w-auto"
              >
                Create Market
              </Button>
            </div>

            {/* Markets Grid */}
            <MarketList
              markets={markets}
              onSelectMarket={(market) => {
                setSelectedMarket(market);
                setShowTradeModal(true);
              }}
            />
          </>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateMarketModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMarket}
        />
      )}

      {selectedMarket && showTradeModal && (
        <TradeModal
          market={selectedMarket}
          onClose={() => {
            setShowTradeModal(false);
            setSelectedMarket(null);
          }}
          onTrade={handleTrade}
        />
      )}
    </div>
  );
}
