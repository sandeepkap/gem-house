"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import Reveal from "@/app/components/Reveal";

type StoneListItem = {
    _id: string;
    name: string;
    category?: string;       // On your home page you overwrite this with price text
    realCategory?: string;   // Real category for filtering (your page.tsx sets this)
    origin?: string;
    carat?: number;
    price?: number | null;
    images?: any[];
};

function uniqSorted(values: (string | undefined)[]) {
    return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
        a.localeCompare(b)
    );
}

/**
 * Category matching:
 * - Uses realCategory if present (preferred), else falls back to category.
 * - Matches by substring (case-insensitive) so "Blue Sapphire" still matches "sapphire".
 * - Special-case: sapphire excludes padparadscha.
 */
function matchesCategory(stoneCategoryRaw: unknown, filter: string): boolean {
    if (!stoneCategoryRaw || !filter) return false;

    const stoneCategory =
        typeof stoneCategoryRaw === "string"
            ? stoneCategoryRaw
            : Array.isArray(stoneCategoryRaw)
                ? stoneCategoryRaw.join(" ")
                : String(stoneCategoryRaw);

    const lower = stoneCategory.toLowerCase();
    const f = filter.toLowerCase().trim();

    if (f === "sapphire") return lower.includes("sapphire") && !lower.includes("padparadscha");
    return lower.includes(f);
}

