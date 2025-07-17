"use client";

import { useRef } from "react";
import SoldeGlobal from "../components/client/soldeGlobal";
import EtatSysteme from "@/components/client/etatSysteme";
import CryptoTable from "@/components/client/listeCryptos";
import TriggerPanel from "@/components/client/triggerPanel";
import Roboto from "@/components/client/roboto";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-background relative overflow-hidden"
    >
      <Roboto />
      <EtatSysteme containerRef={containerRef} />
      <SoldeGlobal containerRef={containerRef} />
      <CryptoTable containerRef={containerRef} />
      <TriggerPanel containerRef={containerRef} />
    </div>
  );
}
