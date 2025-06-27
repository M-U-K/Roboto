"use client";
import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useRouter } from "next/navigation";
import { useSync } from "@/context/syncContext";

type Wallet = {
  totalValue: number;
  potOn: number;
  potOff: number;
  cash: number;
  security: number;
  USDC: number;
};

export default function SoldeGlobal({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const { lastSync } = useSync();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch("/api/wallet");
        const data = await res.json();
        setWallet(data);
      } catch (error) {
        console.error("Erreur fetch wallet", error);
      }
    };

    fetchWallet();
  }, [lastSync]);

  if (!wallet) {
    return <div>Chargement...</div>;
  }

  return (
    <BlockWrapper
      defaultPosition={{ x: 440, y: 20 }}
      size={{ width: 400, height: 450 }}
      containerRef={containerRef}
    >
      <div className="w-full max-w-sm text-foreground">
        <div className="text-primary text-heading pt-[20px]">Solde Global</div>
        <div className="text-monney pb-[10px]">
          ${wallet.totalValue.toFixed(2)}
        </div>

        <div className="grid grid-cols-2">
          <Card
            label="Pot actif"
            value={wallet.potOn}
            color="text-pink text-body"
          />
          <Card
            label="Pot inactif"
            value={wallet.potOff}
            color="text-purple text-body"
          />
          <Card
            label="Sécurité"
            value={wallet.security}
            color="text-cyan text-body"
          />
          <Card label="Cash" value={wallet.cash} color="text-gold text-body" />
        </div>

        <div className="text-right">
          <div className="w-auto">
            <div
              onClick={() => router.push("/dashboard")}
              className="inline cursor-pointer text-cyan hover:brightness-150 transition duration-200 pb-[10px]"
            >
              Voir tout
            </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-background border-default rounded pl-[15px] pr-[15px] mb-[10px] w-[160px] box-border">
      <div className={`${color} pt-[18px]`}>{label}</div>{" "}
      <div className="text-monney font-bold pb-[20px]">${value.toFixed(2)}</div>
    </div>
  );
}
