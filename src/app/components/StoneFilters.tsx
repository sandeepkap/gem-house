// src/app/components/StoneFilters.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import Reveal from "@/app/components/Reveal";

type StoneListItem = {
    _id: string;
    name: string;
    category?: string;
    realCategory?: string;
    origin?: string;
    carat?: number;
    price?: number | null;
    images?: any[];
};

function uniqSorted(values: (string | undefined)[]) {
    return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function matchesCategory(stoneCategoryRaw: unknown, filter: string): boolean {
    if (!stoneCategoryRaw || !filter) return false;
    const stoneCategory = typeof stoneCategoryRaw === "string"
        ? stoneCategoryRaw
        : Array.isArray(stoneCategoryRaw) ? stoneCategoryRaw.join(" ") : String(stoneCategoryRaw);
    const lower = stoneCategory.toLowerCase();
    const f = filter.toLowerCase().trim();
    if (f === "sapphire") return lower.includes("sapphire") && !lower.includes("padparadscha");
    return lower.includes(f);
}

const birthstoneOptions: { label: string; filters: string[] }[] = [
    { label: "January (Garnet)", filters: ["garnet"] },
    { label: "May (Emerald)", filters: ["emerald"] },
    { label: "June (Alexandrite, Pearl)", filters: ["alexandrite", "pearl"] },
    { label: "July (Ruby)", filters: ["ruby"] },
    { label: "August (Spinel, Peridot)", filters: ["spinel", "peridot"] },
    { label: "September (Sapphire)", filters: ["sapphire"] },
    { label: "October (Opal, Tourmaline)", filters: ["opal", "tourmaline"] },
];

const gemTypeOptions: { label: string; filters: string[] }[] = [
    { label: "Sapphire", filters: ["sapphire"] },
    { label: "Ruby", filters: ["ruby"] },
    { label: "Padparadscha", filters: ["padparadscha"] },
    { label: "Spinel", filters: ["spinel"] },
    { label: "Garnet", filters: ["garnet"] },
    { label: "Emerald", filters: ["emerald"] },
    { label: "Alexandrite", filters: ["alexandrite"] },
    { label: "Opal", filters: ["opal"] },
    { label: "Tourmaline", filters: ["tourmaline"] },
    { label: "Peridot", filters: ["peridot"] },
    { label: "Pearl", filters: ["pearl"] },
];

export default function StoneFilters({ stones }: { stones: StoneListItem[] }) {
    const defaultLocations = ["Sri Lanka", "USA"];
    const locations = useMemo(() => {
        const fromData = uniqSorted(stones.map((s) => s.origin));
        return Array.from(new Set([...defaultLocations, ...fromData])).sort((a, b) => a.localeCompare(b));
    }, [stones]);

    const caratMinMax = useMemo(() => ({ min: 0, max: 9 }), []);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [caratRange, setCaratRange] = useState<[number, number]>([caratMinMax.min, caratMinMax.max]);
    const [selectedBirthstones, setSelectedBirthstones] = useState<string[]>([]);
    const [selectedGemTypes, setSelectedGemTypes] = useState<string[]>([]);
    const [expanded, setExpanded] = useState({ birthstone: true, gemType: true, location: true, carat: true });

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 980px)");
        const apply = () => setIsMobile(mq.matches);
        apply();
        mq.addEventListener?.("change", apply);
        return () => mq.removeEventListener?.("change", apply);
    }, []);

    useEffect(() => { setCaratRange([caratMinMax.min, caratMinMax.max]); }, [caratMinMax.min, caratMinMax.max]);
    useEffect(() => { if (!isMobile) setMobileFiltersOpen(false); }, [isMobile]);
    useEffect(() => {
        if (!isMobile || !mobileFiltersOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [isMobile, mobileFiltersOpen]);

    function toggle(arr: string[], v: string) {
        return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    }

    const selectedCategoryFilters = useMemo<string[]>(() => {
        const out: string[] = [];
        for (const opt of birthstoneOptions) if (selectedBirthstones.includes(opt.label)) out.push(...opt.filters);
        for (const opt of gemTypeOptions) if (selectedGemTypes.includes(opt.label)) out.push(...opt.filters);
        return Array.from(new Set(out));
    }, [selectedBirthstones, selectedGemTypes]);

    const filtered = useMemo(() => {
        return stones.filter((s) => {
            if (selectedLocations.length > 0) {
                if (!s.origin || !selectedLocations.includes(s.origin)) return false;
            }
            if (selectedCategoryFilters.length > 0) {
                const haystack = s.realCategory ?? s.category;
                const matchesAny = selectedCategoryFilters.some((f) => matchesCategory(haystack, f));
                if (!matchesAny) return false;
            }
            if (typeof s.carat === "number") {
                if (s.carat < caratRange[0] || s.carat > caratRange[1]) return false;
            } else {
                const isCaratFiltered = caratRange[0] !== caratMinMax.min || caratRange[1] !== caratMinMax.max;
                if (isCaratFiltered) return false;
            }
            return true;
        });
    }, [stones, selectedLocations, selectedCategoryFilters, caratRange, caratMinMax.min, caratMinMax.max]);

    function resetAll() {
        setSelectedLocations([]);
        setSelectedBirthstones([]);
        setSelectedGemTypes([]);
        setCaratRange([caratMinMax.min, caratMinMax.max]);
    }

    const hasActiveFilters =
        selectedLocations.length > 0 ||
        selectedBirthstones.length > 0 ||
        selectedGemTypes.length > 0 ||
        caratRange[0] !== caratMinMax.min ||
        caratRange[1] !== caratMinMax.max;

    const filterSections = (
        <>
            <Section
                title="Birthstone"
                open={expanded.birthstone}
                onToggle={() => setExpanded(p => ({ ...p, birthstone: !p.birthstone }))}
            >
                {birthstoneOptions.map((opt) => (
                    <CheckRow
                        key={opt.label}
                        label={opt.label}
                        checked={selectedBirthstones.includes(opt.label)}
                        onChange={() => setSelectedBirthstones(p => toggle(p, opt.label))}
                    />
                ))}
            </Section>

            <Section
                title="Gem Type"
                open={expanded.gemType}
                onToggle={() => setExpanded(p => ({ ...p, gemType: !p.gemType }))}
            >
                {gemTypeOptions.map((opt) => (
                    <CheckRow
                        key={opt.label}
                        label={opt.label}
                        checked={selectedGemTypes.includes(opt.label)}
                        onChange={() => setSelectedGemTypes(p => toggle(p, opt.label))}
                    />
                ))}
            </Section>

            {locations.length > 0 && (
                <Section
                    title="Origin"
                    open={expanded.location}
                    onToggle={() => setExpanded(p => ({ ...p, location: !p.location }))}
                >
                    {locations.map((loc) => (
                        <CheckRow
                            key={loc}
                            label={loc}
                            checked={selectedLocations.includes(loc)}
                            onChange={() => setSelectedLocations(p => toggle(p, loc))}
                        />
                    ))}
                </Section>
            )}

            <Section
                title="Carat Weight"
                open={expanded.carat}
                onToggle={() => setExpanded(p => ({ ...p, carat: !p.carat }))}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                    <span style={smallLabelStyle}>Minimum</span>
                    <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15 }}>{caratRange[0]} ct</span>
                </div>
                <input
                    type="range"
                    min={caratMinMax.min}
                    max={caratMinMax.max}
                    step={0.5}
                    value={caratRange[0]}
                    onChange={(e) => setCaratRange(([a, b]) => [Math.min(Number(e.target.value), b), b])}
                    style={sliderStyle}
                />
            </Section>
        </>
    );

    return (
        <>
            {/* Mobile top bar */}
            {isMobile && (
                <div style={mobileBarStyle}>
                    <button type="button" style={mobileFilterBtnStyle} onClick={() => setMobileFiltersOpen(true)}>
                        Filter
                    </button>
                    {hasActiveFilters && (
                        <button type="button" style={mobileClearBtnStyle} onClick={resetAll}>Clear</button>
                    )}
                </div>
            )}

            {/* Mobile drawer */}
            {isMobile && (
                <>
                    <div className={`filters-overlay ${mobileFiltersOpen ? "open" : ""}`} onClick={() => setMobileFiltersOpen(false)} />
                    <div className={`filters-drawer ${mobileFiltersOpen ? "open" : ""}`}>
                        <div style={drawerHeaderStyle}>
                            <div style={smallLabelStyle}>Filters</div>
                            <button type="button" style={drawerCloseStyle} onClick={() => setMobileFiltersOpen(false)}>Close ✕</button>
                        </div>
                        {hasActiveFilters && (
                            <button type="button" style={drawerClearStyle} onClick={resetAll}>Clear All</button>
                        )}
                        {filterSections}
                        <button type="button" style={drawerApplyStyle} onClick={() => setMobileFiltersOpen(false)}>
                            View Results
                        </button>
                    </div>
                </>
            )}

            <div style={wrapStyle} className="stones-wrap">
                <aside style={sidebarStyle} className="filter-sidebar">
                    <div style={sidebarHeadStyle}>
                        <span style={smallLabelStyle}>Refine</span>
                        {hasActiveFilters && (
                            <button onClick={resetAll} style={clearAllStyle} type="button">Clear All</button>
                        )}
                    </div>
                    {filterSections}
                </aside>

                <section className="filter-results">
                    {filtered.length > 0 ? (
                        <div style={gridStyle} className="stones-grid">
                            {filtered.map((s, i) => {
                                const cover = s.images?.[0];
                                const idx = String(i + 1).padStart(2, "0");
                                return (
                                    <Reveal key={s._id} delayMs={Math.min(i * 40, 360)}>
                                        <Link href={`/stones/id/${encodeURIComponent(s._id)}`} style={cardStyle} className="stone-card">
                                            <div style={stoneTopMetaStyle}>
                                                <span style={stoneIndexStyle}>{idx}</span>
                                            </div>
                                            <div style={imageFrameStyle}>
                                                {cover ? (
                                                    <Image
                                                        src={urlFor(cover).width(900).height(1100).fit("crop").auto("format").url()}
                                                        alt={s.name}
                                                        width={900}
                                                        height={1100}
                                                        style={imageStyle}
                                                    />
                                                ) : (
                                                    <div style={noImageStyle}>No image</div>
                                                )}
                                            </div>
                                            <div style={cardFooterStyle}>
                                                <div style={stoneNameStyle}>{s.name}</div>
                                                <div style={{ fontFamily: "var(--serif)", fontSize: 14, color: "#000" }}>
                                                    {typeof s.carat === "number" && <span style={{ opacity: 0.5 }}>{s.carat} ct&nbsp;&nbsp;</span>}
                                                    <em style={{ fontStyle: "italic" }}>{s.category}</em>
                                                </div>
                                            </div>
                                        </Link>
                                    </Reveal>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={emptyStateStyle}>
                            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 18 }}>
                                No stones match your current filters.
                            </p>
                            <button onClick={resetAll} style={{ ...clearAllStyle, marginTop: 16 }} type="button">Clear filters</button>
                        </div>
                    )}
                </section>
            </div>

            <style>{`
                @media (max-width: 980px) {
                    .stones-wrap { grid-template-columns: 1fr !important; gap: 0 !important; }
                    .filter-sidebar { display: none !important; }
                }
                @media (max-width: 640px) {
                    .stones-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
                    .stone-card > div > div:last-child > div:first-child {
                        font-size: 16px !important;
                    }
                }
                @media (max-width: 440px) {
                    .stones-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
                    .stone-card > div > div:last-child > div:first-child {
                        font-size: 15px !important;
                        line-height: 1.15 !important;
                    }
                }
            `}</style>
        </>
    );
}

/* ── Subcomponents ── */

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
    return (
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.12)", paddingBottom: 20, marginBottom: 20 }}>
            <button onClick={onToggle} style={sectionHeadStyle} type="button">
                <span style={{ ...smallLabelStyle, color: "#000" }}>{title}</span>
                <span style={{ fontSize: 18, opacity: 0.4 }}>{open ? "−" : "+"}</span>
            </button>
            {open && <div style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>}
        </div>
    );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
    return (
        <label style={checkRowStyle}>
            <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: "#000", width: 14, height: 14, cursor: "pointer" }} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 15 }}>{label}</span>
        </label>
    );
}

