"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { StoneForConfigurator } from "./page";

type MetalId = "silver" | "yellow_gold" | "white_gold";
type Step = 0 | 1 | 2;

const METALS: { id: MetalId; label: string; short: string; swatch: string; filter?: string }[] = [
    { id: "silver",      label: "Silver / Platinum", short: "Silver",      swatch: "linear-gradient(135deg,#e8e8f0,#b0b0c0)" },
    { id: "yellow_gold", label: "Yellow Gold",        short: "Yellow Gold", swatch: "linear-gradient(135deg,#f5d060,#c8860a)" },
    { id: "white_gold",  label: "White Gold",         short: "White Gold",  swatch: "linear-gradient(135deg,#f0f0f0,#c8c8d8)", filter: "saturate(0.45) brightness(1.08) contrast(1.03)" },
];

type RingShape = {
    id: string; label: string; description: string;
    images: Record<MetalId, string>;
};

const RING_SHAPES: RingShape[] = [
    { id: "round",    label: "Round",       images: { silver: "/rings/Round.png",    yellow_gold: "/rings/gold/Round.png",    white_gold: "/rings/Round.png"    }, description: "Maximum brilliance from 58 precisely angled facets." },
    { id: "oval",     label: "Oval",        images: { silver: "/rings/Oval.png",     yellow_gold: "/rings/gold/Oval.png",     white_gold: "/rings/Oval.png"     }, description: "Elongated elegance — appears larger than its carat weight." },
    { id: "cushion",  label: "Cushion",     images: { silver: "/rings/Cushion.png",  yellow_gold: "/rings/gold/Cushion.png",  white_gold: "/rings/Cushion.png"  }, description: "Soft corners with large facets — romantic and timeless." },
    { id: "pear",     label: "Pear",        images: { silver: "/rings/Pear.png",     yellow_gold: "/rings/gold/Pear.png",     white_gold: "/rings/Pear.png"     }, description: "A teardrop silhouette that elongates the finger." },
    { id: "emerald",  label: "Emerald Cut", images: { silver: "/rings/Emerald.png",  yellow_gold: "/rings/gold/Emerald.png",  white_gold: "/rings/Emerald.png"  }, description: "Step-cut facets create a dramatic hall-of-mirrors effect." },
    { id: "princess", label: "Princess",    images: { silver: "/rings/Princess.png", yellow_gold: "/rings/gold/Princess.png", white_gold: "/rings/Princess.png" }, description: "Square with exceptional brilliance." },
    { id: "radiant",  label: "Radiant",     images: { silver: "/rings/Radiant.png",  yellow_gold: "/rings/gold/Radiant.png",  white_gold: "/rings/Radiant.png"  }, description: "Emerald cut elegance with round-cut brilliance." },
    { id: "asscher",  label: "Asscher",     images: { silver: "/rings/Asscher.png",  yellow_gold: "/rings/gold/Asscher.png",  white_gold: "/rings/Asscher.png"  }, description: "Art Deco octagonal step cut — deeply geometric." },
    { id: "heart",    label: "Heart",       images: { silver: "/rings/Heart.png",    yellow_gold: "/rings/gold/Heart.png",    white_gold: "/rings/Heart.png"    }, description: "The ultimate romantic symbol." },
    { id: "marquise", label: "Marquise",    images: { silver: "/rings/Marquise.png", yellow_gold: "/rings/gold/Marquise.png", white_gold: "/rings/Marquise.png" }, description: "Football-shaped — the most elongating cut." },
    { id: "trillion", label: "Trillion",    images: { silver: "/rings/Trillion.png", yellow_gold: "/rings/gold/Trillion.png", white_gold: "/rings/Trillion.png" }, description: "Bold triangular shape — modern and architectural." },
    { id: "baguette", label: "Baguette",    images: { silver: "/rings/Baguette.png", yellow_gold: "/rings/gold/Baguette.png", white_gold: "/rings/Baguette.png" }, description: "Sleek rectangular step cut." },
];

