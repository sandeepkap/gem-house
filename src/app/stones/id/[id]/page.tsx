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
    dimensions?: {
        length?: number | null;
        width?: number | null;
        depth?: number | null;
    } | null;
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

    // Support both published + drafts without changing your link mapping
    const draftId = id.startsWith("drafts.") ? id : `drafts.${id}`;
    const publishedId = id.startsWith("drafts.") ? id.replace(/^drafts\./, "") : id;

    return client.fetch(
        `
    *[_type == "stone" && (_id == $publishedId || _id == $draftId)][0]{
      _id,
      name,
      category,
      origin,
      carat,
      images,
      price,
      currency,
      priceOnRequest,
      agclNo,
      color,
      shape,
      cut,
      dimensions,
      comments
    }
  `,
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
    // Keep your existing mapping
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const stone = await getStoneById(decodedId);

    if (!stone) {
        return (
            <main style={notFoundWrapStyle}>
                <div style={notFoundContentStyle}>
                    <Reveal>
                        <div style={kickerStyle}>Unavailable</div>
                    </Reveal>
                    <Reveal delayMs={100}>
                        <h1 style={h1Style}>This stone is not available.</h1>
                    </Reveal>
                    <Reveal delayMs={200}>
                        <Link href="/" style={backLinkStyle}>
                            ← Return to collection
                        </Link>
                    </Reveal>
                </div>
            </main>
        );
    }

    const dims = formatDimensions(stone.dimensions);

    // Mobile-friendly URLs
    const imageUrls = (stone.images || []).map((img: any) =>
        urlFor(img).width(1600).fit("max").auto("format").url()
    );

    // Inquiry tracking URL (current tab) + WhatsApp URL (new tab)
    const inquireHref = `/inquire/id/${encodeURIComponent(stone._id)}`;
    const whatsappHref = buildWhatsAppLink("94777752858", stone.name, stone.carat);

    return (
        <main style={pageStyle}>
            <nav style={navStyle}>
                <Link href="/" style={navLinkStyle}>
                    ← Collection
                </Link>
            </nav>

            {/* Mobile: photos first. Desktop: details first + sticky */}
            <style>{`
        /* MOBILE (default): photos first */
        .stone-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        .stone-gallery {
          order: 1;
        }
        .stone-details {
          order: 2;
          position: static;
        }

        /* DESKTOP */
        @media (min-width: 960px) {
          .stone-layout {
            grid-template-columns: 400px 1fr;
            gap: 80px;
            align-items: start;
          }
          .stone-details {
            order: 1;
            position: sticky;
            top: 80px;
          }
          .stone-gallery {
            order: 2;
          }
        }
      `}</style>

            <div style={contentWrapperStyle} className="stone-layout">
                <section style={galleryColumnStyle} className="stone-gallery">
                    <StoneGallery stoneName={stone.name} imageUrls={imageUrls} />
                </section>

                <aside style={detailsColumnStyle} className="stone-details">
                    <Reveal delayMs={0}>
                        <div style={kickerStyle}>{stone.category}</div>
                    </Reveal>

                    <Reveal delayMs={100}>
                        <h1 style={h1Style}>{stone.name}</h1>
                    </Reveal>

                    <Reveal delayMs={200}>
                        <div style={specificationsStyle}>
                            <div style={specRowStyle}>
                                <span style={specLabelStyle}>Origin</span>
                                <span style={specValueStyle}>{stone.origin || "Undisclosed"}</span>
                            </div>

                            {typeof stone.carat === "number" && (
                                <div style={specRowStyle}>
                                    <span style={specLabelStyle}>Weight</span>
                                    <span style={specValueStyle}>{stone.carat} ct</span>
                                </div>
                            )}

                            <div style={specRowStyle}>
                                <span style={specLabelStyle}>Price</span>
                                <span style={specValueStyle}>{formatPrice(stone)}</span>
                            </div>

                            {stone.agclNo ? (
                                <div style={specRowStyle}>
                                    <span style={specLabelStyle}>AGCL No</span>
                                    <span style={specValueStyle}>{stone.agclNo}</span>
                                </div>
                            ) : null}

                            {stone.color ? (
                                <div style={specRowStyle}>
                                    <span style={specLabelStyle}>Color</span>
                                    <span style={specValueStyle}>{stone.color}</span>
                                </div>
                            ) : null}

                            {stone.shape ? (
                                <div style={specRowStyle}>
                                    <span style={specLabelStyle}>Shape</span>
                                    <span style={specValueStyle}>{stone.shape}</span>
                                </div>
                            ) : null}

                            {stone.cut ? (
                                <div style={specRowStyle}>
                                    <span style={specLabelStyle}>Cut</span>
                                    <span style={specValueStyle}>{stone.cut}</span>
                                </div>
                            ) : null}

                            {dims ? (
                                <div style={specRowStyle}>
                                    <span style={specLabelStyle}>Dimensions</span>
                                    <span style={specValueStyle}>{dims}</span>
                                </div>
                            ) : null}

                            {stone.comments ? (
                                <div style={{ ...specRowStyle, borderBottom: "none", paddingBottom: 0 }}>
                                    <span style={specLabelStyle}>Comments</span>
                                    <span style={{ ...specValueStyle, maxWidth: 240 }}>{stone.comments}</span>
                                </div>
                            ) : null}
                        </div>
                    </Reveal>

                    <div style={dividerStyle} />

                    <Reveal delayMs={300}>
                        <div>
                            <div style={sectionKickerStyle}>Inquiries</div>
                            <h2 style={h2Style}>Request Details</h2>

                            <p style={ledeStyle}>
                                Contact us for availability, certification, and purchasing arrangements.
                            </p>

                            <div style={contactActionsStyle}>
                                <a href="mailto:hasinirana1@gmail.com" style={emailLinkStyle}>
                                    hasinirana1@gmail.com
                                </a>

                                {/* Opens WhatsApp in a NEW TAB, and loads /inquire/... in the CURRENT TAB for tracking */}
                                <WhatsAppInquireLink
                                    inquireHref={inquireHref}
                                    whatsappHref={whatsappHref}
                                    style={whatsAppLinkStyle}
                                    iconStyle={whatsAppIconStyle}
                                />

                                <div style={contactNoteStyle}>Pre-filled message references {stone.name}</div>
                            </div>
                        </div>
                    </Reveal>
                </aside>
            </div>

            <footer style={footerStyle}>
                © {new Date().getFullYear()} CEYLON GEM COMPANY — Private sourcing by appointment
            </footer>
        </main>
    );
}