/* ── Styles ── */

const wrapStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 72,
    alignItems: "start",
};
const sidebarStyle: React.CSSProperties = {
    position: "sticky",
    top: 100,
    paddingRight: 8,
};
const sidebarHeadStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: "1px solid #000",
};
const smallLabelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    fontWeight: 500,
    color: "#000",
};
const clearAllStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#000",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
    textUnderlineOffset: 3,
};
const sectionHeadStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
};
const checkRowStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10,
    cursor: "pointer",
};
const sliderStyle: React.CSSProperties = {
    width: "100%", height: 4,
    accentColor: "#000",
    WebkitAppearance: "none", appearance: "none",
    cursor: "pointer",
    outline: "none",
};
const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 48,
};
const cardStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: 14,
};
const stoneTopMetaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    gap: 10,
    paddingBottom: 10,
    borderBottom: "1px solid #000",
};
const stoneIndexStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.02em",
    fontVariantNumeric: "tabular-nums",
};
const stoneOriginStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#000",
    opacity: 0.65,
};
const imageFrameStyle: React.CSSProperties = {
    aspectRatio: "4 / 5",
    overflow: "hidden",
    background: "#E8E2D4",
    position: "relative",
};
const imageStyle: React.CSSProperties = {
    width: "100%", height: "100%",
    objectFit: "cover",
    transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
};
const noImageStyle: React.CSSProperties = {
    height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "rgba(0,0,0,0.35)",
};
const cardFooterStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
};
const stoneNameStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 22,
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
};
const emptyStateStyle: React.CSSProperties = {
    textAlign: "center", padding: "100px 20px",
};

/* Mobile */
const mobileBarStyle: React.CSSProperties = {
    position: "sticky",
    top: 68,
    zIndex: 50,
    display: "flex", gap: 12, alignItems: "center",
    padding: "14px 0", marginBottom: 24,
    background: "var(--paper, #F4F1EB)",
    borderBottom: "1px solid rgba(0,0,0,0.15)",
};
const mobileFilterBtnStyle: React.CSSProperties = {
    background: "#000", color: "#FFF",
    border: "1px solid #000",
    padding: "14px 26px",
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontWeight: 500,
};
const mobileClearBtnStyle: React.CSSProperties = {
    background: "transparent", border: "none",
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
};
const drawerHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid rgba(0,0,0,0.15)",
};
const drawerCloseStyle: React.CSSProperties = {
    background: "transparent", border: "none",
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    cursor: "pointer",
};
const drawerClearStyle: React.CSSProperties = {
    ...clearAllStyle,
    padding: "6px 0 18px",
};
const drawerApplyStyle: React.CSSProperties = {
    marginTop: 16, width: "100%",
    background: "#000", color: "#FFF",
    border: "none",
    padding: "16px",
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontWeight: 500,
};