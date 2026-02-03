/** @format */

"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import type { Market } from "@/types";

import { usePredictionMarket } from "@/hooks/usePredictionMarket";

interface TradeModalProps {
  market: Market;
  onClose: () => void;
  onTrade: (marketId: string, side: "yes" | "no", amount: number) => void;
}

export default function TradeModal({
  market,
  onClose,
  onTrade,
}: TradeModalProps) {
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { placeBet } = usePredictionMarket();

  const orderPrice = side === "yes" ? market.yesPrice : market.noPrice;
  const orderCost = Number(amount) * orderPrice || 0;
  const sharePrice =
    side === "yes"
      ? `$${(market.yesPrice * 100).toFixed(2)}`
      : `$${(market.noPrice * 100).toFixed(2)}`;

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tx = await placeBet(market.id, Number(amount), side === "yes");
      console.log("Transaction successful:", tx);

      onTrade(market.id, side, Number(amount));
      onClose();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Trade</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Market Info */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="font-semibold text-foreground mb-1">{market.title}</h3>
          <p className="text-sm text-muted-foreground">{market.description}</p>
        </div>

        {/* Trade Form */}
        <form onSubmit={handleTrade} className="px-6 pb-6 space-y-4">
          {/* Side Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSide("yes")}
              className={`p-4 rounded-lg border-2 transition-colors ${
                side === "yes"
                  ? "border-yes/50"
                  : "border-border hover:border-yes/30"
              }`}
              style={{
                backgroundColor: side === "yes" ? "var(--yes)" : "transparent",
                opacity: side === "yes" ? 1 : 1,
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp
                  className="w-5 h-5"
                  style={{ color: side === "yes" ? "white" : "var(--yes)" }}
                />
                <span
                  className="font-semibold"
                  style={{ color: side === "yes" ? "white" : "var(--yes)" }}
                >
                  YES
                </span>
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: side === "yes" ? "white" : "var(--yes)" }}
              >
                ${(market.yesPrice * 100).toFixed(0)}
              </div>
              <div
                className="text-xs"
                style={{
                  color:
                    side === "yes"
                      ? "rgba(255,255,255,0.7)"
                      : "var(--muted-foreground)",
                }}
              >
                {(market.yesPrice * 100).toFixed(1)}% probability
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSide("no")}
              className={`p-4 rounded-lg border-2 transition-colors ${
                side === "no"
                  ? "border-no/50"
                  : "border-border hover:border-no/30"
              }`}
              style={{
                backgroundColor: side === "no" ? "var(--no)" : "transparent",
                opacity: side === "no" ? 1 : 1,
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown
                  className="w-5 h-5"
                  style={{ color: side === "no" ? "white" : "var(--no)" }}
                />
                <span
                  className="font-semibold"
                  style={{ color: side === "no" ? "white" : "var(--no)" }}
                >
                  NO
                </span>
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: side === "no" ? "white" : "var(--no)" }}
              >
                ${(market.noPrice * 100).toFixed(0)}
              </div>
              <div
                className="text-xs"
                style={{
                  color:
                    side === "no"
                      ? "rgba(255,255,255,0.7)"
                      : "var(--muted-foreground)",
                }}
              >
                {(market.noPrice * 100).toFixed(1)}% probability
              </div>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount (SOL)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Order Summary */}
          {amount && (
            <Card className="p-4 bg-muted/30">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Share Price:</span>
                  <span className="font-semibold">{sharePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shares:</span>
                  <span className="font-semibold">{amount}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="text-foreground font-semibold">
                    Total Cost:
                  </span>
                  <span className="font-bold text-lg">
                    ${orderCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !amount || Number(amount) <= 0}
            >
              {isLoading ? "Placing Order..." : `Buy ${side.toUpperCase()}`}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
