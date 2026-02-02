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
    realCategory?: string; // ✅ NEW: Store the actual category
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

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

// ✅ Category matching logic
function matchesCategory(stoneCategory: string | undefined, filterCategory: string): boolean {
    if (!stoneCategory) return false;
    const lower = stoneCategory.toLowerCase();

    switch (filterCategory) {
        case "sapphire":
            return lower.includes("sapphire") && !lower.includes("padparadscha");
        case "ruby":
            return lower.includes("ruby");
        case "padparadscha":
            return lower.includes("padparadscha");
        case "spinel":
            return lower.includes("spinel");
        case "other":
            return !lower.includes("sapphire") &&
                !lower.includes("ruby") &&
                !lower.includes("padparadscha") &&
                !lower.includes("spinel");
        default:
            return false;
    }
}

export default function StoneFilters({ stones }: { stones: StoneListItem[] }) {
    const defaultLocations = ["Sri Lanka", "USA"];

    const locations = useMemo(() => {
        const fromData = uniqSorted(stones.map((s) => s.origin));
        const merged = Array.from(new Set([...defaultLocations, ...fromData])).sort((a, b) =>
            a.localeCompare(b)
        );
        return merged;
    }, [stones]);

    const caratMinMax = useMemo(() => {
        return { min: 0, max: 9 };
    }, []);

    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // ✅ NEW
    const [caratRange, setCaratRange] = useState<[number, number]>([caratMinMax.min, caratMinMax.max]);

    const [expandedSections, setExpandedSections] = useState({
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

    // ✅ Toggle category filter
    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) => toggle(prev, cat));
    };

    const filtered = useMemo(() => {
        return stones.filter((s) => {
            // Location filter
            if (selectedLocations.length > 0) {
                if (!s.origin || !selectedLocations.includes(s.origin)) return false;
            }

            // ✅ Category filter
            if (selectedCategories.length > 0) {
                const matchesAny = selectedCategories.some(cat =>
                    matchesCategory(s.realCategory, cat)
                );
                if (!matchesAny) return false;
            }

            // Carat filter
            if (typeof s.carat === "number") {
                if (s.carat < caratRange[0] || s.carat > caratRange[1]) return false;
            } else {
                const isCaratFiltered = caratRange[0] !== caratMinMax.min || caratRange[1] !== caratMinMax.max;
                if (isCaratFiltered) return false;
            }

            return true;
        });
    }, [stones, selectedLocations, selectedCategories, caratRange, caratMinMax.min, caratMinMax.max]);

    const countsByLocation = useMemo(() => {
        const m = new Map<string, number>();
        stones.forEach((s) => {
            if (!s.origin) return;
            m.set(s.origin, (m.get(s.origin) || 0) + 1);
        });
        return m;
    }, [stones]);

    // ✅ Count by category
    const countsByCategory = useMemo(() => {
        const counts = {
            sapphire: 0,
            ruby: 0,
            padparadscha: 0,
            spinel: 0,
            other: 0,
        };
        stones.forEach((s) => {
            if (matchesCategory(s.realCategory, "sapphire")) counts.sapphire++;
            else if (matchesCategory(s.realCategory, "ruby")) counts.ruby++;
            else if (matchesCategory(s.realCategory, "padparadscha")) counts.padparadscha++;
            else if (matchesCategory(s.realCategory, "spinel")) counts.spinel++;
            else counts.other++;
        });
        return counts;
    }, [stones]);

    function resetAll() {
        setSelectedLocations([]);
        setSelectedCategories([]);
        setCaratRange([caratMinMax.min, caratMinMax.max]);
    }

    const hasActiveFilters =
        selectedLocations.length > 0 ||
        selectedCategories.length > 0 ||
        caratRange[0] !== caratMinMax.min ||
        caratRange[1] !== caratMinMax.max;

    return (
        <>
            {/* ✅ Category filter buttons */}
            <div style={categoryNavWrapStyle}>
                <Reveal delayMs={0}>
                    <div style={categoryNavTitleStyle}>Browse by stone</div>
                </Reveal>

                <Reveal delayMs={80}>
                    <div style={categoryNavStyle}>
                        <button
                            onClick={() => toggleCategory("sapphire")}
                            style={selectedCategories.includes("sapphire") ? activePillStyle : categoryPillStyle}
                            type="button"
                        >
                            Sapphires
                        </button>

                        <button
                            onClick={() => toggleCategory("ruby")}
                            style={selectedCategories.includes("ruby") ? activePillStyle : categoryPillStyle}
                            type="button"
                        >
                            Ruby
                        </button>

                        <button
                            onClick={() => toggleCategory("padparadscha")}
                            style={selectedCategories.includes("padparadscha") ? activePillStyle : categoryPillStyle}
                            type="button"
                        >
                            Padparadscha
                        </button>

                        <button
                            onClick={() => toggleCategory("spinel")}
                            style={selectedCategories.includes("spinel") ? activePillStyle : categoryPillStyle}
                            type="button"
                        >
                            Spinel
                        </button>

                        <button
                            onClick={() => toggleCategory("other")}
                            style={selectedCategories.includes("other") ? activePillStyle : categoryPillStyle}
                            type="button"
                        >
                            Other
                        </button>
                    </div>
                </Reveal>
            </div>

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

                    {/* Location */}
                    {locations.length > 0 && (
                        <div style={filterSectionStyle}>
                            <button
                                onClick={() => toggleSection("location")}
                                style={sectionHeaderStyle}
                                type="button"
                            >
                                <span style={sectionTitleStyle}>Location</span>
                                <span style={chevronStyle}>{expandedSections.location ? "−" : "+"}</span>
                            </button>

                            {expandedSections.location && (
                                <div style={sectionContentStyle}>
                                    {locations.map((loc) => (
                                        <label key={loc} style={checkboxLabelStyle}>
                                            <input
                                                type="checkbox"
                                                checked={selectedLocations.includes(loc)}
                                                onChange={() => setSelectedLocations((a) => toggle(a, loc))}
                                                style={checkboxInputStyle}
                                            />
                                            <span style={checkboxTextStyle}>{loc}</span>
                                            <span style={countStyle}>({countsByLocation.get(loc) || 0})</span>
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
                                            setCaratRange(([a, b]) => [Math.min(Number(e.target.value), b), b])
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
                                                    <div style={stoneNameStyle} className="stone-name-style">{s.name}</div>
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

// ✅ Category nav styles
const categoryNavWrapStyle: React.CSSProperties = {
    marginBottom: 44,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
};

const categoryNavTitleStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "rgba(26, 26, 26, 0.45)",
};

const categoryNavStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
};

const categoryPillStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#1a1a1a",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(26, 26, 26, 0.14)",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    padding: "10px 14px",
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transition: "all 0.25s ease",
    cursor: "pointer",
    fontFamily: "inherit",
};

const activePillStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#F9F8F6",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#1a1a1a",
    backgroundColor: "#1a1a1a",
    padding: "10px 14px",
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transition: "all 0.25s ease",
    cursor: "pointer",
    fontFamily: "inherit",
};

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
    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
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