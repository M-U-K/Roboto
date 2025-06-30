"use client";

import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useSync } from "@/context/syncContext";
import { useRouter } from "next/navigation";

type Crypto = {
  symbol: string;
  totalHoldings: number;
  pot: number;
  gainLossPct: number;
  currentPrice: number;
  lastBuyPrice: number;
  lastSellPrice: number | null;
  sellAt: number;
  buyTrigger: number;
  status: string;
};

export default function CryptoTable({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const router = useRouter();

  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { lastSync, triggerSync } = useSync();

  useEffect(() => {
    fetch("/api/crypto")
      .then((res) => res.json())
      .then((data) => setCryptos(data));
  }, [lastSync]);

  return (
    <BlockWrapper
      containerRef={containerRef}
      defaultPosition={{ x: 860, y: 20 }}
      size={{ width: 950, height: 350 }}
    >
      <div className="text-heading text-primary  pt-[20px]">
        Liste des cryptomonnaies
      </div>

      <div className="bg-background border-default rounded p-[10px] mt-[20px]">
        <div className="flex flex-col space-y-[20px] text-sm w-full p-[10px]">
          {/* Header */}
          <div className="grid grid-cols-10 text-left text-body font-semibold px-3">
            <div>Crypto</div>
            <div>Valeur</div>
            <div>Pot</div>
            <div>Gain %</div>
            <div>Vente</div>
            <div>Trigger</div>
            <div>État</div>
            <div>Actions</div>
          </div>

          {/* Body */}
          {cryptos.map((c) => (
            <div
              key={c.symbol}
              className="grid grid-cols-10 items-center text-body rounded px-3 py-2 relative"
            >
              <div>{c.symbol}</div>
              <div>{formatMoney(c.totalHoldings)}</div>
              <div>{formatMoney(c.pot)}</div>
              <div className={c.gainLossPct >= 0 ? "text-gain" : "text-loss"}>
                {formatPct(c.gainLossPct)}
              </div>
              <div>{formatMoney(c.sellAt)}</div>
              <div>{c.buyTrigger > 0 ? c.buyTrigger : "-"}</div>
              <div>{c.status === "pending-buy" ? "Achat" : "Vente"}</div>
              <div className="relative">
                <span
                  className="text-gold cursor-pointer"
                  onClick={() =>
                    setOpenMenu((prev) => (prev === c.symbol ? null : c.symbol))
                  }
                >
                  ⋯
                </span>
                {openMenu === c.symbol && (
                  <div className="absolute right-0 mt-2 w-[120px] bg-background border border-white/20 p-[10px] shadow z-10 rounded">
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
                        } finally {
                          setOpenMenu(null);
                        }
                      }}
                    >
                      Acheter 10$
                    </div>
                    {c.totalHoldings > 1 && (
                      <div
                        className={`px-3 py-2 ${
                          c.status !== "pending-sell"
                            ? "text-white/30 cursor-not-allowed"
                            : "hover:bg-white/10 text-red-400 cursor-pointer"
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
                              alert(data.error || "Erreur lors de la vente.");
                              return;
                            }
                            triggerSync();
                            setOpenMenu(null);
                          } catch (_err) {
                            alert("Erreur réseau.");
                          }
                        }}
                      >
                        Vendre
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-right pt-[10px]">
        <span
          onClick={() => router.push("/dashboard")}
          className="text-cyan cursor-pointer hover:brightness-150 transition duration-200"
        >
          Voir tout
        </span>
      </div>
    </BlockWrapper>
  );
}

function formatMoney(val: number) {
  return `${val.toFixed(1)} $`;
}
function formatPct(val: number) {
  const sign = val > 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}
function formatNumber(val: number) {
  return `${val.toFixed(0)} $`;
}
