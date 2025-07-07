"use client";
import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useRouter } from "next/navigation";
import { useSync } from "@/contexts/syncContext";

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
  const { activateSync, syncCount } = useSync(); // 🔄 syncCount déclenche les maj

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch("/api/public/wallet");
        const data = await res.json();
        setWallet(data);
      } catch (error) {
        console.error("Erreur fetch wallet", error);
      }
    };

    fetchWallet();
  }, [syncCount]);

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
        <div className="flex justify-between items-end pt-[20px]">
          <div>
            <div className="text-primary text-heading">Solde Global</div>
            <div className="text-monney pb-[10px]">
              ${wallet.totalValue.toFixed(2)}
            </div>
          </div>
          <div className="">
            <div className="text-gold text-body pb-[3px]">Banque</div>
            <div className="text-monney pb-[10px]">
              ${wallet.USDC.toFixed(2)}
            </div>
          </div>
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
            {/*
            <div
              onClick={() => router.push("/dashboard")}
              className="inline cursor-pointer text-cyan hover:brightness-150 transition duration-200 pb-[10px]"
            >
              Voir tout
            </div>
            */}
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
