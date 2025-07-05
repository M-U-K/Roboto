"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlockWrapper;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
let globalZIndex = 10;
function BlockWrapper({ children, defaultPosition, size = { width: 400, height: 450 }, containerRef, }) {
    const [constraints, setConstraints] = (0, react_1.useState)(null);
    const [zIndex, setZIndex] = (0, react_1.useState)(1);
    (0, react_1.useLayoutEffect)(() => {
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
    return (constraints && (<framer_motion_1.motion.div className="absolute bg-surface border-default rounded text-text box-border" drag onPointerDown={bringToFront} dragConstraints={constraints} dragElastic={0.3} dragMomentum dragTransition={{
            bounceStiffness: 150,
            bounceDamping: 20,
            power: 0.6,
            timeConstant: 200,
        }} style={{
            width: size.width,
            height: size.height,
            x: defaultPosition.x,
            y: defaultPosition.y,
            zIndex,
        }}>
        <div className="rounded cursor-move select-none w-full h-full overflow-auto box-border scrollbar-hidden pl-[30px] pr-[30px]">
          {children}
        </div>
      </framer_motion_1.motion.div>));
}
