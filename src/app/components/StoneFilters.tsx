"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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
    return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
        a.localeCompare(b)
    );
}

export default function StoneFilters({ stones }: { stones: StoneListItem[] }) {
    const defaultLocations = ["Sri Lanka", "USA"];
    const defaultCategories = ["Sapphire", "Ruby", "Emerald", "Spinel", "Tourmaline", "Other"];

    const locations = useMemo(() => {
        const fromData = uniqSorted(stones.map((s) => s.origin));
        return Array.from(new Set([...defaultLocations, ...fromData])).sort((a, b) =>
            a.localeCompare(b)
        );
    }, [stones]);

    const categories = useMemo(() => {
        const fromData = uniqSorted(stones.map((s) => s.category));
        return Array.from(new Set([...defaultCategories, ...fromData])).sort((a, b) =>
            a.localeCompare(b)
        );
    }, [stones]);

    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Slider: 0..8
    const [minCarat, setMinCarat] = useState<number>(0);

    const [expandedSections, setExpandedSections] = useState({
        location: true,
        carat: true,
        category: true,
    });

    function toggle(arr: string[], v: string) {
        return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // ---------- CASE-INSENSITIVE NORMALIZATION ----------
    const selectedLocationsLC = useMemo(
        () => selectedLocations.map((l) => l.toLowerCase()),
        [selectedLocations]
    );

    const selectedCategoriesLC = useMemo(
        () => selectedCategories.map((c) => c.toLowerCase()),
        [selectedCategories]
    );

    const filtered = useMemo(() => {
        return stones.filter((s) => {
            if (selectedLocationsLC.length > 0) {
                if (!s.origin || !selectedLocationsLC.includes(s.origin.toLowerCase()))
                    return false;
            }

            if (selectedCategoriesLC.length > 0) {
                if (!s.category || !selectedCategoriesLC.includes(s.category.toLowerCase()))
                    return false;
            }

            if (minCarat > 0) {
                if (typeof s.carat !== "number") return false;
                if (s.carat < minCarat) return false;
            }

            return true;
        });
    }, [stones, selectedLocationsLC, selectedCategoriesLC, minCarat]);

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
        setMinCarat(0);
    }

    const hasActiveFilters =
        selectedLocations.length > 0 || selectedCategories.length > 0 || minCarat !== 0;

    const ticks = useMemo(() => Array.from({ length: 9 }, (_, i) => i), []);

    return (
        <div style={wrapStyle}>
            <aside style={sidebarStyle}>
                <div style={sidebarHeaderStyle}>
                    <h3 style={sidebarTitleStyle}>Refine Selection</h3>
                    {hasActiveFilters && (
                        <button onClick={resetAll} style={resetBtnStyle}>
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

                {/* Weight */}
                <div style={filterSectionStyle}>
                    <button
                        onClick={() => toggleSection("carat")}
                        style={sectionHeaderStyle}
                    >
                        <span style={sectionTitleStyle}>Weight</span>
                        <span style={chevronStyle}>
                            {expandedSections.carat ? "−" : "+"}
                        </span>
                    </button>

                    {expandedSections.carat && (
                        <div style={sectionContentStyle}>
                            <div style={sliderTopRowStyle}>
                                <span style={sliderLabelStyle}>Minimum</span>
                                <span style={sliderValueStyle}>{minCarat} ct</span>
                            </div>

                            <input
                                type="range"
                                min={0}
                                max={8}
                                step={1}
                                value={minCarat}
                                onChange={(e) =>
                                    setMinCarat(Number(e.target.value))
                                }
                                style={sliderStyle}
                            />

                            <div style={tickRowStyle}>
                                {ticks.map((n) => (
                                    <span key={n} style={tickTextStyle}>
                                        {n}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Category */}
                {categories.length > 0 && (
                    <div style={filterSectionStyle}>
                        <button
                            onClick={() => toggleSection("category")}
                            style={sectionHeaderStyle}
                        >
                            <span style={sectionTitleStyle}>Category</span>
                            <span style={chevronStyle}>
                                {expandedSections.category ? "−" : "+"}
                            </span>
                        </button>

                        {expandedSections.category && (
                            <div style={sectionContentStyle}>
                                {categories.map((cat) => (
                                    <label key={cat} style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() =>
                                                setSelectedCategories((a) => toggle(a, cat))
                                            }
                                            style={checkboxInputStyle}
                                        />
                                        <span style={checkboxTextStyle}>{cat}</span>
                                        <span style={countStyle}>
                                            ({countsByCategory.get(cat) || 0})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </aside>

            <section style={resultsStyle}>
                {filtered.length > 0 ? (
                    <div style={gridStyle}>
                        {filtered.map((s, index) => {
                            const cover = s.images?.[0];
                            return (
                                <Reveal key={s._id} delayMs={index * 60}>
                                    <Link
                                        href={`/stones/id/${encodeURIComponent(s._id)}`}
                                        style={cardStyle}
                                    >
                                        <div style={imageFrameStyle}>
                                            {cover ? (
                                                <Image
                                                    src={urlFor(cover)
                                                        .width(800)
                                                        .height(800)
                                                        .fit("max")
                                                        .url()}
                                                    alt={s.name}
                                                    width={800}
                                                    height={800}
                                                    style={imageStyle}
                                                />
                                            ) : (
                                                <div style={noImageStyle}>
                                                    No image available
                                                </div>
                                            )}
                                        </div>

                                        <div style={cardContentStyle}>
                                            <div style={cardHeaderStyle}>
                                                <div style={stoneNameStyle}>{s.name}</div>
                                                {s.category && (
                                                    <div style={stoneCategoryStyle}>
                                                        {s.category}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={stoneMetaStyle}>
                                                {s.origin || "Origin undisclosed"}
                                                {typeof s.carat === "number" &&
                                                    ` · ${s.carat} ct`}
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

const sliderTopRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
};

const sliderLabelStyle: React.CSSProperties = {
    fontSize: 13,
    color: "rgba(10, 10, 10, 0.62)",
    fontWeight: 300,
};

const sliderValueStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#0a0a0a",
    fontWeight: 400,
};

const sliderStyle: React.CSSProperties = {
    width: "100%",
    height: 2,
    cursor: "pointer",
    accentColor: "#0a0a0a",
};

/* ✅ tick row: 0..8 */
const tickRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(9, 1fr)",
    gap: 0,
    marginTop: 8,
};

const tickTextStyle: React.CSSProperties = {
    fontSize: 10,
    color: "rgba(10, 10, 10, 0.42)",
    textAlign: "center",
    lineHeight: 1,
    userSelect: "none",
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
