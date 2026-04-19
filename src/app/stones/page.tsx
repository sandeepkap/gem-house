// src/app/stones/page.tsx
export const revalidate = 0;

import StoneFilters from "@/app/components/StoneFilters";
import { client } from "@/sanity/lib/client";

type StoneListItem = {
    _id: string;
    name: string;
    category: string;
    realCategory?: string;
    origin?: string;
    carat?: number;
    price?: number | null;
    images?: any[];
};

function formatPrice(price?: number | null) {
    if (price === null || price === undefined) return "Price on request";
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(price);
}

async function getAllStones(): Promise<StoneListItem[]> {
    return client.fetch(`
        *[_type == "stone" && available == true]
        | order(sortOrder asc, _createdAt desc) {
            _id, name, category, origin, carat, price, images
        }
    `);
}

export default async function AllStonesPage() {
    const stones = await getAllStones();

    const stonesForDisplay: StoneListItem[] = stones.map((s) => ({
        ...s,
        realCategory: s.category,
        category: formatPrice(s.price),
    }));

    return (
        <div style={pageStyle}>
            <section style={sectionStyle} className="cg-stones-section">
                <div style={mastheadStyle}>
                    <h1 style={h1Style}>
                        Stones <em style={{ fontStyle: "italic" }}>available now.</em>
                    </h1>

                    <div style={{ height: 1, background: "#000", margin: "32px 0 60px" }} />
                </div>

                <StoneFilters stones={stonesForDisplay} />
            </section>

            <style>{`
                @media (max-width: 768px) {
                    .cg-stones-section { padding: 100px 24px 80px !important; }
                }
                @media (max-width: 560px) {
                    .cg-stones-section { padding: 90px 20px 60px !important; }
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
const mastheadStyle: React.CSSProperties = {
    marginBottom: 60,
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