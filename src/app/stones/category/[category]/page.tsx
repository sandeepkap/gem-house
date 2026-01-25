// src/app/stones/category/[category]/page.tsx
export const revalidate = 0;

import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import StoneFilters from "@/app/components/StoneFilters";
import { client } from "@/sanity/lib/client";

type StoneListItem = {
    _id: string;
    name: string;
    category: string;
    origin?: string;
    carat?: number;
    price?: number | null;
    images?: any[];
};

// ✅ FIXED: Added ruby/rubies to PRIMARY_CATEGORIES
const PRIMARY_CATEGORIES = [
    "sapphire",
    "sapphires",
    "ruby",
    "rubies",
    "padparadscha",
    "padparadscha sapphire",
    "padparadscha sapphires",
    "spinel",
    "spinels",
];

// ✅ FIXED: Added ruby to CATEGORY_ALIASES
const CATEGORY_ALIASES: Record<string, string[]> = {
    sapphire: ["Sapphire", "Sapphires"],
    ruby: ["Ruby", "Rubies"],
    padparadscha: ["Padparadscha", "Padparadscha Sapphire", "Padparadscha Sapphires"],
    padmaradcha: ["Padparadscha", "Padparadscha Sapphire", "Padmaradcha", "Padmaradcha Sapphire"],
    spinel: ["Spinel", "Spinels"],
};

function titleCaseSlug(slug: string) {
    return slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPrice(price?: number | null) {
    if (price === null || price === undefined) return "Price on request";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(price);
}

async function getStonesByCategories(categories: string[]): Promise<StoneListItem[]> {
    const categoriesLower = categories.map((c) => c.toLowerCase());

    return client.fetch(
        `
        *[
          _type == "stone" &&
          available == true &&
          defined(category) &&
          lower(category) in $categoriesLower
        ] | order(sortOrder asc, _createdAt desc) {
          _id,
          name,
          category,
          origin,
          carat,
          price,
          images
        }
        `,
        { categoriesLower }
    );
}

async function getOtherStones(): Promise<StoneListItem[]> {
    return client.fetch(
        `
        *[
          _type == "stone" &&
          available == true &&
          defined(category) &&
          !(lower(category) in $excluded)
        ] | order(sortOrder asc, _createdAt desc) {
          _id,
          name,
          category,
          origin,
          carat,
          price,
          images
        }
        `,
        { excluded: PRIMARY_CATEGORIES }
    );
}

export default async function CategoryPage({
                                               params,
                                           }: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;

    const slug = decodeURIComponent(category).trim().toLowerCase();

    let heading = "";
    let stones: StoneListItem[] = [];

    if (slug === "other") {
        heading = "Other";
        stones = await getOtherStones();
    } else {
        const aliases = CATEGORY_ALIASES[slug] ?? [];
        heading = aliases[0] ?? titleCaseSlug(slug) ?? "Stones";
        stones = aliases.length > 0 ? await getStonesByCategories(aliases) : [];
    }

    // ✅ Show PRICE instead of category (like homepage)
    const stonesForDisplay: StoneListItem[] = stones.map((s) => ({
        ...s,
        category: formatPrice(s.price),
    }));

    return (
        <div style={pageStyle}>
            <Navigation />

            <section style={sectionStyle}>
                <div style={containerStyle}>
                    <div style={topRowStyle}>
                        <Link href="/#collection" style={backLinkStyle}>
                            ← All Stones
                        </Link>
                        <div style={titleStyle}>{heading}</div>
                    </div>

                    {/* ✅ Pass stones with price displayed */}
                    <StoneFilters stones={stonesForDisplay} />

                    {slug !== "other" && (CATEGORY_ALIASES[slug] ?? []).length === 0 && (
                        <div style={noteStyle}>
                            Unknown category slug: <span style={monoStyle}>{slug}</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

/* ------------------ STYLES ------------------ */

const pageStyle: React.CSSProperties = {
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
    color: "#1a1a1a",
    backgroundColor: "#F9F8F6",
    minHeight: "100vh",
};

const sectionStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    padding: "140px 5vw 120px",
};

const containerStyle: React.CSSProperties = {
    maxWidth: 1600,
    margin: "0 auto",
};

const topRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 28,
};

const backLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    fontSize: 10,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(26, 26, 26, 0.55)",
};

const titleStyle: React.CSSProperties = {
    fontSize: "clamp(22px, 2.4vw, 30px)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "#1a1a1a",
};

const noteStyle: React.CSSProperties = {
    marginTop: 16,
    fontSize: 12,
    color: "rgba(26, 26, 26, 0.55)",
};

const monoStyle: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};