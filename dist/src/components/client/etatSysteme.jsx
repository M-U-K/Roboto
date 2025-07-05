"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EtatSysteme;
const react_1 = require("react");
const blockWrapper_1 = __importDefault(require("./blockWrapper"));
const syncContext_1 = require("@/contexts/syncContext");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
function EtatSysteme({ containerRef, }) {
    const router = (0, navigation_1.useRouter)();
    const [state, setState] = (0, react_1.useState)(null);
    const [timeLeft, setTimeLeft] = (0, react_1.useState)("05:00");
    const { lastSync, syncing } = (0, syncContext_1.useSync)();
    (0, react_1.useEffect)(() => {
        const fetchState = async () => {
            const res = await fetch("/api/state");
            const data = await res.json();
            setState(data);
        };
        fetchState();
    }, [lastSync]);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const delta = 300000 - (Date.now() - lastSync);
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
    return (<blockWrapper_1.default defaultPosition={{ x: 440, y: 20 }} size={{ width: 600, height: 280 }} containerRef={containerRef}>
      <div className="w-full max-w-sm text-foreground">
        <div className="flex items-center w-full pt-[20px] pb-[10px]">
          <div className="text-primary text-heading whitespace-nowrap
">
            État du système
          </div>

          {state ? (<div className={`text-[24px] ml-[20px] font-semibold px-[15px] py-[3px] rounded-[25px] border-[1px] ${state.isActive
                ? "text-[#00FFAA] border-[#00FFAA] bg-transparent" +
                    " shadow-[0_0_8px_#00FFAA] [filter:drop-shadow(0_0_1px_#00FFAA)] [text-shadow:0_0_1px_#00FFAA]"
                : "text-[#FF5C5C] border-[#FF5C5C] bg-transparent"}`}>
              {state.isActive ? "Actif" : "Inactif"}
            </div>) : (<div className="text-[24px] text-muted font-semibold">
              Chargement...
            </div>)}
          <div className="bg-background border-default rounded ml-[20px] box-border flex items-center gap-[8px] text-heading text-primary pl-[10px] pr-[10px]">
            <lucide_react_1.History className="text-gold" size={34}/>
            {syncing ? "XX:XX" : `${timeLeft}`}
          </div>
        </div>

        <div className="grid grid-cols-2 mt-[10px]">
          <CardCrypto total={state === null || state === void 0 ? void 0 : state.nbrCrypto} on={state === null || state === void 0 ? void 0 : state.nbrCryptoOn} off={state === null || state === void 0 ? void 0 : state.nbrCryptoOff}/>
          <Card label="Gain total" value={state === null || state === void 0 ? void 0 : state.totalGain} isDollar/>
        </div>
        {/*
        <div className="text-right pt-[10px]">
          <span
            onClick={() => router.push("/dashboard")}
            className="text-cyan cursor-pointer hover:brightness-150 transition duration-200"
          >
            Voir tout
          </span>
        </div>
        */}
      </div>
    </blockWrapper_1.default>);
}
function Card({ label, value, isDollar = false, }) {
    return (<div className="bg-background border-default rounded pl-[15px] pr-[15px] pt-[18px] pb-[20px] ml-[20px] box-border">
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
    </div>);
}
function CardCrypto({ total, on, off, }) {
    return (<div className="bg-background border-default rounded pl-[15px] pr-[15px] pt-[18px] pb-[20px] mr-[20px] box-border">
      <div className="text-heading w-fit mx-auto text-left">
        <div className="pb-[5px]">
          <span className="text-purple">Cryptos :</span>{" "}
          <span className="text-pink">{total !== null && total !== void 0 ? total : "-"}</span>
        </div>
        <div className="">
          <span className="text-cyan">Ratio :</span>{" "}
          <span className="text-[#00ff88]">{on !== null && on !== void 0 ? on : "-"}</span>/
          <span className="text-[#ff5e5e]">{off !== null && off !== void 0 ? off : "-"}</span>
        </div>
      </div>
    </div>);
}
