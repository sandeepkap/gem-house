// src/app/stones/id/[id]/page.tsx
export const revalidate = 0;

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Reveal from "@/app/components/Reveal";
import StoneGallery from "@/app/components/StoneGallery";
import WhatsAppInquireLink from "@/app/components/WhatsAppInquireLink";

type Stone = {
    _id: string;
    name: string;
    category: string;
    origin?: string;
    carat?: number;
    images?: any[];
    price?: number | null;
    currency?: string | null;
    priceOnRequest?: boolean | null;
    agclNo?: string | null;
    color?: string | null;
    shape?: string | null;
    cut?: string | null;
    dimensions?: { length?: number | null; width?: number | null; depth?: number | null; } | null;
    comments?: string | null;
};

function buildWhatsAppLink(phoneDigitsOnly: string, stoneName: string, carat?: number) {
    const safePhone = String(phoneDigitsOnly).replace(/\D/g, "");
    const weightText = typeof carat === "number" ? ` (${carat} ct)` : "";
    const text = `Hello, I'm interested in ${stoneName}${weightText}. Please share availability, price, and certification details.`;
    return `https://wa.me/${safePhone}?text=${encodeURIComponent(text)}`;
}

async function getStoneById(idRaw: string): Promise<Stone | null> {
    const id = String(idRaw || "").trim();
    if (!id) return null;
    const draftId = id.startsWith("drafts.") ? id : `drafts.${id}`;
    const publishedId = id.startsWith("drafts.") ? id.replace(/^drafts\./, "") : id;
    return client.fetch(
        `*[_type == "stone" && (_id == $publishedId || _id == $draftId)][0]{
            _id, name, category, origin, carat, images,
            price, currency, priceOnRequest,
            agclNo, color, shape, cut, dimensions, comments
        }`,
        { publishedId, draftId }
    );
}

function formatPrice(stone: Stone) {
    const por = Boolean(stone.priceOnRequest);
    const priceNum = typeof stone.price === "number" && Number.isFinite(stone.price) ? stone.price : null;
    if (por || priceNum === null) return "Price on request";
    const ccy = (stone.currency || "USD").toUpperCase();
    return `${ccy} ${priceNum.toLocaleString()}`;
}

function formatDimensions(dim?: Stone["dimensions"] | null) {
    if (!dim) return null;
    const L = typeof dim.length === "number" ? dim.length : null;
    const W = typeof dim.width === "number" ? dim.width : null;
    const D = typeof dim.depth === "number" ? dim.depth : null;
    if (L === null && W === null && D === null) return null;
    if (L !== null && W !== null && D !== null) return `${L} × ${W} × ${D} mm`;
    const parts = [L, W, D].map((x) => (x === null ? "—" : String(x)));
    return `${parts.join(" × ")} mm`;
}

