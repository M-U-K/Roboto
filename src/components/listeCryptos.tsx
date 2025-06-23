"use client";

import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useSync } from "@/context/syncContext";

type Crypto = {
  symbol: string;
  totalHoldings: number;
  pot: number;
  gainLossPct: number;
  currentPrice: number;
  lastBuyPrice: number;
  lastSellPrice: number | null;
  sellAt: number | null;
  buyTrigger: number;
  status: string;
};

export default function CryptoTable({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const { lastSync } = useSync();

  useEffect(() => {
    fetch("/api/crypto")
      .then((res) => res.json())
      .then((data) => setCryptos(data))
      .catch((err) => console.error("Erreur fetch cryptos :", err));
  }, [lastSync]);

  return (
    <BlockWrapper
      containerRef={containerRef}
      defaultPosition={{ x: 860, y: 20 }}
      size={{ width: 950, height: 350 }}
    >
      <div className="text-heading text-[20px] text-purple font-semibold pb-4">
        Liste des cryptomonnaies
      </div>

      <div className="rounded border border-purple p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/70">
              <th>Crypto</th>
              <th>Valeur</th>
              <th>Pot</th>
              <th>Gain %</th>
              <th>Actuel</th>
              <th>Prix achat</th>
              <th>Prix vente</th>
              <th>Trigger</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((c) => (
              <tr
                key={c.symbol}
                className="text-white border-t border-white/10"
              >
                <td>{c.symbol}</td>
                <td>{formatMoney(c.totalHoldings)}</td>
                <td>{formatMoney(c.pot)}</td>
                <td
                  className={
                    c.gainLossPct >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {formatPct(c.gainLossPct)}
                </td>
                <td>{formatNumber(c.currentPrice)}</td>
                <td>
                  {c.lastBuyPrice > 0 ? formatNumber(c.lastBuyPrice) : "-"}
                </td>
                <td>{c.lastSellPrice ? formatNumber(c.lastSellPrice) : "-"}</td>
                <td>{c.buyTrigger > 0 ? c.buyTrigger : "-"}</td>
                <td>{c.status === "pending-buy" ? "Achat" : "Vente"}</td>
                <td>
                  <span className="text-yellow-300">⋯</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right pt-4 text-cyan cursor-pointer hover:brightness-125">
          Voir tout
        </div>
      </div>
    </BlockWrapper>
  );
}

function formatMoney(val: number) {
  return `${val.toFixed(2)} $`;
}
function formatPct(val: number) {
  const sign = val > 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}
function formatNumber(val: number) {
  return val.toLocaleString();
}
