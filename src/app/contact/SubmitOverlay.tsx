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
          0% { opacity: .20; transform: translateY(0); }
          20% { opacity: 1; }
          100% { opacity: .20; transform: translateY(0); }
        }
      `}</style>

            <div style={overlayStyle}>
                <div style={panelStyle}>
                    <div style={dotRowStyle}>
                        <span style={{ ...dotStyle, animationDelay: "0ms" }} />
                        <span style={{ ...dotStyle, animationDelay: "120ms" }} />
                        <span style={{ ...dotStyle, animationDelay: "240ms" }} />
                    </div>
                    <div style={textStyle}>Sending inquiry</div>
                </div>
            </div>
        </>
    );
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,15,15,0.55)",
    backdropFilter: "blur(6px)",
    zIndex: 2500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const panelStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.96)",
    borderRadius: 18,
    padding: "26px 34px",
    textAlign: "center",
    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
    border: "1px solid rgba(0,0,0,0.10)",
};

const dotRowStyle: React.CSSProperties = {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 14,
};

const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#111",
    animation: "cgPulse 1.2s infinite ease-in-out",
};

const textStyle: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#111",
};
