"use client";
import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useSync } from "@/context/syncContext";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      size={{ width: 600, height: 280 }}
      containerRef={containerRef}
    >
      <div className="w-full max-w-sm text-foreground">
        <div className="flex items-center w-full pt-[20px] pb-[10px]">
          <div
            className="text-primary text-heading whitespace-nowrap
"
          >
            État du système
          </div>

          {state ? (
            <div
              className={`text-[24px] ml-[20px] font-semibold px-[15px] py-[3px] rounded-[25px] border-[1px] ${
                state.isActive
                  ? "text-[#00FFAA] border-[#00FFAA] bg-transparent" +
                    " shadow-[0_0_8px_#00FFAA] [filter:drop-shadow(0_0_1px_#00FFAA)] [text-shadow:0_0_1px_#00FFAA]"
                  : "text-[#FF5C5C] border-[#FF5C5C] bg-transparent"
              }`}
            >
              {state.isActive ? "Actif" : "Inactif"}
            </div>
          ) : (
            <div className="text-[24px] text-muted font-semibold">
              Chargement...
            </div>
          )}
          <div className="bg-background border-default rounded ml-[20px] box-border flex items-center gap-[8px] text-heading text-primary pl-[10px] pr-[10px]">
            <History className="text-gold" size={34} />
            {syncing ? "XX:XX" : `${timeLeft}`}
          </div>
        </div>

        <div className="grid grid-cols-2 mt-[10px]">
          <CardCrypto
            total={state?.nbrCrypto}
            on={state?.nbrCryptoOn}
            off={state?.nbrCryptoOff}
          />
          <Card label="Gain total" value={state?.totalGain} isDollar />
        </div>
        <div className="text-right pt-[10px]">
          <span
            onClick={() => router.push("/dashboard")}
            className="text-cyan cursor-pointer hover:brightness-150 transition duration-200"
          >
            Voir tout
          </span>
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
    <div className="bg-background border-default rounded pl-[15px] pr-[15px] pt-[18px] pb-[20px] ml-[20px] box-border">
      <div className="w-fit mx-auto text-left">
        <div className="text-gold text-heading">{label}</div>
        <div className="text-monney text-[40px]">
          {value !== undefined
            ? isDollar
              ? `$${value.toFixed(2)}`
              : value
            : "-"}
        </div>
      </div>
    </div>
  );
}

function CardCrypto({
  total,
  on,
  off,
}: {
  total: number | undefined;
  on: number | undefined;
  off: number | undefined;
}) {
  return (
    <div className="bg-background border-default rounded pl-[15px] pr-[15px] pt-[18px] pb-[20px] mr-[20px] box-border">
      <div className="text-heading w-fit mx-auto text-left">
        <div className="pb-[5px]">
          <span className="text-purple">Cryptos :</span>{" "}
          <span className="text-pink">{total ?? "-"}</span>
        </div>
        <div className="">
          <span className="text-cyan">Ratio :</span>{" "}
          <span className="text-[#00ff88]">{on ?? "-"}</span>/
          <span className="text-[#ff5e5e]">{off ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}
