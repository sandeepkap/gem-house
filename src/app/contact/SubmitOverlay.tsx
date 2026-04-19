// src/app/contact/SubmitOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SubmitOverlay() {
    const params = useSearchParams();
    const sent = params.get("sent") === "1";
    const failed = params.get("sent") === "0";

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const start = () => setSubmitting(true);
        window.addEventListener("cg:submit", start);
        return () => window.removeEventListener("cg:submit", start);
    }, []);

    useEffect(() => {
        if (sent || failed) setSubmitting(false);
    }, [sent, failed]);

    if (!submitting) return null;

    return (
        <>
            <style>{`
                @keyframes cgPulse {
                    0% { opacity: 0.2; }
                    20% { opacity: 1; }
                    100% { opacity: 0.2; }
                }
            `}</style>

            <div style={overlayStyle}>
                <div style={panelStyle}>
                    <div style={dotRowStyle}>
                        <span style={{ ...dotStyle, animationDelay: "0ms" }} />
                        <span style={{ ...dotStyle, animationDelay: "140ms" }} />
                        <span style={{ ...dotStyle, animationDelay: "280ms" }} />
                    </div>
                    <div style={textStyle}>Sending Enquiry</div>
                </div>
            </div>
        </>
    );
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(244, 241, 235, 0.96)",
    backdropFilter: "blur(8px)",
    zIndex: 2500,
    display: "flex", alignItems: "center", justifyContent: "center",
};
const panelStyle: React.CSSProperties = {
    textAlign: "center",
};
const dotRowStyle: React.CSSProperties = {
    display: "flex", gap: 10, justifyContent: "center", marginBottom: 20,
};
const dotStyle: React.CSSProperties = {
    width: 8, height: 8,
    borderRadius: "50%",
    background: "#000",
    animation: "cgPulse 1.2s infinite ease-in-out",
};
const textStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    fontWeight: 500,
};