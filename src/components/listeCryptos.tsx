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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { lastSync, triggerSync } = useSync();

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
                className="text-white border-t border-white/10 relative"
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
                <td className="relative">
                  <span
                    className="text-yellow-300 cursor-pointer"
                    onClick={() =>
                      setOpenMenu((prev) =>
                        prev === c.symbol ? null : c.symbol
                      )
                    }
                  >
                    ⋯
                  </span>
                  {openMenu === c.symbol && (
                    <div className="absolute right-0 mt-2 w-28 bg-background border border-white/20 rounded shadow z-10">
                      <div
                        className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `/api/trade/buy/${c.symbol}`,
                              {
                                method: "POST",
                              }
                            );
                            const data = await res.json();

                            if (!res.ok) {
                              alert(data.error || "Erreur lors de l'achat.");
                              return;
                            }

                            triggerSync();
                            setOpenMenu(null);
                          } catch (err) {
                            alert("Erreur réseau.");
                          }
                        }}
                      >
                        Acheter 10$
                      </div>
                      {c.totalHoldings > 1 && (
                        <div
                          className={`px-3 py-2 cursor-pointer ${
                            c.status !== "pending-sell"
                              ? "text-white/30 cursor-not-allowed"
                              : "hover:bg-white/10 text-red-400"
                          }`}
                          onClick={async () => {
                            if (c.status !== "pending-sell") return;

                            try {
                              const res = await fetch(
                                `/api/trade/sell/${c.symbol}`,
                                {
                                  method: "POST",
                                }
                              );
                              const data = await res.json();

                              if (!res.ok) {
                                console.error("Erreur vente :", data);
                                alert(data.error || "Erreur lors de la vente.");
                                return;
                              }
                              triggerSync();
                              setOpenMenu(null);
                            } catch (err) {
                              console.error("Erreur fetch :", err);
                              alert("Erreur réseau.");
                            }
                          }}
                        >
                          Vendre
                        </div>
                      )}
                    </div>
                  )}
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
