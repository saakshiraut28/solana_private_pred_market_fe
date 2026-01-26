/** @format */

"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import type { Market } from "@/types";

interface CreateMarketModalProps {
  onClose: () => void;
  onCreate: (market: Omit<Market, "id">) => void;
}

export default function CreateMarketModal({
  onClose,
  onCreate,
}: CreateMarketModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [daysToExpire, setDaysToExpire] = useState("30");
  const [initialLiquidity, setInitialLiquidity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newMarket: Omit<Market, "id"> = {
        title,
        description,
        yesPrice: 0.5,
        noPrice: 0.5,
        totalVolume: 0,
        liquidity: Number(initialLiquidity) || 10000,
        expiresAt: new Date(
          Date.now() + Number(daysToExpire) * 24 * 60 * 60 * 1000,
        ),
        creator: "user", // Replace with actual user pubkey
      };

      onCreate(newMarket);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-border"
          style={{ borderBottomColor: "var(--yes)", opacity: 0.3 }}
        >
          <h2 className="text-xl font-bold">Create Market</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Market Title
            </label>
            <Input
              placeholder="Will BTC exceed $100k?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <Input
              placeholder="Bitcoin price prediction"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Days to Expire
              </label>
              <Input
                type="number"
                min="1"
                placeholder="30"
                value={daysToExpire}
                onChange={(e) => setDaysToExpire(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Initial Liquidity (SOL)
              </label>
              <Input
                type="number"
                min="1"
                placeholder="10"
                value={initialLiquidity}
                onChange={(e) => setInitialLiquidity(e.target.value)}
                required
              />
            </div>
          </div>

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
              disabled={isLoading || !title || !description}
            >
              {isLoading ? "Creating..." : "Create Market"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}