import { Rnd } from "react-rnd";
import { ReactNode } from "react";

type BlockProps = {
  children: ReactNode;
  defaultPosition: { x: number; y: number };
  defaultSize?: { width: number; height: number };
};

export default function BlockWrapper({
  children,
  defaultPosition,
  defaultSize = { width: 300, height: 200 },
}: BlockProps) {
  return (
    <Rnd
      default={{
        ...defaultPosition,
        ...defaultSize,
      }}
      bounds="parent"
      minWidth={200}
      minHeight={150}
      dragHandleClassName="drag-handle"
      className="bg-surface border-default rounded text-text box-border"
    >
      <div className="rounded drag-handle cursor-move select-none w-full h-full overflow-auto p-4 box-border ">
        {children}
      </div>
    </Rnd>
  );
}
