import BlockWrapper from "./blockWrapper";

export default function SoldeGlobal() {
  return (
    <BlockWrapper defaultPosition={{ x: 20, y: 20 }}>
      <div className="w-full max-w-sm text-foreground">
        <h2 className="text-primary text-lg font-bold">Solde Global</h2>
        <p className="text-3xl font-bold mb-4">$2800</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded bg-background border border-white/10 m-3">
            <p className="text-sm text-pink-400 font-semibold">Pot actif</p>
            <p className="text-2xl font-bold">$1000</p>
          </div>
          <div className="rounded bg-background border border-white/10 p-3">
            <p className="text-sm text-indigo-300 font-semibold">Pot inactif</p>
            <p className="text-2xl font-bold">$400</p>
          </div>
          <div className="rounded bg-background border border-white/10 p-3">
            <p className="text-sm text-cyan-300 font-semibold">Sécurité</p>
            <p className="text-2xl font-bold">$1200</p>
          </div>
          <div className="rounded bg-background border border-white/10 p-3">
            <p className="text-sm text-yellow-300 font-semibold">Cash</p>
            <p className="text-2xl font-bold">$200</p>
          </div>
        </div>

        <div className="mt-4 text-right">
          <a href="#" className="text-sky-400 text-sm hover:underline">
            Voir tout
          </a>
        </div>
      </div>
    </BlockWrapper>
  );
}
