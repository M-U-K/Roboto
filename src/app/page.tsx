"use client";
import { useEffect, useState } from "react";

type Crypto = {
  id: string;
  symbol: string;
  totalHoldings: number;
  lastBuyPrice: number;
  currentPrice: number;
  gainLossPct: number;
  pot: number;
  sellAt?: number | null;
  lastSellDate?: string | null;
  lastSellPrice?: number | null;
  buyTrigger: number;
  status: string;
};

type TradeEntry = {
  id: string;
  dateBuy: string;
  dateSell: string | null;
  buyPrice: number;
  sellPrice: number;
  gainLoss: number;
  gainLossPct: number;
  reinvested: number;
  secured: number;
  extracted: number;
};

type Wallet = {
  id: string;
  totalValue: number;
  pot: number;
  cash: number;
  security: number;
  USDC: number;
};

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(300);
  const [sortKey, setSortKey] = useState<keyof Crypto | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const formatSmallNumber = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(val)) return "N/A";
    if (val === 0) return "0.00";

    let base = val;
    let multiplier = 0;

    while (base < 0.01) {
      base *= 10;
      multiplier++;
    }

    return `${base.toFixed(2)}${multiplier > 0 ? ` x10^-${multiplier}` : ""}`;
  };

  const formatNumber = (val: unknown) => {
    const num = Number(val);
    if (isNaN(num)) return "-";
    return num.toFixed(2);
  };

  async function fetchData() {
    try {
      setLoading(true);
      const [cryptoRes, walletRes] = await Promise.all([
        fetch("/api/sync"),
        fetch("/api/wallet"),
      ]);
      const cryptoData = await cryptoRes.json();
      const walletData = await walletRes.json();

      const filtered = cryptoData.filter((c: Crypto) => c.symbol !== "USDT");
      setCryptos(filtered);
      setWallet(walletData);
    } catch (e) {
      console.error("Erreur de sync :", e);
    } finally {
      setLoading(false);
      setCountdown(300);
    }
  }

  async function fetchTrades(symbol: string) {
    setSelectedSymbol(symbol);
    const res = await fetch(`/api/crypto/${symbol}/trades`);
    const data = await res.json();
    setTrades(data);
  }

  async function handleSell(symbol: string) {
    const res = await fetch(`/api/trade/sell/${symbol}`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      await fetchData();
    } else {
      alert(data.error || "Erreur lors de la vente");
    }
  }

  async function handleBuy(symbol: string) {
    const res = await fetch(`/api/trade/buy/${symbol}`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      await fetchData();
    } else {
      alert(data.error || "Erreur lors de l'achat");
    }
  }

  function handleSort(key: keyof Crypto) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const sortedCryptos = [...cryptos].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a0033, #0d0d2b)",
        color: "#00ffff",
        padding: "2rem",
        fontFamily: "'Courier New', Courier, monospace",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          fontSize: "1rem",
          color: "#ff00ff",
          backgroundColor: "#220033",
          padding: "0.5rem 1rem",
          borderRadius: "10px",
          boxShadow: "0 0 10px #ff00ff",
        }}
      >
        🔁 Sync dans : {formatTime(countdown)}
      </div>

      <h1
        style={{
          fontSize: "2.5rem",
          color: "#ff00ff",
          textShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff",
          marginBottom: "2rem",
        }}
      >
        ⚡ Portefeuille Binance
      </h1>

      {wallet && (
        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "2rem",
            backgroundColor: "#0f0025",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px #ff00ff55",
          }}
        >
          <div>
            💼 Total: <strong>{formatNumber(wallet.totalValue)} $</strong>
          </div>
          <div>
            🎯 Pot: <strong>{formatNumber(wallet.pot)} $</strong>
          </div>
          <div>
            💵 Cash: <strong>{formatNumber(wallet.cash)} $</strong>
          </div>
          <div>
            🛡️ Sécu: <strong>{formatNumber(wallet.security)} $</strong>
          </div>
          <div>
            🏦 USDC: <strong>{formatNumber(wallet.USDC)} $</strong>
          </div>
        </div>
      )}

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <table style={{ width: "100%", borderSpacing: "0 0.5rem" }}>
          <thead>
            <tr
              style={{ color: "#ff00ff", textAlign: "left", cursor: "pointer" }}
            >
              <th onClick={() => handleSort("symbol")}>Crypto</th>
              <th onClick={() => handleSort("totalHoldings")}>Valeur ($)</th>
              <th onClick={() => handleSort("lastBuyPrice")}>Last Buy</th>
              <th onClick={() => handleSort("currentPrice")}>Current</th>
              <th onClick={() => handleSort("gainLossPct")}>Gain %</th>
              <th onClick={() => handleSort("pot")}>Pot</th>
              <th onClick={() => handleSort("sellAt")}>SellAt</th>
              <th>Dernière vente</th>
              <th>Prix vente</th>
              <th onClick={() => handleSort("buyTrigger")}>BuyTrigger</th>
              <th onClick={() => handleSort("status")}>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCryptos.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #333" }}>
                <td>{c.symbol}</td>
                <td>{formatNumber(c.totalHoldings)} $</td>
                <td>{formatSmallNumber(c.lastBuyPrice)}</td>
                <td>{formatSmallNumber(c.currentPrice)}</td>
                <td style={{ color: c.gainLossPct >= 0 ? "#0f0" : "#f00" }}>
                  {formatNumber(c.gainLossPct)}%
                </td>
                <td>{formatNumber(c.pot)} $</td>
                <td>
                  {c.sellAt !== null && c.sellAt !== undefined
                    ? formatNumber(c.sellAt)
                    : "—"}
                </td>
                <td>
                  {c.lastSellDate
                    ? new Date(c.lastSellDate).toLocaleString()
                    : "—"}
                </td>
                <td>
                  {c.lastSellPrice !== null && c.lastSellPrice !== undefined
                    ? formatNumber(c.lastSellPrice)
                    : "—"}
                </td>
                <td>{c.buyTrigger}</td>
                <td
                  style={{
                    color: c.status === "pending-buy" ? "#0ff" : "#f80",
                  }}
                >
                  {c.status === "pending-buy" ? "📥 Achat" : "📤 Vente"}
                </td>

                <td style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "#ff00ff",
                      color: "#000",
                      padding: "0.3rem 0.6rem",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => fetchTrades(c.symbol)}
                  >
                    Voir
                  </button>
                  {c.symbol !== "USDC" && c.status === "pending-buy" && (
                    <button
                      style={{
                        background: "#00ff88",
                        color: "#000",
                        padding: "0.3rem 0.6rem",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleBuy(c.symbol)}
                    >
                      Acheter (10$)
                    </button>
                  )}
                  {c.symbol !== "USDC" && c.status === "pending-sell" && (
                    <button
                      style={{
                        background: "#ff5555",
                        color: "#000",
                        padding: "0.3rem 0.6rem",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSell(c.symbol)}
                    >
                      Vendre
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedSymbol && (
        <section style={{ marginTop: "3rem" }}>
          <h2 style={{ color: "#ff00ff" }}>📜 Trades pour {selectedSymbol}</h2>
          {trades.length === 0 ? (
            <p>Aucun trade enregistré.</p>
          ) : (
            <table
              style={{
                width: "100%",
                marginTop: "1rem",
                borderSpacing: "0 0.5rem",
              }}
            >
              <thead>
                <tr style={{ color: "#ff00ff", textAlign: "left" }}>
                  <th>Date Achat</th>
                  <th>Date Vente</th>
                  <th>Achat ($)</th>
                  <th>Vente ($)</th>
                  <th>Gain %</th>
                  <th>Gain ($)</th>
                  <th>Reinvesti</th>
                  <th>Sécurité</th>
                  <th>Cash</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.dateBuy).toLocaleString()}</td>
                    <td>
                      {t.dateSell ? new Date(t.dateSell).toLocaleString() : "—"}
                    </td>
                    <td>{formatNumber(t.buyPrice)}</td>
                    <td>{formatNumber(t.sellPrice)}</td>
                    <td style={{ color: t.gainLossPct >= 0 ? "#0f0" : "#f00" }}>
                      {formatNumber(t.gainLossPct)}%
                    </td>
                    <td style={{ color: t.gainLoss >= 0 ? "#0f0" : "#f00" }}>
                      {formatNumber(t.gainLoss)} $
                    </td>
                    <td>{formatNumber(t.reinvested)}</td>
                    <td>{formatNumber(t.secured)}</td>
                    <td>{formatNumber(t.extracted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </main>
  );
}
