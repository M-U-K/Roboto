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
        <div className="flex justify-between items-end pt-[20px]">
          <div>
            <div className="text-fuchsia-400 text-heading">Trigger</div>
            <div className="text-monney text-cyan-300 text-4xl font-bold">
              <span className="text-xl font-medium">/ 6</span>
            </div>
          </div>
          <div>
            <div className="text-gold text-body pb-[3px]">Volatilité</div>
            <div className="text-monney pb-[10px]">{trigger.volatility}</div>
          </div>
        </div>

        <div className="text-sm text-pink-100 pb-[10px]">
          {trigger.highCount} cryptos à ≥ 5
        </div>

        <div className="border border-pink-400 rounded-lg p-3 mb-[10px]">
          <div className="text-pink-400 font-bold text-sm mb-2">Log</div>
          {trigger.log.map((entry, i) => (
            <div key={i} className="text-sm text-white">
              - {entry.symbol}{" "}
              <span
                className={entry.delta >= 0 ? "text-green-400" : "text-red-400"}
              >
                {entry.delta >= 0 ? "+" : ""}
                {entry.delta}
              </span>
              , maintenant à {entry.newScore}
            </div>
          ))}
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