export default async function StoneByIdPage({
                                                params,
                                            }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const stone = await getStoneById(decodedId);

    if (!stone) {
        return (
            <main style={notFoundWrapStyle} className="cg-stone-notfound">
                <div style={{ textAlign: "center", maxWidth: 500 }}>
                    <div style={labelStyle}>Unavailable</div>
                    <h1 style={{ ...h1Style, marginTop: 20 }}>This stone is <em style={{ fontStyle: "italic" }}>not available.</em></h1>
                    <Link href="/stones" style={backBtnStyle}>← Return to inventory</Link>
                </div>
                <style>{`
                    @media (max-width: 768px) {
                        .cg-stone-notfound { padding: 120px 24px 40px !important; }
                    }
                `}</style>
            </main>
        );
    }

    const dims = formatDimensions(stone.dimensions);
    const imageUrls = (stone.images || []).map((img: any) =>
        urlFor(img).width(1600).fit("max").auto("format").url()
    );

    const inquireHref = `/inquire/id/${encodeURIComponent(stone._id)}`;
    const whatsappHref = buildWhatsAppLink("16084212077", stone.name, stone.carat);

    return (
        <main style={pageStyle} className="cg-stone-main">

            <div style={breadcrumbStyle}>
                <Link href="/stones" style={backLinkStyle}>← Inventory</Link>
                <div style={breadcrumbMetaStyle}>
                    <span>{stone.category}</span>
                    <span style={{ opacity: 0.4, margin: "0 10px" }}>·</span>
                    <span>{stone.origin || "Undisclosed"}</span>
                </div>
            </div>

            <div style={{ height: 1, background: "#000", margin: "28px 0 60px" }} />

            <style>{`
                .stone-layout {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 60px;
                    align-items: start;
                }
                .stone-gallery { order: 1; }
                .stone-details { order: 2; position: static; }
                .stone-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

                @media (min-width: 960px) {
                    .stone-layout {
                        grid-template-columns: 420px 1fr;
                        gap: 80px;
                    }
                    .stone-details { order: 1; position: sticky; top: 100px; }
                    .stone-gallery { order: 2; }
                }
                @media (max-width: 768px) {
                    .cg-stone-main { padding: 100px 24px 60px !important; }
                    .stone-layout { gap: 40px !important; }
                }
                @media (max-width: 640px) {
                    .stone-gallery-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
                }
                @media (max-width: 560px) {
                    .cg-stone-main { padding: 90px 20px 50px !important; }
                }
            `}</style>

            <div style={contentStyle} className="stone-layout">

                <aside style={detailsColumnStyle} className="stone-details">

                    <Reveal>
                        <div style={labelStyle}>{stone.category}</div>
                    </Reveal>
                    <Reveal delayMs={80}>
                        <h1 style={h1Style}>{stone.name}</h1>
                    </Reveal>

                    <Reveal delayMs={180}>
                        <div style={priceBlockStyle}>
                            <div style={labelStyle}>Offered at</div>
                            <div style={priceStyle}>
                                <em style={{ fontStyle: "italic" }}>{formatPrice(stone)}</em>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delayMs={260}>
                        <table style={specTableStyle}>
                            <tbody>
                            <SpecRow label="Origin" value={stone.origin || "Undisclosed"} />
                            {typeof stone.carat === "number" && <SpecRow label="Weight" value={`${stone.carat} ct`} />}
                            {stone.agclNo && <SpecRow label="AGCL №" value={stone.agclNo} />}
                            {stone.color && <SpecRow label="Colour" value={stone.color} />}
                            {stone.shape && <SpecRow label="Shape" value={stone.shape} />}
                            {stone.cut && <SpecRow label="Cut" value={stone.cut} />}
                            {dims && <SpecRow label="Dimensions" value={dims} />}
                            {stone.comments && <SpecRow label="Notes" value={stone.comments} />}
                            </tbody>
                        </table>
                    </Reveal>

                    <Reveal delayMs={340}>
                        <div style={actionsStyle}>
                            <WhatsAppInquireLink
                                inquireHref={inquireHref}
                                whatsappHref={whatsappHref}
                                style={primaryBtnStyle}
                                iconStyle={{ display: "none" }}
                            />
                            <a
                                href={`mailto:ceylongemcompany.inquiries@gmail.com?subject=${encodeURIComponent(`Enquiry — ${stone.name}`)}`}
                                style={secondaryBtnStyle}
                            >
                                Enquire by Email
                            </a>
                            <p style={actionNoteStyle}>
                                Private viewings arranged by appointment. Pre-filled enquiry references {stone.name}.
                            </p>
                        </div>
                    </Reveal>
                </aside>

                <section className="stone-gallery">
                    <StoneGallery stoneName={stone.name} imageUrls={imageUrls} />
                </section>
            </div>

            <footer style={footerStyle}>
                © {new Date().getFullYear()} Ceylon Gem Company · Private Sourcing by Appointment
            </footer>
        </main>
    );
}

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            <th style={specThStyle} scope="row">{label}</th>
            <td style={specTdStyle}>{value}</td>
        </tr>
    );
}

/* STYLES */

const pageStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    background: "var(--paper, #F4F1EB)",
    color: "#000",
    minHeight: "100vh",
    padding: "120px 5vw 80px",
};
const breadcrumbStyle: React.CSSProperties = {
    maxWidth: 1600, margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 12,
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
const breadcrumbMetaStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#000",
    opacity: 0.65,
};
const contentStyle: React.CSSProperties = {
    maxWidth: 1600, margin: "0 auto",
};
const detailsColumnStyle: React.CSSProperties = {};
const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 16,
    fontWeight: 500,
};
const h1Style: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(40px, 5vw, 72px)",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    color: "#000",
    marginBottom: 36,
};
const priceBlockStyle: React.CSSProperties = {
    padding: "24px 0",
    borderTop: "1px solid #000",
    borderBottom: "1px solid rgba(0,0,0,0.15)",
    marginBottom: 32,
};
const priceStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 32,
    color: "#000",
    marginTop: 6,
};
const specTableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 36,
    borderTop: "1px solid rgba(0,0,0,0.1)",
};
const specThStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#000",
    opacity: 0.7,
    padding: "16px 0",
    textAlign: "left",
    fontWeight: 500,
    verticalAlign: "top",
    width: "40%",
};
const specTdStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 16,
    color: "#000",
    padding: "16px 0",
    textAlign: "right",
    wordBreak: "break-word",
};
const actionsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
};
const primaryBtnStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    fontWeight: 500,
    padding: "16px 24px",
    background: "#000",
    color: "#FFF",
    textDecoration: "none",
    textAlign: "center",
    cursor: "pointer",
};
const secondaryBtnStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    fontWeight: 500,
    padding: "16px 24px",
    background: "transparent",
    color: "#000",
    border: "1px solid #000",
    textDecoration: "none",
    textAlign: "center",
    cursor: "pointer",
};
const actionNoteStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "#000",
    opacity: 0.65,
    lineHeight: 1.55,
    marginTop: 16,
};
const footerStyle: React.CSSProperties = {
    maxWidth: 1600, margin: "100px auto 0",
    paddingTop: 32,
    borderTop: "1px solid rgba(0,0,0,0.15)",
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#000",
    textAlign: "center",
};
const notFoundWrapStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--paper, #F4F1EB)",
    padding: "120px 5vw 60px",
    fontFamily: "var(--serif)",
};
const backBtnStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: 32,
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#000",
    textDecoration: "none",
    borderBottom: "1px solid #000",
    paddingBottom: 4,
    fontWeight: 500,
};