"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    children: React.ReactNode;
    delayMs?: number;
};

export default function Reveal({ children, delayMs = 0 }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [shown, setShown] = useState(false);

    const style = useMemo<React.CSSProperties>(
        () => ({
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0px)" : "translateY(14px)",
            transitionProperty: "opacity, transform",
            transitionDuration: "700ms",
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            transitionDelay: `${delayMs}ms`,
            willChange: "opacity, transform",
        }),
        [shown, delayMs]
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setShown(true);
                        obs.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} style={style}>
            {children}
        </div>
    );
}
