"use client";

import { useState, useRef, useCallback } from "react";
import Navigation from "@/app/components/Navigation";

const FM = `"Inter","Helvetica Neue",Arial,sans-serif`;
const FS = `"Crimson Pro","Cormorant Garamond","EB Garamond",Georgia,serif`;

const JEWELRY_TYPES = ["Ring", "Necklace", "Bracelet", "Earrings", "Brooch", "Other"];
const METALS  = ["Yellow Gold", "White Gold", "Rose Gold", "Silver / Platinum", "Not sure yet"];
const BUDGETS = ["Under $1,000", "$1,000 – $3,000", "$3,000 – $8,000", "$8,000 – $20,000", "$20,000+", "Flexible"];
const STONE_OPTS = [
    "I have a specific stone in mind",
    "I'd like help choosing",
    "No stone — metal only",
    "Open to your recommendation",
];

type ImageFile = { file: File; preview: string };

export default function CustomJewelryClient() {
    const [name,        setName]        = useState("");
    const [email,       setEmail]       = useState("");
    const [phone,       setPhone]       = useState("");
    const [occasion,    setOccasion]    = useState("");
    const [type,        setType]        = useState("");
    const [metal,       setMetal]       = useState("");
    const [budget,      setBudget]      = useState("");
    const [stoneOpt,    setStoneOpt]    = useState("");
    const [description, setDescription] = useState("");
    const [images,      setImages]      = useState<ImageFile[]>([]);
    const [dragOver,    setDragOver]    = useState(false);
    const [submitted,   setSubmitted]   = useState(false);
    const [sending,     setSending]     = useState(false);
    const [error,       setError]       = useState("");

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
        <>
            <Navigation />
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", fontFamily: FM, paddingTop: 120, paddingBottom: 40, paddingLeft: "5vw", paddingRight: "5vw" }}>
                <div style={{ textAlign: "center", maxWidth: 420 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 24px" }}>✓</div>
                    <h2 style={{ fontFamily: FS, fontSize: 34, fontWeight: 400, margin: "0 0 12px", color: "#111" }}>Request received.</h2>
                    <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
                        Thank you, {name.split(" ")[0]}. We'll be in touch within 24 hours.
                    </p>
                    <button onClick={() => setSubmitted(false)} style={btnOutline}>Submit another request</button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Navigation />
            <div style={{ background: "#fff", minHeight: "100vh", fontFamily: FM, color: "#111", paddingTop: 92 }}>

                {/* PAGE HEADER */}
                <div style={{ paddingTop: 48, paddingBottom: 40, paddingLeft: "5vw", paddingRight: "5vw", borderBottom: "1px solid #e8e8e8", maxWidth: 1100, margin: "0 auto" }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.20em", textTransform: "uppercase" as const, color: "#999", margin: "0 0 10px" }}>
                        Custom Jewellery
                    </p>
                    <h1 style={{ fontFamily: FS, fontSize: "clamp(30px,4vw,48px)", fontWeight: 400, letterSpacing: "-0.02em", color: "#111", margin: "0 0 10px", lineHeight: 1.05 }}>
                        Commission a bespoke piece.
                    </h1>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: 0, maxWidth: 480 }}>
                        Tell us what you have in mind and we'll get back to you within 24 hours.
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 48, paddingBottom: 80, paddingLeft: "5vw", paddingRight: "5vw" }}>

                    <Row label="Your details">
                        <div className="cj-g4">
                            <InputField label="Full name *"     value={name}     onChange={setName}     placeholder="Your name"       required />
                            <InputField label="Email address *" value={email}    onChange={setEmail}    placeholder="you@example.com" required type="email" />
                            <InputField label="Phone"           value={phone}    onChange={setPhone}    placeholder="+1 (optional)" />
                            <InputField label="Occasion"        value={occasion} onChange={setOccasion} placeholder="Engagement, gift…" />
                        </div>
                    </Row>

                    <Row label="What would you like made?">
                        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                            {JEWELRY_TYPES.map(t => (
                                <ToggleBtn key={t} label={t} active={type === t} onClick={() => setType(t)} />
                            ))}
                        </div>
                    </Row>

                    <Row label="Preferences">
                        <div className="cj-g2">
                            <div>
                                <SectionLabel>Metal</SectionLabel>
                                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                                    {METALS.map(m => <PickRow key={m} label={m} selected={metal === m} onClick={() => setMetal(m)} />)}
                                </div>
                            </div>
                            <div>
                                <SectionLabel>Budget</SectionLabel>
                                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                                    {BUDGETS.map(b => <PickRow key={b} label={b} selected={budget === b} onClick={() => setBudget(b)} />)}
                                </div>
                            </div>
                        </div>
                    </Row>

                    <Row label="Stone">
                        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                            {STONE_OPTS.map(o => (
                                <ToggleBtn key={o} label={o} active={stoneOpt === o} onClick={() => setStoneOpt(o)} />
                            ))}
                        </div>
                    </Row>

                    <Row label="Your vision">
                        <div className="cj-g2">
                            <div>
                                <SectionLabel>Describe what you have in mind *</SectionLabel>
                                <textarea
                                    required rows={6}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Style, inspiration, details that matter to you…"
                                    style={{ ...inputBase, resize: "vertical" as const, minHeight: 140 }}
                                />
                            </div>
                            <div>
                                <SectionLabel>Inspiration images — optional (up to 5)</SectionLabel>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
                                    style={{
                                        border: `1px dashed ${dragOver ? "#111" : "#ccc"}`,
                                        padding: "24px 16px", textAlign: "center" as const,
                                        cursor: "pointer", background: dragOver ? "#f8f8f8" : "#fff",
                                        transition: "all 0.12s", marginBottom: 10,
                                    }}
                                >
                                    <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                                        Drop images or <span style={{ color: "#111", textDecoration: "underline" }}>browse</span>
                                    </p>
                                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>JPG, PNG, WEBP — max 5</p>
                                    <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                                           onChange={e => e.target.files && addImages(e.target.files)} />
                                </div>
                                {images.length > 0 && (
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                                        {images.map((img, i) => (
                                            <div key={i} style={{ position: "relative", width: 64, height: 64 }}>
                                                <img src={img.preview} alt="" style={{ width: 64, height: 64, objectFit: "cover", display: "block", border: "1px solid #e0e0e0" }} />
                                                <button type="button" onClick={() => removeImage(i)} style={{
                                                    position: "absolute", top: 2, right: 2, width: 16, height: 16,
                                                    borderRadius: "50%", background: "#111", color: "#fff", border: "none",
                                                    cursor: "pointer", fontSize: 8, fontFamily: FM,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}>✕</button>
                                            </div>
                                        ))}
                                        {images.length < 5 && (
                                            <button type="button" onClick={() => fileRef.current?.click()} style={{
                                                width: 64, height: 64, border: "1px dashed #ddd",
                                                background: "#fafafa", cursor: "pointer", fontSize: 18, color: "#ccc",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>+</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Row>

                    {error && (
                        <div style={{ padding: "12px 14px", border: "1px solid #fcc", background: "#fff5f5", fontSize: 13, color: "#c00", marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" as const }}>
                        <button type="submit" disabled={sending} style={{
                            padding: "14px 36px", background: "#111", color: "#fff",
                            border: "1px solid #111", fontSize: 12, letterSpacing: "0.12em",
                            textTransform: "uppercase" as const, cursor: sending ? "default" : "pointer",
                            fontFamily: FM, fontWeight: 500, opacity: sending ? 0.6 : 1, transition: "opacity 0.12s",
                        }}>
                            {sending ? "Sending…" : "Submit Enquiry →"}
                        </button>
                        <span style={{ fontSize: 12, color: "#bbb" }}>We'll reply within 24 hours. No commitment required.</span>
                    </div>

                </form>
            </div>

            <style>{`
                .cj-g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
                .cj-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
                textarea:focus, input:focus { border-color: #111 !important; outline: none; }
                input::placeholder, textarea::placeholder { color: #ccc; font-size: 13px; }
                @media (max-width: 860px) {
                    .cj-g4 { grid-template-columns: 1fr 1fr !important; }
                    .cj-g2 { grid-template-columns: 1fr !important; gap: 24px !important; }
                }
                @media (max-width: 500px) {
                    .cj-g4 { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ paddingBottom: 36, marginBottom: 36, borderBottom: "1px solid #ebebeb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.20em", textTransform: "uppercase" as const, color: "#111", fontWeight: 600, whiteSpace: "nowrap" as const }}>{label}</span>
                <div style={{ flex: 1, height: 1, background: "#ebebeb" }} />
            </div>
            {children}
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ fontSize: 11, color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10, fontWeight: 500 }}>
            {children}
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, type = "text", required = false }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; required?: boolean;
}) {
    return (
        <div>
            <SectionLabel>{label}</SectionLabel>
            <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
                   placeholder={placeholder} style={inputBase} />
        </div>
    );
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} style={{
            padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: FM,
            background: active ? "#111" : "#fff",
            color:      active ? "#fff" : "#111",
            border:     `1px solid ${active ? "#111" : "#ddd"}`,
            transition: "all 0.12s",
        }}>{label}</button>
    );
}

function PickRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer",
            padding: "2px 0", textAlign: "left" as const, fontFamily: FM,
        }}>
            <span style={{
                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${selected ? "#111" : "#ccc"}`,
                background: selected ? "#111" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.12s",
            }}>
                {selected && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "block" }} />}
            </span>
            <span style={{ fontSize: 14, color: "#111" }}>{label}</span>
        </button>
    );
}

const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    fontFamily: FM, border: "1px solid #ddd",
    background: "#fff", color: "#111", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.12s",
};
const btnOutline: React.CSSProperties = {
    padding: "10px 22px", background: "#fff", color: "#111",
    border: "1px solid #ccc", fontSize: 12, letterSpacing: "0.10em",
    textTransform: "uppercase" as const, cursor: "pointer", fontFamily: FM,
};