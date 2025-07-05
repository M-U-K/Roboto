"use client";
import { useEffect, useState } from "react";
import BlockWrapper from "./blockWrapper";
import { useRouter } from "next/navigation";
import { useSync } from "@/contexts/syncContext";

type TriggerLog = {
  symbol: string;
  delta: number;
  newScore: number;
};

type TriggerData = {
  volatility: number;
  highCount: number;
  log: TriggerLog[];
};

export default function TriggerPanel({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const router = useRouter();
  const [trigger, setTrigger] = useState<TriggerData | null>(null);
  const { lastSync } = useSync();

  useEffect(() => {
    const fetchTrigger = async () => {
      try {
        const res = await fetch("/api/trigger");
        const data = await res.json();
        setTrigger(data);
      } catch (error) {
        console.error("Erreur fetch trigger", error);
      }
    };

    fetchTrigger();
  }, [lastSync]);

  if (!trigger) {
    return <div>Chargement...</div>;
  }

  return (
    <BlockWrapper
      defaultPosition={{ x: 20, y: 20 }}
      size={{ width: 400, height: 450 }}
      containerRef={containerRef}
    >
      <div className="w-full max-w-sm text-foreground">
        <div className="flex justify-between items-end mt-[20px] mb-[20px]">
          <div>
            <div className="text-primary text-heading">Trigger</div>
          </div>
          <div
            className="text-[24px] text-gold font-semibold px-[15px] py-[6px] rounded-[25px] border-[1px] 
  border-gold bg-transparent inline-block 
  shadow-[0_0_8px_#faff56] [filter:drop-shadow(0_0_1px_#faff56)] 
  [text-shadow:0_0_1px_#faff56]"
          >
            Volatilité à {trigger.volatility}
          </div>
        </div>

        <div className="text-heading text-cyan pb-[10px] text-center w-full mb-[20px]">
          {trigger.highCount} cryptos à BuyT - 1
        </div>

        <div className="bg-background border-default rounded box-border pl-[20px] mb-[10px]">
          <div className="text-pink text-heading mb-[10px]">Log</div>
          {trigger.log.map((entry, i) => (
            <div key={i} className="text-body mb-[8px]">
              - {entry.symbol}{" "}
              <span className={entry.delta >= 0 ? "text-gain" : "text-loss"}>
                {entry.delta >= 0 ? "+" : ""}
                {entry.delta}
              </span>
              , maintenant à
              <span className={entry.newScore >= 0 ? "text-gain" : "text-loss"}>
                {" "}
                {entry.newScore >= 0 ? "+" : ""} {entry.newScore}
              </span>
            </div>
          ))}
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
