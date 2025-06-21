"use client";
import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";

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

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/state");
        const data = await res.json();
        setState(data);
      } catch (error) {
        console.error("Erreur fetch state", error);
      }
    };

    fetchState();
  }, []);

  if (!state) {
    return <div>Chargement...</div>;
  }

  return (
    <BlockWrapper
      defaultPosition={{ x: 440, y: 20 }}
      size={{ width: 400, height: 450 }}
      containerRef={containerRef}
    >
      <div className="w-full max-w-sm text-foreground">
        <div className="text-primary text-heading pt-[20px]">État Système</div>
        <div className="text-monney pb-[10px]">
          {state.isActive ? "✅ Actif" : "⛔ Inactif"}
        </div>

        <div className="grid grid-cols-2">
          <Card label="Cryptos totales" value={state.nbrCrypto} />
          <Card label="En gain" value={state.nbrCryptoOn} />
          <Card label="En perte" value={state.nbrCryptoOff} />
          <Card label="Gain total" value={state.totalGain} isDollar />
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
  value: number;
  isDollar?: boolean;
}) {
  return (
    <div className="bg-background border-default rounded pl-[15px] pr-[15px] mb-[20px] w-[160px] box-border">
      <div className="text-pink pt-[18px]">{label}</div>
      <div className="text-monney font-bold pb-[20px]">
        {isDollar
          ? value !== undefined
            ? `$${value.toFixed(2)}`
            : "-"
          : value ?? "-"}
      </div>
    </div>
  );
}
