"use client";

import { ReactNode, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

let globalZIndex = 10;

type BlockProps = {
  children: ReactNode;
  defaultPosition: { x: number; y: number };
  size?: { width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function BlockWrapper({
  children,
  defaultPosition,
  size = { width: 400, height: 450 },
  containerRef,
}: BlockProps) {
  const [constraints, setConstraints] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  } | null>(null);

  const [zIndex, setZIndex] = useState(1);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setConstraints({
        left: 0,
        top: 0,
        right: clientWidth - size.width,
        bottom: clientHeight - size.height,
      });
    }
  }, [containerRef, size]);

  function bringToFront() {
    globalZIndex += 1;
    setZIndex(globalZIndex);
  }

  return (
    constraints && (
      <motion.div
        className="absolute bg-surface border-default rounded text-text box-border"
        drag
        onPointerDown={bringToFront}
        dragConstraints={constraints}
        dragElastic={0.3}
        dragMomentum
        dragTransition={{
          bounceStiffness: 150,
          bounceDamping: 20,
          power: 0.6,
          timeConstant: 200,
        }}
        style={{
          width: size.width,
          height: size.height,
          x: defaultPosition.x,
          y: defaultPosition.y,
          zIndex,
        }}
      >
        <div className="rounded cursor-move select-none w-full h-full overflow-auto box-border scrollbar-hidden pl-[30px] pr-[30px]">
          {children}
        </div>
      </motion.div>
    )
  );
}
