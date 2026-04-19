// src/app/stones/category/[category]/page.tsx
export const revalidate = 0;

import Link from "next/link";
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

const PRIMARY_CATEGORIES = [
    "sapphire", "sapphires",
    "ruby", "rubies",
    "padparadscha", "padparadscha sapphire", "padparadscha sapphires",
    "spinel", "spinels",
];

const CATEGORY_ALIASES: Record<string, string[]> = {
    sapphire: ["Sapphire", "Sapphires"],
    ruby: ["Ruby", "Rubies"],
    padparadscha: ["Padparadscha", "Padparadscha Sapphire", "Padparadscha Sapphires"],
    padmaradcha: ["Padparadscha", "Padparadscha Sapphire", "Padmaradcha", "Padmaradcha Sapphire"],
    spinel: ["Spinel", "Spinels"],
};

function titleCaseSlug(slug: string) {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPrice(price?: number | null) {
    if (price === null || price === undefined) return "Price on request";
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(price);
}

async function getStonesByCategories(categories: string[]): Promise<StoneListItem[]> {
    const categoriesLower = categories.map((c) => c.toLowerCase());
    return client.fetch(
        `*[_type == "stone" && available == true && defined(category) && lower(category) in $categoriesLower]
         | order(sortOrder asc, _createdAt desc) {
             _id, name, category, origin, carat, price, images
         }`,
        { categoriesLower }
    );
}

async function getOtherStones(): Promise<StoneListItem[]> {
    return client.fetch(
        `*[_type == "stone" && available == true && defined(category) && !(lower(category) in $excluded)]
         | order(sortOrder asc, _createdAt desc) {
             _id, name, category, origin, carat, price, images
         }`,
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
        heading = "Other Stones";
        stones = await getOtherStones();
    } else {
        const aliases = CATEGORY_ALIASES[slug] ?? [];
        heading = aliases[0] ?? titleCaseSlug(slug) ?? "Stones";
        stones = aliases.length > 0 ? await getStonesByCategories(aliases) : [];
    }

    const stonesForDisplay: StoneListItem[] = stones.map((s) => ({
        ...s,
        category: formatPrice(s.price),
    }));

    return (
        <div style={pageStyle}>
            <section style={sectionStyle} className="cg-category-section">
                <div style={topRowStyle}>
                    <Link href="/stones" style={backLinkStyle}>← All Stones</Link>
                    <div style={labelStyle}>Category</div>
                </div>

                <h1 style={h1Style}>{heading}</h1>

                <div style={{ height: 1, background: "#000", margin: "40px 0 60px" }} />

                <StoneFilters stones={stonesForDisplay} />
            </section>

            <style>{`
                @media (max-width: 768px) {
                    .cg-category-section { padding: 100px 24px 80px !important; }
                }
                @media (max-width: 560px) {
                    .cg-category-section { padding: 90px 20px 60px !important; }
                }
            `}</style>
        </div>
    );
}

/* STYLES */
const pageStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    color: "#000",
    backgroundColor: "var(--paper, #F4F1EB)",
    minHeight: "100vh",
};
const sectionStyle: React.CSSProperties = {
    padding: "140px 5vw 120px",
    maxWidth: 1600, margin: "0 auto",
};
const topRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 32,
};
const backLinkStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#000",
    textDecoration: "none",
    fontWeight: 500,
    borderBottom: "1px solid #000",
    paddingBottom: 3,
};
const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    fontWeight: 500,
};
const h1Style: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(48px, 7vw, 112px)",
    fontWeight: 400,
    letterSpacing: "-0.025em",
    color: "#000",
    lineHeight: 1,
};