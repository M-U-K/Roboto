import BlockWrapper from "./blockWrapper";

export default function SoldeGlobal() {
  return (
    <BlockWrapper defaultPosition={{ x: 20, y: 20 }}>
      <div className="">
        <h2 className="text-primary font-bold text-lg">Solde Global</h2>
        <p className="text-3xl">$2800</p>
        <div className="mt-2 text-sm space-y-1">
          <p>
            Pot actif : <span className="text-accent">$1000</span>
          </p>
          <p>
            Pot inactif : <span className="text-accent">$400</span>
          </p>
          <p>
            Sécurité : <span className="text-accent">$1200</span>
          </p>
          <p>
            Cash : <span className="text-accent">$200</span>
          </p>
        </div>
      </div>
    </BlockWrapper>
  );
}
