"use client";
import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useSync } from "@/context/syncContext";

type State = {
  isActive: number;
  nbrCrypto: number;
  nbrCryptoOn: number;
  nbrCryptoOff: number;
  totalGain: number;
};

export default function EtatSysteme({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [state, setState] = useState<State | null>(null);
  const [timeLeft, setTimeLeft] = useState("05:00");

  const { lastSync, syncing } = useSync();

  useEffect(() => {
    const fetchState = async () => {
      const res = await fetch("/api/state");
      const data = await res.json();
      setState(data);
    };

    fetchState();
  }, [lastSync]);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = 300_000 - (Date.now() - lastSync);
      const remaining = Math.max(0, delta);
      const minutes = Math.floor(remaining / 60000)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((remaining % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      setTimeLeft(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSync]);

  return (
    <BlockWrapper
      defaultPosition={{ x: 440, y: 20 }}
      size={{ width: 400, height: 450 }}
      containerRef={containerRef}
    >
      <div className="w-full max-w-sm text-foreground">
        <div className="text-primary text-heading pt-[20px]">État Système</div>

        <div className="text-monney pb-[10px]">
          {state
            ? state.isActive
              ? "✅ Actif"
              : "⛔ Inactif"
            : "Chargement..."}
        </div>

        {syncing ? (
          <div className="text-sm text-muted pb-4">🔄 Sync en cours...</div>
        ) : (
          <div className="text-sm text-muted pb-4">
            ⏱ Prochaine sync : {timeLeft}
          </div>
        )}

        <div className="grid grid-cols-2">
          <Card label="Cryptos totales" value={state?.nbrCrypto} />
          <Card label="En gain" value={state?.nbrCryptoOn} />
          <Card label="En perte" value={state?.nbrCryptoOff} />
          <Card label="Gain total" value={state?.totalGain} isDollar />
        </div>
      </div>
    </BlockWrapper>
  );
}

function Card({
  label,
  value,
  isDollar = false,
}: {
  label: string;
  value: number | undefined;
  isDollar?: boolean;
}) {
  return (
    <div className="bg-background border-default rounded pl-[15px] pr-[15px] mb-[20px] w-[160px] box-border">
      <div className="text-pink pt-[18px]">{label}</div>
      <div className="text-monney font-bold pb-[20px]">
        {value !== undefined
          ? isDollar
            ? `$${value.toFixed(2)}`
            : value
          : "-"}
      </div>
    </div>
  );
}