const F  = `"Crimson Pro","Cormorant Garamond","EB Garamond",Georgia,serif`;
const FM = `"Inter","Helvetica Neue",Arial,sans-serif`;

export default function ConfiguratorClient({ stones }: { stones: StoneForConfigurator[] }) {
    const [step,      setStep]      = useState<Step>(0);
    const [prevStep,  setPrevStep]  = useState<Step>(0);
    const [animating, setAnimating] = useState(false);
    const [stone,     setStone]     = useState<StoneForConfigurator | null>(null);
    const [ring,      setRing]      = useState<RingShape | null>(null);
    const [catFilter, setCatFilter] = useState("all");
    const [metal,     setMetal]     = useState<MetalId>("silver");
    const [panelKey,  setPanelKey]  = useState(0); // forces panel re-animate on change

    const metalObj = METALS.find(m => m.id === metal)!;

    const categories = useMemo(() => {
        const cats = Array.from(new Set(stones.map(s => s.category).filter(Boolean)));
        return ["all", ...cats.sort()];
    }, [stones]);

    const visibleStones = useMemo(() =>
            catFilter === "all" ? stones : stones.filter(s => s.category === catFilter),
        [stones, catFilter]
    );

    function go(n: Step) {
        if (n === step) return;
        setPrevStep(step);
        setAnimating(true);
        setTimeout(() => {
            setStep(n);
            setAnimating(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 220);
    }

    function selectStone(s: StoneForConfigurator) {
        setStone(s);
        setPanelKey(k => k + 1);
        go(1);
    }

    function selectRing(r: RingShape) {
        setRing(r);
        setPanelKey(k => k + 1);
        go(2);
    }

    function buildMsg() {
        if (!stone || !ring) return "";
        const wt = typeof stone.carat === "number" ? ` (${stone.carat} ct)` : "";
        return `Hello, I'd like to enquire about a bespoke ring:\n\n• Stone: ${stone.name}${wt}${stone.origin ? ` — ${stone.origin}` : ""}\n• Stone price: ${stone.priceDisplay}\n• Ring style: ${ring.label}\n• Metal: ${metalObj.label}\n\nPlease share setting pricing, availability, and next steps. Thank you.`;
    }

    // direction: going forward = slide left, going back = slide right
    const goingForward = step >= prevStep;
    const stepAnim = animating
        ? (goingForward ? "cfg-exit-left" : "cfg-exit-right")
        : (goingForward ? "cfg-enter-right" : "cfg-enter-left");

    /* ── Desktop left panel ── */
    const Panel = () => (
        <aside className="cfg-panel">
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 32 }}>
                {(["Stone","Ring","Enquire"] as const).map((lbl, i) => (
                    <button key={i} type="button"
                            disabled={step < i}
                            onClick={() => step >= i ? go(i as Step) : undefined}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                background: "none", border: "none", cursor: step >= i ? "pointer" : "default",
                                fontFamily: F, padding: "8px 0", textAlign: "left",
                                opacity: step === i ? 1 : step > i ? 0.55 : 0.22,
                                transition: "opacity 0.3s ease",
                            }}
                    >
                        <span style={{
                            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, fontFamily: FM,
                            background: step > i ? "#111" : step === i ? "#111" : "transparent",
                            color: step >= i ? "#fff" : "#999",
                            border: `1.5px solid ${step >= i ? "#111" : "#ccc"}`,
                            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                        }}>{step > i ? "✓" : i + 1}</span>
                        <span style={{ fontSize: 12, fontFamily: FM, letterSpacing: "0.04em", color: "#111" }}>{lbl}</span>
                    </button>
                ))}
            </div>

            {/* Preview — re-animates when panelKey changes */}
            <div key={panelKey} className="cfg-panel-preview" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
                {!stone && !ring && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 32 }}>
                        <div style={{ fontSize: 48, opacity: 0.08, lineHeight: 1 }}>◇</div>
                        <p style={{ fontSize: 12, fontFamily: FM, color: "#bbb", margin: "12px 0 0", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" }}>Your ring will<br/>appear here</p>
                    </div>
                )}
                {stone && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#bbb", fontFamily: FM }}>Stone Selected</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#fafafa", border: "1px solid #f0f0f0", transition: "all 0.3s ease" }}>
                            {stone.imageUrl
                                ? <img src={stone.imageUrl} alt={stone.name} style={{ width: 52, height: 52, objectFit: "cover", flexShrink: 0 }} />
                                : <div style={{ width: 52, height: 52, background: stone.dominantColor, flexShrink: 0 }} />
                            }
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, fontFamily: F, marginBottom: 2 }}>{stone.name}</div>
                                <div style={{ fontSize: 11, color: "#aaa", fontFamily: FM }}>{[stone.origin, typeof stone.carat === "number" && `${stone.carat} ct`].filter(Boolean).join(" · ")}</div>
                                <div style={{ fontSize: 14, fontFamily: F, marginTop: 2 }}>{stone.priceDisplay}</div>
                            </div>
                        </div>
                        {step > 0 && <button type="button" style={{ background: "none", border: "none", padding: 0, fontSize: 11, fontFamily: FM, color: "#aaa", cursor: "pointer", textDecoration: "underline", textAlign: "left", transition: "color 0.15s" }} onClick={() => { go(0); setStone(null); setRing(null); }}>Change stone</button>}
                    </div>
                )}
                {ring && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#bbb", fontFamily: FM }}>Setting Selected</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#fafafa", border: "1px solid #f0f0f0" }}>
                            <div style={{ width: 52, height: 52, background: "#f5f5f5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                <img src={ring.images[metal]} alt={ring.label} style={{ width: "100%", height: "100%", objectFit: "contain", filter: metalObj.filter ?? "none", transition: "filter 0.4s ease" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, fontFamily: F, marginBottom: 2 }}>{ring.label}</div>
                                <div style={{ fontSize: 11, color: "#aaa", fontFamily: FM, transition: "all 0.2s" }}>{metalObj.short}</div>
                            </div>
                        </div>
                        {step > 1 && <button type="button" style={{ background: "none", border: "none", padding: 0, fontSize: 11, fontFamily: FM, color: "#aaa", cursor: "pointer", textDecoration: "underline", textAlign: "left" }} onClick={() => { go(1); setRing(null); }}>Change ring</button>}
                    </div>
                )}
                {stone && ring && (
                    <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#bbb", fontFamily: FM }}>Stone price</div>
                        <div style={{ fontSize: 22, fontFamily: F, fontWeight: 400, color: "#111", margin: "4px 0 2px" }}>{stone.priceDisplay}</div>
                        <div style={{ fontSize: 11, fontFamily: FM, color: "#aaa" }}>+ setting (quoted on enquiry)</div>
                    </div>
                )}
            </div>
        </aside>
    );

    return (
        <div style={{ fontFamily: F, background: "#fafafa", minHeight: "100vh" }}>

            {/* ── MOBILE STEP BAR ── */}
            <div className="cfg-mobile-bar">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
                    {(["Stone","Ring","Enquire"] as const).map((lbl, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center" }}>
                            <button type="button"
                                    onClick={() => step >= i ? go(i as Step) : undefined}
                                    style={{
                                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                                        background: "none", border: "none",
                                        cursor: step >= i ? "pointer" : "default", padding: "0 12px",
                                    }}
                            >
                                <span style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: 700, fontFamily: FM,
                                    background: step > i ? "#111" : step === i ? "#111" : "#e8e8e8",
                                    color: step >= i ? "#fff" : "#aaa",
                                    border: "none",
                                    transition: "background 0.35s cubic-bezier(0.4,0,0.2,1), color 0.35s ease",
                                }}>{step > i ? "✓" : i + 1}</span>
                                <span style={{ fontSize: 10, fontFamily: FM, color: step === i ? "#111" : "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.3s ease" }}>{lbl}</span>
                            </button>
                            {i < 2 && <div style={{ width: 32, height: 1, background: step > i ? "#111" : "#e0e0e0", transition: "background 0.4s ease" }} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── LAYOUT ── */}
            <div className="cfg-split">
                <Panel />
                <main style={{ background: "#fafafa", minHeight: "100vh", overflow: "hidden" }}>

                    {/* Step wrapper — animated */}
                    <div className={`cfg-step-anim ${stepAnim}`}>

                        {/* ══ STEP 0: STONE ══ */}
                        {step === 0 && (
                            <div className="cfg-step-wrap">
                                <header style={{ marginBottom: 40 }}>
                                    <span style={{ display: "block", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#bbb", fontFamily: FM, marginBottom: 10 }}>Step 1 — Stone</span>
                                    <h1 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 10px", fontFamily: F }}>Which stone speaks to you?</h1>
                                    <p style={{ fontSize: 15, color: "#888", lineHeight: 1.65, fontWeight: 300, maxWidth: 480, margin: 0, fontFamily: F }}>Every stone is individually sourced from Sri Lanka and hand-selected for quality.</p>
                                </header>

                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
                                    {categories.map(cat => {
                                        const on = catFilter === cat;
                                        return (
                                            <button key={cat} type="button" onClick={() => setCatFilter(cat)} style={{
                                                padding: "6px 14px", fontSize: 12, cursor: "pointer",
                                                border: "1px solid", letterSpacing: "0.02em",
                                                transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                                background: on ? "#111" : "#fff",
                                                color:      on ? "#fff" : "#555",
                                                borderColor: on ? "#111" : "#e0e0e0",
                                                fontFamily: FM,
                                                transform: on ? "none" : "none",
                                            }}>
                                                {cat === "all" ? "All" : cat}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {visibleStones.map((s, i) => (
                                        <StoneRow key={s._id} stone={s} index={i} onSelect={() => selectStone(s)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ══ STEP 1: RING ══ */}
                        {step === 1 && (
                            <div className="cfg-step-wrap">
                                <header style={{ marginBottom: 40 }}>
                                    <span style={{ display: "block", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#bbb", fontFamily: FM, marginBottom: 10 }}>Step 2 — Ring Style</span>
                                    <h1 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 10px", fontFamily: F }}>Choose your setting.</h1>
                                    <p style={{ fontSize: 15, color: "#888", lineHeight: 1.65, fontWeight: 300, maxWidth: 480, margin: 0, fontFamily: F }}>Our jewellers will hand-fabricate the setting around your chosen stone.</p>
                                </header>

                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 10, letterSpacing: "0.20em", textTransform: "uppercase", color: "#aaa", fontFamily: FM }}>Metal</span>
                                    {METALS.map(m => {
                                        const on = metal === m.id;
                                        return (
                                            <button key={m.id} type="button" onClick={() => setMetal(m.id)}
                                                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", transition: "transform 0.2s ease" }}
                                                    title={m.label}
                                            >
                                                <span style={{ width: 28, height: 28, borderRadius: "50%", background: m.swatch, display: "block", boxShadow: on ? "0 0 0 3px #fff,0 0 0 5px #111" : "0 1px 4px rgba(0,0,0,0.15)", transition: "box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.2s ease", transform: on ? "scale(1.15)" : "scale(1)" }} />
                                                <span style={{ fontSize: 10, fontFamily: FM, color: on ? "#111" : "#888", transition: "color 0.2s ease" }}>{m.short}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="cfg-rg">
                                    {RING_SHAPES.map((r, i) => (
                                        <RingTile key={r.id} ring={r} metal={metal} metalObj={metalObj} index={i} onSelect={() => selectRing(r)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ══ STEP 2: ENQUIRE ══ */}
                        {step === 2 && stone && ring && (
                            <div className="cfg-step-wrap">
                                <header style={{ marginBottom: 40 }}>
                                    <span style={{ display: "block", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#bbb", fontFamily: FM, marginBottom: 10 }}>Step 3 — Enquire</span>
                                    <h1 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 10px", fontFamily: F }}>Ready to bring it to life.</h1>
                                    <p style={{ fontSize: 15, color: "#888", lineHeight: 1.65, fontWeight: 300, maxWidth: 480, margin: 0, fontFamily: F }}>Send us an enquiry and we'll respond within 24 hours with setting pricing and next steps.</p>
                                </header>

                                {/* Mobile summary */}
                                <div className="cfg-mobile-summary">
                                    <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                                        {stone.imageUrl && <img src={stone.imageUrl} alt={stone.name} style={{ width: 64, height: 64, objectFit: "cover", border: "1px solid #e8e8e8" }} />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 11, fontFamily: FM, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Stone</div>
                                            <div style={{ fontSize: 18, fontFamily: F }}>{stone.name}</div>
                                            <div style={{ fontSize: 12, color: "#aaa", fontFamily: FM }}>{stone.priceDisplay}</div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 11, fontFamily: FM, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Ring</div>
                                            <div style={{ fontSize: 18, fontFamily: F }}>{ring.label}</div>
                                            <div style={{ fontSize: 12, color: "#aaa", fontFamily: FM }}>{metalObj.short}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary table — staggered rows */}
                                <div style={{ background: "#fff", border: "1px solid #e8e8e8", padding: "4px 24px", marginBottom: 24 }}>
                                    {([
                                        ["Stone",         stone.name],
                                        ["Origin",        stone.origin || "—"],
                                        ["Carat Weight",  typeof stone.carat === "number" ? `${stone.carat} ct` : "—"],
                                        ["Stone Price",   stone.priceDisplay],
                                        ["Setting Style", ring.label],
                                        ["Metal",         metalObj.label],
                                        ["Setting Cost",  "Quoted on enquiry"],
                                    ] as [string,string][]).map(([k, v], i, a) => (
                                        <div key={k} className="cfg-table-row" style={{ animationDelay: `${i * 60}ms` }}>
                                            <span style={{ fontSize: 11, fontFamily: FM, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>{k}</span>
                                            <span style={{ fontSize: 16, fontFamily: F, color: "#111", textAlign: "right" }}>{v}</span>
                                        </div>
                                    ))}
                                </div>

                                <p style={{ fontSize: 13, fontFamily: FM, color: "#aaa", lineHeight: 1.7, margin: "0 0 24px" }}>
                                    No commitment required. We'll walk you through every detail before any work begins.
                                </p>

                                <a href={`https://wa.me/16084212077?text=${encodeURIComponent(buildMsg())}`}
                                   target="_blank" rel="noopener noreferrer"
                                   className="cfg-cta-primary">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L.057 23.854a.75.75 0 0 0 .92.92l6.052-1.47A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.916 0-3.717-.504-5.272-1.385l-.376-.215-3.896.946.966-3.831-.232-.381A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                                    Enquire via WhatsApp
                                </a>

                                <a href={`mailto:ceylongemcompany.inquiries@gmail.com?subject=${encodeURIComponent(`Bespoke Ring Enquiry — ${stone.name} · ${ring.label}`)}&body=${encodeURIComponent(buildMsg())}`}
                                   className="cfg-cta-secondary">
                                    Enquire via Email
                                </a>

                                <div style={{ display: "flex", gap: 20 }}>
                                    <button type="button" className="cfg-back-btn" onClick={() => go(1)}>← Change ring</button>
                                    <button type="button" className="cfg-back-btn" onClick={() => { setStone(null); setRing(null); go(0); }}>← Start over</button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <style>{`
                /* ── Keyframes ── */
                @keyframes cfg-in-right  { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
                @keyframes cfg-in-left   { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
                @keyframes cfg-out-left  { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-32px); } }
                @keyframes cfg-out-right { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(32px); } }
                @keyframes cfg-fade-up   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                @keyframes cfg-panel-in  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

                /* ── Step animation wrapper ── */
                .cfg-step-anim { will-change: transform, opacity; }
                .cfg-enter-right { animation: cfg-in-right 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
                .cfg-enter-left  { animation: cfg-in-left  0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
                .cfg-exit-left   { animation: cfg-out-left  0.22s cubic-bezier(0.4,0,0.2,1) forwards; }
                .cfg-exit-right  { animation: cfg-out-right 0.22s cubic-bezier(0.4,0,0.2,1) forwards; }

                /* ── Panel preview fade-in ── */
                .cfg-panel-preview { animation: cfg-panel-in 0.4s cubic-bezier(0.4,0,0.2,1) both; }

                /* ── Stone rows stagger ── */
                .cfg-stone-row {
                    animation: cfg-fade-up 0.4s cubic-bezier(0.4,0,0.2,1) both;
                }

                /* ── Ring tiles stagger ── */
                .cfg-ring-tile {
                    animation: cfg-fade-up 0.4s cubic-bezier(0.4,0,0.2,1) both;
                }

                /* ── Summary table rows ── */
                .cfg-table-row {
                    display: flex; justify-content: space-between; align-items: baseline;
                    padding: 13px 0; border-bottom: 1px solid #f0f0f0; gap: 12px;
                    animation: cfg-fade-up 0.35s cubic-bezier(0.4,0,0.2,1) both;
                }
                .cfg-table-row:last-child { border-bottom: none; }

                /* ── CTA buttons ── */
                .cfg-cta-primary {
                    display: flex; align-items: center; justify-content: center; gap: 10;
                    padding: 16px 28px; margin-bottom: 10px;
                    background: #111; color: #fff; text-decoration: none;
                    font-size: 13px; letter-spacing: 0.10em; text-transform: uppercase;
                    font-family: ${FM}; font-weight: 600;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }
                .cfg-cta-primary:hover  { opacity: 0.85; transform: translateY(-1px); }
                .cfg-cta-secondary {
                    display: block; padding: 15px 28px; margin-bottom: 20px;
                    border: 1px solid #ddd; color: #666; text-decoration: none;
                    font-size: 13px; letter-spacing: 0.10em; text-transform: uppercase;
                    text-align: center; font-family: ${FM};
                    transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                }
                .cfg-cta-secondary:hover { border-color: #111; color: #111; transform: translateY(-1px); }
                .cfg-back-btn {
                    background: none; border: none; color: #bbb; font-size: 12px;
                    cursor: pointer; font-family: ${FM}; letter-spacing: 0.04em; padding: 4px 0;
                    transition: color 0.15s ease;
                }
                .cfg-back-btn:hover { color: #111; }

                /* ── Layout ── */
                .cfg-split       { display: grid; grid-template-columns: 320px 1fr; min-height: 100vh; }
                .cfg-panel       { position: sticky; top: 0; height: 100vh; overflow-y: auto; background: #fff; border-right: 1px solid #e8e8e8; display: flex; flex-direction: column; padding: 32px 28px; }
                .cfg-step-wrap   { max-width: 900px; margin: 0 auto; padding: 64px 5vw 100px; }
                .cfg-rg          { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
                .cfg-mobile-bar  { display: none; }
                .cfg-mobile-summary { display: none; }

                @media (max-width: 1100px) {
                    .cfg-split { grid-template-columns: 260px 1fr; }
                    .cfg-rg    { grid-template-columns: repeat(2,1fr); }
                }
                @media (max-width: 760px) {
                    .cfg-panel          { display: none !important; }
                    .cfg-mobile-bar     { display: block !important; padding: 16px 5vw 12px; background: #fff; border-bottom: 1px solid #e8e8e8; position: sticky; top: 0; z-index: 100; }
                    .cfg-mobile-summary { display: block !important; }
                    .cfg-split          { grid-template-columns: 1fr !important; }
                    .cfg-step-wrap      { padding: 28px 5vw 80px !important; }
                    .cfg-rg             { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
                }
                @media (max-width: 440px) {
                    .cfg-rg { grid-template-columns: repeat(2,1fr) !important; }
                }
            `}</style>
        </div>
    );
}

/* ── Stone Row ── */
function StoneRow({ stone, onSelect, index }: { stone: StoneForConfigurator; onSelect: () => void; index: number }) {
    const [hov, setHov] = useState(false);
    return (
        <button type="button" onClick={onSelect}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                className="cfg-stone-row"
                style={{
                    display: "flex", alignItems: "stretch",
                    background: "#fff",
                    border: `1px solid ${hov ? "#111" : "#e8e8e8"}`,
                    cursor: "pointer", color: "#111", padding: 0,
                    textAlign: "left", overflow: "hidden", width: "100%",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    boxShadow: hov ? "0 4px 24px rgba(0,0,0,0.09)" : "none",
                    transform: hov ? "translateY(-1px)" : "none",
                    animationDelay: `${Math.min(index * 40, 400)}ms`,
                }}
        >
            <div style={{ width: 96, minWidth: 96, overflow: "hidden", background: "#f5f5f5" }}>
                {stone.imageUrl
                    ? <img src={stone.imageUrl} alt={stone.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 96, transform: hov ? "scale(1.08)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
                    : <div style={{ width: "100%", height: "100%", minHeight: 96, background: stone.dominantColor }} />
                }
            </div>
            <div style={{ flex: 1, padding: "14px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 19, fontWeight: 400, lineHeight: 1.1, marginBottom: 4, fontFamily: `"Crimson Pro","Cormorant Garamond","EB Garamond",Georgia,serif` }}>{stone.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa", fontFamily: `"Inter","Helvetica Neue",Arial,sans-serif`, letterSpacing: "0.02em" }}>
                        {[stone.origin, typeof stone.carat === "number" && `${stone.carat} ct`, stone.category].filter(Boolean).join("  ·  ")}
                    </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 300, marginBottom: 4, fontFamily: `"Crimson Pro","Cormorant Garamond","EB Garamond",Georgia,serif` }}>{stone.priceDisplay}</div>
                    <div style={{
                        fontSize: 10, fontFamily: `"Inter","Helvetica Neue",Arial,sans-serif`, letterSpacing: "0.14em", textTransform: "uppercase",
                        color: hov ? "#111" : "#ccc", transition: "color 0.2s ease, background 0.2s ease, border-color 0.2s ease",
                        padding: "3px 8px", border: `1px solid ${hov ? "#ddd" : "transparent"}`,
                        background: hov ? "#f5f5f5" : "transparent",
                    }}>Select →</div>
                </div>
            </div>
        </button>
    );
}

/* ── Ring Tile ── */
function RingTile({ ring, metal, metalObj, onSelect, index }: {
    ring: RingShape; metal: MetalId; metalObj: typeof METALS[0]; onSelect: () => void; index: number;
}) {
    const [hov, setHov] = useState(false);
    return (
        <button type="button" onClick={onSelect}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                className="cfg-ring-tile"
                style={{
                    display: "flex", flexDirection: "column", padding: 0,
                    background: "#fff", border: `1px solid ${hov ? "#111" : "#e8e8e8"}`,
                    cursor: "pointer", color: "#111", textAlign: "left", overflow: "hidden",
                    width: "100%",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    boxShadow: hov ? "0 6px 28px rgba(0,0,0,0.10)" : "none",
                    transform: hov ? "translateY(-2px)" : "none",
                    animationDelay: `${Math.min(index * 30, 360)}ms`,
                }}
        >
            <div style={{ aspectRatio: "1/1", background: "#f8f8f8", overflow: "hidden", width: "100%" }}>
                <img src={ring.images[metal]} alt={ring.label} style={{
                    width: "100%", height: "100%", objectFit: "contain", display: "block",
                    filter: metalObj.filter ?? "none",
                    transform: hov ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1), filter 0.4s ease",
                }} />
            </div>
            <div style={{ padding: "10px 12px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 400, fontFamily: `"Crimson Pro","Cormorant Garamond","EB Garamond",Georgia,serif` }}>{ring.label}</span>
                <span style={{ fontSize: 9, fontFamily: `"Inter","Helvetica Neue",Arial,sans-serif`, letterSpacing: "0.16em", textTransform: "uppercase", color: hov ? "#111" : "#ccc", transition: "color 0.2s ease" }}>→</span>
            </div>
        </button>
    );
}