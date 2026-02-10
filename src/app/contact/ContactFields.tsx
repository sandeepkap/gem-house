"use client";

import { useMemo, useState } from "react";

export default function ContactFields({
                                          styles,
                                      }: {
    styles: {
        grid2: React.CSSProperties;
        field: React.CSSProperties;
        label: React.CSSProperties;
        input: React.CSSProperties;
        select: React.CSSProperties;
    };
}) {
    const [preferred, setPreferred] = useState<"email" | "phone">("email");

    const helper = useMemo(() => {
        return preferred === "email"
            ? "We’ll reply by email."
            : "We’ll reply by phone.";
    }, [preferred]);

    return (
        <>
            <div style={styles.grid2}>
                <div style={styles.field}>
                    <label style={styles.label}>Preferred method</label>
                    <select
                        name="preferred"
                        value={preferred}
                        onChange={(e) =>
                            setPreferred((e.target.value as "email" | "phone") || "email")
                        }
                        style={styles.select}
                    >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                    </select>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Response</label>
                    <div
                        style={{
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: "rgba(26,26,26,0.72)",
                            padding: "14px 16px",
                            border: "1px solid rgba(26,26,26,0.14)",
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.55))",
                            borderRadius: 12,
                        }}
                    >
                        {helper}
                    </div>
                </div>
            </div>

            {preferred === "email" ? (
                <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        style={styles.input}
                    />
                </div>
            ) : (
                <div style={styles.field}>
                    <label style={styles.label}>Phone</label>
                    <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1 608 421 2077"
                        style={styles.input}
                    />
                </div>
            )}
        </>
    );
}
