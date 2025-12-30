"use client";

import React, { useState } from "react";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "sent">("idle");

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("sent");
    }

    return (
        <form
            className="hairline"
            style={{
                borderRadius: 16,
                padding: 18,
                background: "rgba(245,245,245,0.02)",
            }}
            onSubmit={onSubmit}
        >
            <Field label="Name" placeholder="Your name" />
            <Field label="Email" placeholder="you@email.com" />
            <Field label="Stone" placeholder="Sapphire, Ruby, Emerald..." />
            <Field label="Details" placeholder="Carat range, budget, timeline..." textarea />

            <button
                className="btn btnPrimary"
                type="submit"
                style={{ width: "100%", marginTop: 10 }}
            >
                Send inquiry
            </button>

            <div
                className="small"
                style={{
                    marginTop: 10,
                    textTransform: "none",
                    letterSpacing: "0.02em",
                }}
            >
                {status === "sent"
                    ? "Received. We will respond shortly."
                    : "This demo form does not send emails yet. Wire it to an API route when ready."}
            </div>
        </form>
    );
}

function Field({
                   label,
                   placeholder,
                   textarea,
               }: {
    label: string;
    placeholder: string;
    textarea?: boolean;
}) {
    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px 12px",
        borderRadius: 12,
        border: "1px solid rgba(245,245,245,0.14)",
        background: "rgba(245,245,245,0.02)",
        color: "rgba(245,245,245,0.92)",
        outline: "none",
        fontSize: 14,
        fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    };

    return (
        <label style={{ display: "block", marginBottom: 12 }}>
            <div className="small" style={{ marginBottom: 8 }}>
                {label}
            </div>
            {textarea ? (
                <textarea placeholder={placeholder} rows={4} style={inputStyle} />
            ) : (
                <input placeholder={placeholder} style={inputStyle} />
            )}
        </label>
    );
}
