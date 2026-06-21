// components/ui/lamp.tsx
import { motion } from "motion/react";

interface LampProps {
    layoutId: string;
    className?: string;
}

export const Lamp = ({ layoutId, className = "" }: LampProps) => (
    <motion.div
        layoutId={layoutId}
        className={`absolute inset-0 w-full bg-myPalette9 rounded-full -z-10 ${className}`}
        initial={false}
        transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
        }}
    >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-myPalette9 rounded-t-full">
            <div className="absolute w-12 h-6 bg-myPalette9/20 rounded-full blur-md -top-2 -left-2" />
            <div className="absolute w-8 h-6 bg-myPalette9/20 rounded-full blur-sm -top-1" />
            <div className="absolute w-4 h-4 bg-myPalette9/20 rounded-full blur-sm top-0 left-2" />
        </div>
    </motion.div>
);  