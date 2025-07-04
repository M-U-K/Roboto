"use client";

import { useRef } from "react";
import SoldeGlobal from "../components/soldeGlobal";
import EtatSysteme from "@/components/etatSysteme";
import CryptoTable from "@/components/listeCryptos";
import TriggerPanel from "@/components/triggerPanel";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-background relative overflow-hidden"
    >
      <EtatSysteme containerRef={containerRef} />
      <SoldeGlobal containerRef={containerRef} />
      <CryptoTable containerRef={containerRef} />
      <TriggerPanel containerRef={containerRef} />
    </div>
  );
}
