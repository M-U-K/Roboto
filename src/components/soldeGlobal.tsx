import BlockWrapper from "./blockWrapper";
import { useRouter } from "next/navigation";

export default function SoldeGlobal() {
  const router = useRouter();
  return (
    <BlockWrapper
      defaultPosition={{ x: 20, y: 20 }}
      size={{ width: 400, height: 450 }}
    >
      <div className="w-full max-w-sm text-foreground">
        <div className="text-primary text-heading pt-[20px]">Solde Global</div>
        <div className="text-monney pb-[30px]">$2800</div>

        <div className="grid grid-cols-2">
          <div className="bg-background border-default rounded pl-[15px] pr-[15px] mb-[20px] w-[160px] box-border">
            <div className="text-pink pt-[18px]">Pot actif</div>
            <div className="text-monney font-bold pb-[20px]">$1000</div>
          </div>
          <div className="bg-background border-default rounded pl-[15px] pr-[15px] mb-[20px] w-[160px] box-border">
            <div className="text-pink pt-[18px]">Pot actif</div>
            <div className="text-monney font-bold pb-[20px]">$1000</div>
          </div>
          <div className="bg-background border-default rounded pl-[15px] pr-[15px] w-[160px] box-border">
            <div className="text-pink pt-[18px]">Pot actif</div>
            <div className="text-monney font-bold pb-[20px]">$1000</div>
          </div>
          <div className="bg-background border-default rounded pl-[15px] pr-[15px] w-[160px] box-border">
            <div className="text-pink pt-[18px]">Pot actif</div>
            <div className="text-monney font-bold pb-[20px]">$1000</div>
          </div>
        </div>
        <div className="text-right">
          <div className="mt-[10px] w-auto">
            <div
              onClick={() => router.push("/dashboard")}
              className="inline cursor-pointer text-cyan hover:brightness-150 transition duration-200"
            >
              Voir tout
            </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}
