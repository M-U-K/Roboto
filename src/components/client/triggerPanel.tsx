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

function getColorClasses(volatility: number) {
  if (volatility <= 2) {
    // Rouge
    return `
      text-[#FF5C5C] border-[#FF5C5C] bg-transparent 
      shadow-[0_0_8px_#FF5C5C] [filter:drop-shadow(0_0_1px_#FF5C5C)] 
      [text-shadow:0_0_1px_#FF5C5C]
    `;
  } else if (volatility === 3) {
    // Orange (couleur actuelle)
    return `
      text-gold border-gold bg-transparent 
      shadow-[0_0_8px_#faff56] [filter:drop-shadow(0_0_1px_#faff56)] 
      [text-shadow:0_0_1px_#faff56]
    `;
  } else {
    // Vert (4 ou 5)
    return `
      text-[#00FFAA] border-[#00FFAA] bg-transparent 
      shadow-[0_0_8px_#00FFAA] [filter:drop-shadow(0_0_1px_#00FFAA)] 
      [text-shadow:0_0_1px_#00FFAA]
    `;
  }
}

export default function TriggerPanel({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const router = useRouter();
  const [trigger, setTrigger] = useState<TriggerData | null>(null);
  const { activateSync, syncCount } = useSync(); // 🔄 syncCount déclenche les maj

  useEffect(() => {
    const fetchTrigger = async () => {
      try {
        const res = await fetch("/api/public/trigger");
        const data = await res.json();
        setTrigger(data);
      } catch (error) {
        console.error("Erreur fetch trigger", error);
      }
    };

    fetchTrigger();
  }, [syncCount]);

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
            className={`text-[24px] font-semibold px-[15px] py-[6px] rounded-[25px] border-[1px] inline-block
    ${getColorClasses(trigger.volatility)}
  `}
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
                {" ("}
                {entry.newScore - entry.delta}
                {")"}
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
