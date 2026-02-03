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
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePredictionMarket } from "@/hooks/usePredictionMarket";

export default function Home() {
  const { publicKey, connected } = useWallet();
  const { getAllMarkets } = usePredictionMarket();

  const [markets, setMarkets] = useState<Market[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (connected) {
      loadMarkets();
    }
  }, [connected]);

  const loadMarkets = async () => {
    setIsLoading(true);
    try {
      const fetchedMarkets = await getAllMarkets();
      setMarkets(fetchedMarkets);
      console.log("Markets loaded:");
    } catch (error) {
      console.error("Error loading markets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMarket = async (newMarket: Omit<Market, "id">) => {
    const marketWithId: Market = {
      id: crypto.randomUUID(),
      ...newMarket,
    };

    setMarkets((prev) => [marketWithId, ...prev]);
    await loadMarkets();
    setShowCreateModal(false);
  };

  const handleTrade = async (
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
    await loadMarkets();
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
                P
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
