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
            transform: shown ? "translateY(0px)" : "translateY(24px)",
            transitionProperty: "opacity, transform",
            transitionDuration: "1200ms",
            // Custom luxury easing curve - smooth deceleration
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
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
            { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
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