/* ------------------ OPTIONS (NO "JEWELRY") ------------------ */
/* Use real gem categories only. If none exist in stock, you’ll naturally get 0 results. */
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
        return Array.from(new Set([...defaultLocations, ...fromData])).sort((a, b) =>
            a.localeCompare(b)
        );
    }, [stones]);

    const caratMinMax = useMemo(() => ({ min: 0, max: 9 }), []);

    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [caratRange, setCaratRange] = useState<[number, number]>([
        caratMinMax.min,
        caratMinMax.max,
    ]);

    // ✅ Checkbox group state
    const [selectedBirthstones, setSelectedBirthstones] = useState<string[]>([]);
    const [selectedGemTypes, setSelectedGemTypes] = useState<string[]>([]);

    const [expandedSections, setExpandedSections] = useState({
        birthstone: true,
        gemType: true,
        location: true,
        carat: true,
    });

    useEffect(() => {
        setCaratRange([caratMinMax.min, caratMinMax.max]);
    }, [caratMinMax.min, caratMinMax.max]);

    function toggle(arr: string[], v: string) {
        return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // ✅ Derive selected category filters from the checked boxes (no conflicting state)
    const selectedCategoryFilters = useMemo<string[]>(() => {
        const out: string[] = [];

        for (const opt of birthstoneOptions) {
            if (selectedBirthstones.includes(opt.label)) out.push(...opt.filters);
        }
        for (const opt of gemTypeOptions) {
            if (selectedGemTypes.includes(opt.label)) out.push(...opt.filters);
        }

        return Array.from(new Set(out));
    }, [selectedBirthstones, selectedGemTypes]);

    const filtered = useMemo(() => {
        return stones.filter((s) => {
            // Location filter
            if (selectedLocations.length > 0) {
                if (!s.origin || !selectedLocations.includes(s.origin)) return false;
            }

            // Category filter
            if (selectedCategoryFilters.length > 0) {
                const haystack = s.realCategory ?? s.category;
                const matchesAny = selectedCategoryFilters.some((f) =>
                    matchesCategory(haystack, f)
                );
                if (!matchesAny) return false;
            }

            // Carat filter
            if (typeof s.carat === "number") {
                if (s.carat < caratRange[0] || s.carat > caratRange[1]) return false;
            } else {
                const isCaratFiltered =
                    caratRange[0] !== caratMinMax.min || caratRange[1] !== caratMinMax.max;
                if (isCaratFiltered) return false;
            }

            return true;
        });
    }, [stones, selectedLocations, selectedCategoryFilters, caratRange, caratMinMax.min, caratMinMax.max]);

    const countsByLocation = useMemo(() => {
        const m = new Map<string, number>();
        stones.forEach((s) => {
            if (!s.origin) return;
            m.set(s.origin, (m.get(s.origin) || 0) + 1);
        });
        return m;
    }, [stones]);

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

    return (
        <>
            <div style={wrapStyle} className="stones-filter-wrap">
                <aside style={sidebarStyle} className="filter-sidebar">
                    <div style={sidebarHeaderStyle}>
                        <h3 style={sidebarTitleStyle}>Refine Selection</h3>
                        {hasActiveFilters && (
                            <button onClick={resetAll} style={resetBtnStyle} type="button">
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Birthstone */}
                    <div style={filterSectionStyle}>
                        <button
                            onClick={() => toggleSection("birthstone")}
                            style={sectionHeaderStyle}
                            type="button"
                        >
                            <span style={sectionTitleStyle}>Birthstone</span>
                            <span style={chevronStyle}>
                                {expandedSections.birthstone ? "−" : "+"}
                            </span>
                        </button>

                        {expandedSections.birthstone && (
                            <div style={sectionContentStyle}>
                                {birthstoneOptions.map((opt) => (
                                    <label key={opt.label} style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={selectedBirthstones.includes(opt.label)}
                                            onChange={() =>
                                                setSelectedBirthstones((p) => toggle(p, opt.label))
                                            }
                                            style={checkboxInputStyle}
                                        />
                                        <span style={checkboxTextStyle}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Gem type */}
                    <div style={filterSectionStyle}>
                        <button
                            onClick={() => toggleSection("gemType")}
                            style={sectionHeaderStyle}
                            type="button"
                        >
                            <span style={sectionTitleStyle}>Gem type</span>
                            <span style={chevronStyle}>{expandedSections.gemType ? "−" : "+"}</span>
                        </button>

                        {expandedSections.gemType && (
                            <div style={sectionContentStyle}>
                                {gemTypeOptions.map((opt) => (
                                    <label key={opt.label} style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={selectedGemTypes.includes(opt.label)}
                                            onChange={() =>
                                                setSelectedGemTypes((p) => toggle(p, opt.label))
                                            }
                                            style={checkboxInputStyle}
                                        />
                                        <span style={checkboxTextStyle}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    {locations.length > 0 && (
                        <div style={filterSectionStyle}>
                            <button
                                onClick={() => toggleSection("location")}
                                style={sectionHeaderStyle}
                                type="button"
                            >
                                <span style={sectionTitleStyle}>Location</span>
                                <span style={chevronStyle}>
                                    {expandedSections.location ? "−" : "+"}
                                </span>
                            </button>

                            {expandedSections.location && (
                                <div style={sectionContentStyle}>
                                    {locations.map((loc) => (
                                        <label key={loc} style={checkboxLabelStyle}>
                                            <input
                                                type="checkbox"
                                                checked={selectedLocations.includes(loc)}
                                                onChange={() =>
                                                    setSelectedLocations((a) => toggle(a, loc))
                                                }
                                                style={checkboxInputStyle}
                                            />
                                            <span style={checkboxTextStyle}>{loc}</span>
                                            <span style={countStyle}>
                                                ({countsByLocation.get(loc) || 0})
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Carat Weight */}
                    <div style={filterSectionStyle}>
                        <button
                            onClick={() => toggleSection("carat")}
                            style={sectionHeaderStyle}
                            type="button"
                        >
                            <span style={sectionTitleStyle}>Weight</span>
                            <span style={chevronStyle}>{expandedSections.carat ? "−" : "+"}</span>
                        </button>

                        {expandedSections.carat && (
                            <div style={sectionContentStyle}>
                                <div style={rangeLabelsStyle}>
                                    <div style={rangeLabelTextStyle}>Minimum</div>
                                    <div style={rangeLabelValueStyle}>{caratRange[0]} ct</div>
                                </div>

                                <div style={sliderContainerStyle}>
                                    <div style={sliderTicksStyle}>
                                        {Array.from(
                                            { length: (caratMinMax.max - caratMinMax.min) / 0.5 + 1 },
                                            (_, i) => caratMinMax.min + i * 0.5
                                        ).map((value) => (
                                            <div key={value} style={sliderTickStyle}>
                                                <div style={sliderTickMarkStyle} />
                                                {value % 1 === 0 && (
                                                    <div style={sliderTickLabelStyle}>{value}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        type="range"
                                        min={caratMinMax.min}
                                        max={caratMinMax.max}
                                        step={0.5}
                                        value={caratRange[0]}
                                        onChange={(e) =>
                                            setCaratRange(([a, b]) => [
                                                Math.min(Number(e.target.value), b),
                                                b,
                                            ])
                                        }
                                        style={sliderStyle}
                                        className="range-slider"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                <section style={resultsStyle} className="filter-results">
                    <div style={resultsHeaderStyle}>
                        <div>
                            <div style={resultsKickerStyle}>Available Now</div>
                        </div>
                    </div>

                    {filtered.length > 0 ? (
                        <div style={gridStyle} className="stones-grid">
                            {filtered.map((s, index) => {
                                const cover = s.images?.[0];
                                return (
                                    <Reveal key={s._id} delayMs={index * 60}>
                                        <Link
                                            href={`/stones/id/${encodeURIComponent(s._id)}`}
                                            style={cardStyle}
                                            className="stone-card"
                                        >
                                            <div style={imageFrameStyle} className="stone-image-frame">
                                                {cover ? (
                                                    <Image
                                                        src={urlFor(cover).width(800).height(800).fit("max").url()}
                                                        alt={s.name}
                                                        width={800}
                                                        height={800}
                                                        style={imageStyle}
                                                        className="stone-image"
                                                    />
                                                ) : (
                                                    <div style={noImageStyle}>No image available</div>
                                                )}
                                            </div>

                                            <div style={cardContentStyle}>
                                                <div style={cardHeaderStyle}>
                                                    <div style={stoneNameStyle} className="stone-name-style">
                                                        {s.name}
                                                    </div>

                                                    {s.category && (
                                                        <div
                                                            style={
                                                                s.category === "Price on request"
                                                                    ? stonePriceRequestStyle
                                                                    : stoneCategoryStyle
                                                            }
                                                            className="stone-category-style"
                                                        >
                                                            {s.category}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={stoneMetaStyle} className="stone-meta-style">
                                                    {s.origin || "Origin undisclosed"}
                                                    {typeof s.carat === "number" && ` · ${s.carat} ct`}
                                                </div>
                                            </div>
                                        </Link>
                                    </Reveal>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={emptyStateStyle}>
                            <p style={emptyTextStyle}>
                                No stones match your current filters.
                                <br />
                                Try adjusting your selection.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

/* ------------------ STYLES ------------------ */

const wrapStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 80,
    alignItems: "start",
};

const sidebarStyle: React.CSSProperties = {
    position: "sticky",
    top: 80,
    backgroundColor: "#ffffff",
    padding: "32px 24px",
    border: "1px solid rgba(10, 10, 10, 0.08)",
    fontFamily: `"Crimson Pro", "Cormorant Garamond", Georgia, serif`,
};

const sidebarHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: "1px solid rgba(10, 10, 10, 0.08)",
};

const sidebarTitleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 400,
    letterSpacing: "-0.01em",
    color: "#0a0a0a",
    margin: 0,
};

const resetBtnStyle: React.CSSProperties = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.48)",
    transition: "color 0.3s ease",
    padding: 0,
};

const filterSectionStyle: React.CSSProperties = {
    borderBottom: "1px solid rgba(10, 10, 10, 0.08)",
    paddingBottom: 20,
    marginBottom: 20,
};

const sectionHeaderStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.01em",
    color: "#0a0a0a",
    textAlign: "left",
};

const chevronStyle: React.CSSProperties = {
    fontSize: 18,
    color: "rgba(10, 10, 10, 0.48)",
    fontWeight: 300,
};

const sectionContentStyle: React.CSSProperties = {
    paddingTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
};

const checkboxLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    fontSize: 14,
    color: "#0a0a0a",
    transition: "color 0.3s ease",
};

const checkboxInputStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    cursor: "pointer",
    accentColor: "#0a0a0a",
};

const checkboxTextStyle: React.CSSProperties = {
    flex: 1,
    fontSize: 14,
    fontWeight: 300,
};

const countStyle: React.CSSProperties = {
    fontSize: 13,
    color: "rgba(10, 10, 10, 0.48)",
    fontWeight: 300,
};

const rangeLabelsStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
};

const rangeLabelTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(10, 10, 10, 0.56)",
    fontWeight: 300,
};

const rangeLabelValueStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#0a0a0a",
    fontWeight: 400,
};

const sliderContainerStyle: React.CSSProperties = {
    position: "relative",
    paddingTop: 32,
    paddingBottom: 8,
};

const sliderTicksStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    top: 0,
    pointerEvents: "none",
};

const sliderTickStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
};

const sliderTickMarkStyle: React.CSSProperties = {
    width: 2,
    height: 8,
    backgroundColor: "rgba(10, 10, 10, 0.2)",
    marginBottom: 4,
};

const sliderTickLabelStyle: React.CSSProperties = {
    fontSize: 10,
    color: "rgba(10, 10, 10, 0.5)",
    fontWeight: 300,
};

const sliderStyle: React.CSSProperties = {
    width: "100%",
    height: 4,
    cursor: "pointer",
    accentColor: "#0a0a0a",
    WebkitAppearance: "none",
    appearance: "none",
    background: "linear-gradient(to right, #0a0a0a 0%, #0a0a0a 100%)",
    outline: "none",
};

const resultsStyle: React.CSSProperties = {
    minWidth: 0,
};

const resultsHeaderStyle: React.CSSProperties = {
    marginBottom: 48,
};

const resultsKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.48)",
    marginBottom: 8,
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 48,
    width: "100%",
};

const cardStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    transition:
        "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "pointer",
};

const imageFrameStyle: React.CSSProperties = {
    border: "1px solid rgba(10, 10, 10, 0.12)",
    overflow: "hidden",
    aspectRatio: "1 / 1",
    backgroundColor: "rgba(10, 10, 10, 0.02)",
    position: "relative",
    boxShadow: "inset 0 0 20px rgba(10, 10, 10, 0.03)",
    marginBottom: 20,
};

const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
};

const noImageStyle: React.CSSProperties = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(10, 10, 10, 0.32)",
    fontSize: 13,
};

const cardContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
};

const cardHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 16,
};

const stoneNameStyle: React.CSSProperties = {
    fontSize: 17,
    fontWeight: 400,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
};

const stoneCategoryStyle: React.CSSProperties = {
    fontSize: 14,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.56)",
    whiteSpace: "nowrap",
};

const stoneMetaStyle: React.CSSProperties = {
    fontSize: 14,
    color: "rgba(10, 10, 10, 0.56)",
    fontWeight: 300,
};

const emptyStateStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "100px 20px",
};

const emptyTextStyle: React.CSSProperties = {
    fontSize: 16,
    color: "rgba(10, 10, 10, 0.48)",
    fontWeight: 300,
    lineHeight: 1.7,
};

const stonePriceRequestStyle: React.CSSProperties = {
    fontSize: 8,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.45)",
    whiteSpace: "nowrap",
};
