"use client";
import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useRouter } from "next/navigation";

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
  }, []);

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
          <Card label="Pot actif" value={wallet.potOn} />
          <Card label="Pot inactif" value={wallet.potOff} />
          <Card label="Cash" value={wallet.cash} />
          <Card label="Sécurité" value={wallet.security} />
        </div>

        <div className="text-right">
          <div className="mt-[10px] w-auto">
            <div
              onClick={() => router.push("/dashboard")}
              className="inline cursor-pointer text-cyan hover:brightness-150 transition duration-200"
            >
              Voir tout
            </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background border-default rounded pl-[15px] pr-[15px] mb-[20px] w-[160px] box-border">
      <div className="text-pink pt-[18px]">{label}</div>
      <div className="text-monney font-bold pb-[20px]">${value.toFixed(2)}</div>
    </div>
  );
}
