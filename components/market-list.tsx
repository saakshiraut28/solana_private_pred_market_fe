/** @format */

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import type { Market } from "@/types";

interface MarketListProps {
  markets: Market[];
  onSelectMarket: (market: Market) => void;
}

export default function MarketList({
  markets,
  onSelectMarket,
}: MarketListProps) {
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatDate = (date: Date) => {
    const days = Math.ceil(
      (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days === 1) return "Expires tomorrow";
    if (days <= 7) return `Expires in ${days}d`;
    return `Expires in ${Math.ceil(days / 7)}w`;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {markets.map((market) => (
          <Card
            key={market.id}
            className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => onSelectMarket(market)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {market.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {market.description}
                </p>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yes/10 border border-yes/30 rounded-lg p-4">
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: "var(--yes)" }}
                  >
                    YES
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--yes)" }}
                  >
                    ${(market.yesPrice * 100).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {(market.yesPrice * 100).toFixed(1)}% probability
                  </div>
                </div>
                <div className="bg-no/10 border border-no/30 rounded-lg p-4">
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: "var(--no)" }}
                  >
                    NO
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--no)" }}
                  >
                    ${(market.noPrice * 100).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {(market.noPrice * 100).toFixed(1)}% probability
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Volume</div>
                  <div className="font-semibold text-foreground">
                    ${formatVolume(market.totalVolume)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Liquidity</div>
                  <div className="font-semibold text-foreground">
                    ${formatVolume(market.liquidity)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Expires</div>
                  <div className="font-semibold text-foreground">
                    {formatDate(market.expiresAt)}
                  </div>
                </div>
              </div>

              {/* Trade Button */}
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMarket(market);
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trade
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {markets.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No markets yet. Create one to get started!
          </p>
        </Card>
      )}
    </div>
  );
}
