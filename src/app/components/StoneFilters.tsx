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
    origin?: string;
    carat?: number;
    price?: number | null;
    images?: any[];
};

function uniqSorted(values: (string | undefined)[]) {
    return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function StoneFilters({ stones }: { stones: StoneListItem[] }) {
    // Default options that should always be available
    const defaultLocations = ["Sri Lanka", "USA"];
    const defaultCategories = ["Sapphire", "Ruby", "Emerald", "Spinel", "Tourmaline", "Other"];

    // Facet options - merge with defaults
    const locations = useMemo(() => {
        const fromData = uniqSorted(stones.map((s) => s.origin));
        const merged = Array.from(new Set([...defaultLocations, ...fromData])).sort((a, b) =>
            a.localeCompare(b)
        );
        return merged;
    }, [stones]);

    const categories = useMemo(() => {
        const fromData = uniqSorted(stones.map((s) => s.category));
        const merged = Array.from(new Set([...defaultCategories, ...fromData])).sort((a, b) =>
            a.localeCompare(b)
        );
        return merged;
    }, [stones]);

    // Range bounds
    const caratMinMax = useMemo(() => {
        const nums = stones.map((s) => s.carat).filter((n): n is number => typeof n === "number");
        if (nums.length === 0) return { min: 0, max: 23 };
        const maxCarat = Math.ceil(Math.max(...nums));
        return { min: 0, max: Math.max(maxCarat, 23) };
    }, [stones]);

    // Filter state - initialize with full ranges so all items show by default
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [caratRange, setCaratRange] = useState<[number, number]>([0, caratMinMax.max]);

    // Collapsible sections
    const [expandedSections, setExpandedSections] = useState({
        location: true,
        carat: true,
        category: true,
    });

    // Update ranges when data changes to ensure all items are shown by default
    useEffect(() => {
        setCaratRange([0, caratMinMax.max]);
    }, [caratMinMax.max]);

    function toggle(arr: string[], v: string) {
        return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const filtered = useMemo(() => {
        return stones.filter((s) => {
            if (selectedLocations.length > 0) {
                if (!s.origin || !selectedLocations.includes(s.origin)) return false;
            }

            if (selectedCategories.length > 0) {
                if (!s.category || !selectedCategories.includes(s.category)) return false;
            }

            // Carat filter - stones without carat values show when using default range
            if (typeof s.carat === "number") {
                if (s.carat < caratRange[0] || s.carat > caratRange[1]) return false;
            } else {
                // No carat - only exclude if user has actively filtered (not at default)
                const isCaratFiltered = caratRange[0] !== 0 || caratRange[1] !== caratMinMax.max;
                if (isCaratFiltered) return false;
            }

            return true;
        });
    }, [stones, selectedLocations, selectedCategories, caratRange, caratMinMax.max]);

    const countsByLocation = useMemo(() => {
        const m = new Map<string, number>();
        stones.forEach((s) => {
            if (!s.origin) return;
            m.set(s.origin, (m.get(s.origin) || 0) + 1);
        });
        return m;
    }, [stones]);

    const countsByCategory = useMemo(() => {
        const m = new Map<string, number>();
        stones.forEach((s) => {
            if (!s.category) return;
            m.set(s.category, (m.get(s.category) || 0) + 1);
        });
        return m;
    }, [stones]);

    function resetAll() {
        setSelectedLocations([]);
        setSelectedCategories([]);
        setCaratRange([0, caratMinMax.max]);
    }

    const hasActiveFilters =
        selectedLocations.length > 0 ||
        selectedCategories.length > 0 ||
        caratRange[0] !== 0 ||
        caratRange[1] !== caratMinMax.max;

    return (
        <div style={wrapStyle} className="stones-filter-wrap">
            {/* SIDEBAR */}
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
                        <button onClick={() => toggleSection("location")} style={sectionHeaderStyle} type="button">
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
                    <button onClick={() => toggleSection("carat")} style={sectionHeaderStyle} type="button">
                        <span style={sectionTitleStyle}>Carat Weight</span>
                        <span style={chevronStyle}>{expandedSections.carat ? "−" : "+"}</span>
                    </button>

                    {expandedSections.carat && (
                        <div style={sectionContentStyle}>
                            <div style={rangeInputsStyle}>
                                <input
                                    type="number"
                                    value={caratRange[0]}
                                    onChange={(e) =>
                                        setCaratRange(([a, b]) => [clamp(Number(e.target.value), 0, b), b])
                                    }
                                    style={rangeInputStyle}
                                    min={0}
                                    max={caratMinMax.max}
                                    step={0.1}
                                />
                                <span style={rangeSeparatorStyle}>−</span>
                                <input
                                    type="number"
                                    value={caratRange[1]}
                                    onChange={(e) =>
                                        setCaratRange(([a, b]) => [a, clamp(Number(e.target.value), a, caratMinMax.max)])
                                    }
                                    style={rangeInputStyle}
                                    min={0}
                                    max={caratMinMax.max}
                                    step={0.1}
                                />
                            </div>

                            <div style={sliderContainerStyle}>
                                <input
                                    type="range"
                                    min={0}
                                    max={caratMinMax.max}
                                    step={0.1}
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

                {/* Category */}
                {categories.length > 0 && (
                    <div style={filterSectionStyle}>
                        <button onClick={() => toggleSection("category")} style={sectionHeaderStyle} type="button">
                            <span style={sectionTitleStyle}>Category</span>
                            <span style={chevronStyle}>{expandedSections.category ? "−" : "+"}</span>
                        </button>

                        {expandedSections.category && (
                            <div style={sectionContentStyle}>
                                {categories.map((cat) => (
                                    <label key={cat} style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => setSelectedCategories((a) => toggle(a, cat))}
                                            style={checkboxInputStyle}
                                        />
                                        <span style={checkboxTextStyle}>{cat}</span>
                                        <span style={countStyle}>({countsByCategory.get(cat) || 0})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </aside>

            {/* RESULTS */}
            <section style={resultsStyle} className="filter-results">
                {/* Removed the header that shows total stone count */}

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
                                                <div style={stoneNameStyle}>{s.name}</div>
                                                {s.category && <div style={stoneCategoryStyle}>{s.category}</div>}
                                            </div>
                                            <div style={stoneMetaStyle}>
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

const rangeInputsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
};

const rangeInputStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid rgba(10, 10, 10, 0.16)",
    fontSize: 14,
    fontFamily: "inherit",
    color: "#0a0a0a",
    backgroundColor: "rgba(10, 10, 10, 0.02)",
    transition: "border-color 0.3s ease",
};

const rangeSeparatorStyle: React.CSSProperties = {
    color: "rgba(10, 10, 10, 0.48)",
    fontSize: 14,
};

const sliderContainerStyle: React.CSSProperties = {
    position: "relative",
    paddingTop: 8,
};

const sliderStyle: React.CSSProperties = {
    width: "100%",
    height: 2,
    cursor: "pointer",
    accentColor: "#0a0a0a",
};

const resultsStyle: React.CSSProperties = {
    minWidth: 0,
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
    fontSize: 10,
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
