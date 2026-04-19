"use client";

import { useState, useRef, useCallback } from "react";

const JEWELRY_TYPES = ["Ring", "Necklace", "Bracelet", "Earrings", "Brooch", "Other"];
const METALS = ["Yellow Gold", "White Gold", "Rose Gold", "Silver / Platinum", "Not sure yet"];
const BUDGETS = ["Under $1,000", "$1,000 – $3,000", "$3,000 – $8,000", "$8,000 – $20,000", "$20,000+", "Flexible"];
const STONE_OPTS = [
    "I have a specific stone in mind",
    "I'd like help choosing",
    "No stone — metal only",
    "Open to your recommendation",
];

type ImageFile = { file: File; preview: string };

export default function CustomJewelryClient() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [occasion, setOccasion] = useState("");
    const [type, setType] = useState("");
    const [metal, setMetal] = useState("");
    const [budget, setBudget] = useState("");
    const [stoneOpt, setStoneOpt] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<ImageFile[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const fileRef = useRef<HTMLInputElement>(null);

    const addImages = useCallback((files: FileList | File[]) => {
        const valid = Array.from(files)
            .filter(f => f.type.startsWith("image/"))
            .slice(0, 5 - images.length);
        setImages(prev => [...prev, ...valid.map(f => ({ file: f, preview: URL.createObjectURL(f) }))].slice(0, 5));
    }, [images.length]);

    function removeImage(i: number) {
        setImages(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i); });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSending(true);
        try {
            const imageUrls: { url: string; name: string; type: string }[] = [];
            for (const img of images) {
                const fd = new FormData();
                fd.append("file", img.file);
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                if (res.ok) { const d = await res.json(); imageUrls.push({ url: d.url, name: d.name, type: d.type }); }
            }
            const res = await fetch("/api/custom-jewelry-enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, occasion, type, metal, budget, stoneOpt, description, imageUrls }),
            });
            if (!res.ok) throw new Error();
            setSubmitted(true);
        } catch {
            setError("Something went wrong. Please email us at ceylongemcompany.inquiries@gmail.com");
        } finally {
            setSending(false);
        }
    }

    if (submitted) return (
        <div style={successWrapStyle}>
            <div style={{ textAlign: "center", maxWidth: 520 }}>
                <div style={labelStyle}>Received</div>
                <h2 style={successTitleStyle}>
                    Thank you, <em style={{ fontStyle: "italic" }}>{name.split(" ")[0]}.</em>
                </h2>
                <p style={successLedeStyle}>
                    Your enquiry has been received. A member of the house will respond within twenty-four hours with first proposals and next steps.
                </p>
                <button onClick={() => setSubmitted(false)} style={btnGhostStyle}>Submit another</button>
            </div>
        </div>
    );

    return (
        <div style={pageStyle} className="cg-cj-page">

            {/* Masthead */}
            <div style={mastheadStyle}>
                <div style={mastheadMetaStyle}>
                    <div>
                        <div style={labelStyle}>Section</div>
                        <div style={valueStyle}>Commissions</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Response</div>
                        <div style={valueStyle}>Within 24 hours</div>
                    </div>
                </div>

                <h1 style={h1Style} className="cg-cj-h1">
                    A piece,<br />
                    made entirely <em style={{ fontStyle: "italic" }}>for you.</em>
                </h1>

                <p style={ledeStyle}>
                    Every commission begins in conversation. Tell us what you have in mind — in whatever detail comes to you. We'll reply with first proposals, not a price sheet.
                </p>

                <div style={{ height: 1, background: "#000", margin: "40px 0 0" }} />
            </div>

            <form onSubmit={handleSubmit} style={formStyle}>

                <Section num="I" label="Your Details">
                    <div className="cj-g2">
                        <InputField label="Full Name" value={name} onChange={setName} placeholder="Your name" required />
                        <InputField label="Email Address" value={email} onChange={setEmail} placeholder="you@example.com" required type="email" />
                        <InputField label="Telephone" value={phone} onChange={setPhone} placeholder="(optional)" />
                        <InputField label="Occasion" value={occasion} onChange={setOccasion} placeholder="Engagement, gift, self" />
                    </div>
                </Section>

                <Section num="II" label="The Piece">
                    <FieldLabel>Type</FieldLabel>
                    <div style={toggleRowStyle}>
                        {JEWELRY_TYPES.map(t => (
                            <ToggleBtn key={t} label={t} active={type === t} onClick={() => setType(t)} />
                        ))}
                    </div>
                </Section>

                <Section num="III" label="Preferences">
                    <div className="cj-g2">
                        <div>
                            <FieldLabel>Metal</FieldLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {METALS.map(m => <PickRow key={m} label={m} selected={metal === m} onClick={() => setMetal(m)} />)}
                            </div>
                        </div>
                        <div>
                            <FieldLabel>Budget</FieldLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {BUDGETS.map(b => <PickRow key={b} label={b} selected={budget === b} onClick={() => setBudget(b)} />)}
                            </div>
                        </div>
                    </div>
                </Section>

                <Section num="IV" label="Stone">
                    <div style={toggleRowStyle}>
                        {STONE_OPTS.map(o => (
                            <ToggleBtn key={o} label={o} active={stoneOpt === o} onClick={() => setStoneOpt(o)} />
                        ))}
                    </div>
                </Section>

                <Section num="V" label="Your Vision">
                    <div className="cj-g2">
                        <div>
                            <FieldLabel>Describe what you have in mind <span style={{ fontStyle: "italic", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— required</span></FieldLabel>
                            <textarea
                                required rows={8}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="A word, a sentence, a page. Whatever comes to you."
                                style={{ ...inputBase, resize: "vertical", minHeight: 180 }}
                            />
                        </div>
                        <div>
                            <FieldLabel>Inspiration <span style={{ fontStyle: "italic", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional, up to 5</span></FieldLabel>
                            <div
                                onClick={() => fileRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
                                style={{
                                    border: `1px dashed ${dragOver ? "#000" : "rgba(0,0,0,0.3)"}`,
                                    padding: "40px 20px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    background: dragOver ? "rgba(0,0,0,0.03)" : "transparent",
                                    transition: "all 0.15s",
                                    marginBottom: 12,
                                }}
                            >
                                <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 17, fontStyle: "italic", color: "#000" }}>
                                    Drop images here, or <span style={{ textDecoration: "underline" }}>browse</span>
                                </p>
                                <p style={{ margin: "8px 0 0", fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000", opacity: 0.5 }}>
                                    JPG · PNG · WEBP
                                </p>
                                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                                       onChange={e => e.target.files && addImages(e.target.files)} />
                            </div>
                            {images.length > 0 && (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {images.map((img, i) => (
                                        <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                                            <img src={img.preview} alt="" style={{ width: 80, height: 80, objectFit: "cover", display: "block" }} />
                                            <button type="button" onClick={() => removeImage(i)} style={removeBtnStyle}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Section>

                {error && <div style={errorBoxStyle}>{error}</div>}

                <div style={submitRowStyle}>
                    <button type="submit" disabled={sending} style={{ ...submitBtnStyle, opacity: sending ? 0.5 : 1 }}>
                        {sending ? "Sending…" : "Submit Enquiry"}
                    </button>
                    <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14, color: "#000", opacity: 0.7 }}>
                        A response within 24 hours. No obligation.
                    </span>
                </div>
            </form>

            <style>{`
                .cj-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                @media (max-width: 860px) {
                    .cj-g2 { grid-template-columns: 1fr !important; gap: 24px !important; }
                }
                @media (max-width: 768px) {
                    .cg-cj-page { padding: 100px 24px 80px !important; }
                    .cg-cj-h1 { font-size: clamp(40px, 10vw, 64px) !important; }
                }
                @media (max-width: 560px) {
                    .cg-cj-page { padding: 90px 20px 60px !important; }
                }
            `}</style>
        </div>
    );
}

/* ── Subcomponents ── */

function Section({ num, label, children }: { num: string; label: string; children: React.ReactNode }) {
    return (
        <div style={{ paddingBottom: 60, marginBottom: 60, borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
            <div style={sectionHeadStyle}>
                <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, letterSpacing: "-0.01em" }}>{num}</span>
                <span style={{ ...labelStyle, marginBottom: 0 }}>{label}</span>
            </div>
            {children}
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <div style={{ ...labelStyle, marginBottom: 14 }}>{children}</div>;
}

function InputField({ label, value, onChange, placeholder, type = "text", required = false }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; required?: boolean;
}) {
    return (
        <div>
            <FieldLabel>{label}{required && <span style={{ fontStyle: "italic", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontFamily: "var(--serif)" }}> — required</span>}</FieldLabel>
            <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
                   placeholder={placeholder} style={inputBase} />
        </div>
    );
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} style={{
            padding: "10px 22px",
            fontFamily: "var(--serif)",
            fontSize: 16,
            cursor: "pointer",
            background: active ? "#000" : "transparent",
            color: active ? "#FFF" : "#000",
            border: `1px solid ${active ? "#000" : "rgba(0,0,0,0.3)"}`,
            transition: "all 0.15s",
            fontStyle: active ? "normal" : "italic",
        }}>{label}</button>
    );
}

function PickRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "none", border: "none", cursor: "pointer",
            padding: "4px 0", textAlign: "left",
        }}>
            <span style={{
                width: 14, height: 14, borderRadius: "50%",
                border: `1.5px solid ${selected ? "#000" : "rgba(0,0,0,0.3)"}`,
                background: selected ? "#000" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
                flexShrink: 0,
            }}>
                {selected && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#FFF" }} />}
            </span>
            <span style={{ fontFamily: "var(--serif)", fontSize: 16 }}>{label}</span>
        </button>
    );
}

/* STYLES */

const pageStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    background: "var(--paper, #F4F1EB)",
    color: "#000",
    minHeight: "100vh",
    padding: "140px 5vw 120px",
};
const mastheadStyle: React.CSSProperties = {
    maxWidth: 1100, margin: "0 auto 80px",
};
const mastheadMetaStyle: React.CSSProperties = {
    display: "flex",
    gap: 60,
    paddingBottom: 20,
    borderBottom: "1px solid rgba(0,0,0,0.15)",
    marginBottom: 40,
};
const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 6,
    fontWeight: 500,
};
const valueStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 18,
    color: "#000",
};
const h1Style: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(48px, 7vw, 112px)",
    fontWeight: 400,
    lineHeight: 0.95,
    letterSpacing: "-0.025em",
    color: "#000",
    marginBottom: 32,
};
const ledeStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 20,
    lineHeight: 1.55,
    color: "#000",
    maxWidth: 640,
};
const formStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
};
const sectionHeadStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 32,
    paddingBottom: 14,
    borderBottom: "1px solid #000",
};
const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "14px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(0,0,0,0.25)",
    fontFamily: "var(--serif)",
    fontSize: 18,
    color: "#000",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
};
const toggleRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
};
const removeBtnStyle: React.CSSProperties = {
    position: "absolute",
    top: 4, right: 4,
    width: 22, height: 22,
    background: "#000",
    color: "#FFF",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--sans)",
};
const errorBoxStyle: React.CSSProperties = {
    padding: "16px 20px",
    border: "1px solid rgba(120,20,20,0.5)",
    background: "rgba(120,20,20,0.04)",
    fontFamily: "var(--serif)",
    fontSize: 15,
    color: "#000",
    marginBottom: 20,
};
const submitRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
    marginTop: 20,
};
const submitBtnStyle: React.CSSProperties = {
    padding: "18px 44px",
    background: "#000",
    color: "#FFF",
    border: "none",
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    fontWeight: 500,
    cursor: "pointer",
};

/* Success */
const successWrapStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--paper, #F4F1EB)",
    padding: "140px 5vw 60px",
};
const successTitleStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(44px, 6vw, 72px)",
    fontWeight: 400,
    letterSpacing: "-0.025em",
    lineHeight: 1,
    marginTop: 20,
    marginBottom: 28,
    color: "#000",
};
const successLedeStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 20,
    lineHeight: 1.55,
    color: "#000",
    marginBottom: 40,
};
const btnGhostStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    padding: "14px 28px",
    background: "transparent",
    color: "#000",
    border: "1px solid #000",
    cursor: "pointer",
    fontWeight: 500,
};