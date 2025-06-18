import BlockWrapper from "./blockWrapper";

export default function SoldeGlobal() {
  return (
    <BlockWrapper
      defaultPosition={{ x: 20, y: 20 }}
      defaultSize={{ width: 400, height: 350 }}
      minSize={{ width: 250, height: 350 }}
    >
      <div className="w-full max-w-sm text-foreground">
        <p className="text-primary">Solde Global</p>
        <p className="">$2800</p>

        <div className="grid grid-cols-2">
          <div
            className="bg-background border-default rounded"
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              margin: "5%",
              maxWidth: "160px",
              boxSizing: "border-box",
            }}
          >
            <p className="text-pink">Pot actif</p>
            <p className="">$1000</p>
          </div>{" "}
          <div
            className="bg-background border-default rounded"
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              margin: "5%",
              maxWidth: "160px",
              boxSizing: "border-box",
            }}
          >
            <p className="text-pink">Pot actif</p>
            <p className="">$1000</p>
          </div>
          <div
            className="bg-background border-default rounded"
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              margin: "5%",
              maxWidth: "160px",
              boxSizing: "border-box",
            }}
          >
            <p className="text-pink">Pot actif</p>
            <p className="">$1000</p>
          </div>{" "}
          <div
            className="bg-background border-default rounded"
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              margin: "5%",
              maxWidth: "160px",
              boxSizing: "border-box",
            }}
          >
            <p className="text-pink">Pot actif</p>
            <p className="">$1000</p>
          </div>
        </div>

        <div className="mt-4 text-right">
          <a href="#" className="text-sky-400">
            Voir tout
          </a>
        </div>
      </div>
    </BlockWrapper>
  );
}