/* ------------------ STYLES ------------------ */

const pageStyle: React.CSSProperties = {
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
    background: "#0a0a0a",
    color: "#fafafa",
    minHeight: "100vh",
    padding: "60px 5vw 100px",
};

const navStyle: React.CSSProperties = { maxWidth: 1400, margin: "0 auto 80px" };

const navLinkStyle: React.CSSProperties = {
    fontSize: 13,
    letterSpacing: "0.02em",
    color: "rgba(250, 250, 250, 0.56)",
    textDecoration: "none",
};

const contentWrapperStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: "0 auto",
};

const detailsColumnStyle: React.CSSProperties = {};

const kickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
    marginBottom: 16,
};

const h1Style: React.CSSProperties = {
    fontSize: "clamp(28px, 3vw, 42px)",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    marginBottom: 48,
};

const specificationsStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 20 };

const specRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingBottom: 20,
    borderBottom: "1px solid rgba(250, 250, 250, 0.08)",
    gap: 18,
};

const specLabelStyle: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
    flexShrink: 0,
};

const specValueStyle: React.CSSProperties = {
    fontSize: 15,
    color: "#fafafa",
    fontWeight: 300,
    textAlign: "right",
    wordBreak: "break-word",
};

const dividerStyle: React.CSSProperties = {
    height: 1,
    background: "rgba(250, 250, 250, 0.08)",
    margin: "48px 0",
};

const sectionKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
    marginBottom: 12,
};

const h2Style: React.CSSProperties = { fontSize: 24, fontWeight: 400, letterSpacing: "-0.01em", marginBottom: 16 };

const ledeStyle: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(250, 250, 250, 0.6)",
    fontWeight: 300,
    marginBottom: 32,
};

const contactActionsStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 16 };

const emailLinkStyle: React.CSSProperties = {
    fontSize: 16,
    color: "#fafafa",
    textDecoration: "none",
    paddingBottom: 16,
    borderBottom: "1px solid rgba(250, 250, 250, 0.08)",
    wordBreak: "break-word",
};

const whatsAppLinkStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    letterSpacing: "0.02em",
    color: "#fafafa",
    textDecoration: "none",
    padding: "16px 24px",
    border: "1px solid rgba(250, 250, 250, 0.16)",
    background: "rgba(250, 250, 250, 0.03)",
    width: "fit-content",
};

const whatsAppIconStyle: React.CSSProperties = { fontSize: 18 };

const contactNoteStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(250, 250, 250, 0.42)",
    letterSpacing: "0.01em",
};

const galleryColumnStyle: React.CSSProperties = { width: "100%", minWidth: 0 };

const footerStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: "100px auto 0",
    paddingTop: 48,
    borderTop: "1px solid rgba(250, 250, 250, 0.08)",
    fontSize: 11,
    color: "rgba(250, 250, 250, 0.42)",
    letterSpacing: "0.02em",
    textAlign: "center",
};

const notFoundWrapStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
    color: "#fafafa",
    padding: "0 5vw",
};

const notFoundContentStyle: React.CSSProperties = { textAlign: "center", maxWidth: 500 };

const backLinkStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: 32,
    fontSize: 14,
    color: "rgba(250, 250, 250, 0.7)",
    textDecoration: "none",
    letterSpacing: "0.02em",
};
