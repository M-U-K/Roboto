"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const react_1 = require("react");
const soldeGlobal_1 = __importDefault(require("../components/client/soldeGlobal"));
const etatSysteme_1 = __importDefault(require("@/components/client/etatSysteme"));
const listeCryptos_1 = __importDefault(require("@/components/client/listeCryptos"));
const triggerPanel_1 = __importDefault(require("@/components/client/triggerPanel"));
function HomePage() {
    const containerRef = (0, react_1.useRef)(null);
    return (<div ref={containerRef} className="w-screen h-screen bg-background relative overflow-hidden">
      <etatSysteme_1.default containerRef={containerRef}/>
      <soldeGlobal_1.default containerRef={containerRef}/>
      <listeCryptos_1.default containerRef={containerRef}/>
      <triggerPanel_1.default containerRef={containerRef}/>
    </div>);
}
