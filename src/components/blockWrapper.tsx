import { Rnd } from "react-rnd";
import { ReactNode } from "react";

type BlockProps = {
  children: ReactNode;
  defaultPosition: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
};

export default function BlockWrapper({
  children,
  defaultPosition,
  defaultSize = { width: 400, height: 450 },
  minSize = { width: 250, height: 350 },
}: BlockProps) {
  return (
    <Rnd
      default={{
        ...defaultPosition,
        ...defaultSize,
      }}
      bounds="parent"
      minWidth={minSize.width}
      minHeight={minSize.height}
      dragHandleClassName="drag-handle"
      className="bg-surface border-default rounded text-text box-border"
    >
      <div
        className="rounded drag-handle cursor-move select-none w-full h-full overflow-auto box-border scrollbar-hidden"
        style={{
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "2.5%",
        }}
      >
        {children}
      </div>
    </Rnd>
  );
}
