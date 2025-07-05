"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TriggerPanel;
const react_1 = require("react");
const blockWrapper_1 = __importDefault(require("./blockWrapper"));
const navigation_1 = require("next/navigation");
const syncContext_1 = require("@/contexts/syncContext");
function TriggerPanel({ containerRef, }) {
    const router = (0, navigation_1.useRouter)();
    const [trigger, setTrigger] = (0, react_1.useState)(null);
    const { lastSync } = (0, syncContext_1.useSync)();
    (0, react_1.useEffect)(() => {
        const fetchTrigger = async () => {
            try {
                const res = await fetch("/api/trigger");
                const data = await res.json();
                setTrigger(data);
            }
            catch (error) {
                console.error("Erreur fetch trigger", error);
            }
        };
        fetchTrigger();
    }, [lastSync]);
    if (!trigger) {
        return <div>Chargement...</div>;
    }
    return (<blockWrapper_1.default defaultPosition={{ x: 20, y: 20 }} size={{ width: 400, height: 450 }} containerRef={containerRef}>
      <div className="w-full max-w-sm text-foreground">
        <div className="flex justify-between items-end mt-[20px] mb-[20px]">
          <div>
            <div className="text-primary text-heading">Trigger</div>
          </div>
          <div className="text-[24px] text-gold font-semibold px-[15px] py-[6px] rounded-[25px] border-[1px] 
  border-gold bg-transparent inline-block 
  shadow-[0_0_8px_#faff56] [filter:drop-shadow(0_0_1px_#faff56)] 
  [text-shadow:0_0_1px_#faff56]">
            Volatilité à {trigger.volatility}
          </div>
        </div>

        <div className="text-heading text-cyan pb-[10px] text-center w-full mb-[20px]">
          {trigger.highCount} cryptos à BuyT - 1
        </div>

        <div className="bg-background border-default rounded box-border pl-[20px] mb-[10px]">
          <div className="text-pink text-heading mb-[10px]">Log</div>
          {trigger.log.map((entry, i) => (<div key={i} className="text-body mb-[8px]">
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
            </div>))}
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
    </blockWrapper_1.default>);
}
