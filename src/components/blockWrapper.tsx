"use client";

import { ReactNode, useRef, useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";

type BlockProps = {
  children: ReactNode;
  defaultPosition: { x: number; y: number };
  size?: { width: number; height: number };
};

export default function BlockWrapper({
  children,
  defaultPosition,
  size = { width: 400, height: 450 },
}: BlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  } | null>(null);

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
  }, [size]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {constraints && (
        <motion.div
          className="absolute bg-surface border-default rounded text-text box-border"
          drag
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
          }}
        >
          <div className="rounded cursor-move select-none w-full h-full overflow-auto box-border scrollbar-hidden pl-[5%] pr-[5%] pb-[2.5%]">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
}
