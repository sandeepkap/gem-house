// src/app/page.tsx
export const revalidate = 0;

import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
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

async function getStones(): Promise<StoneListItem[]> {
    return client.fetch(`
        *[_type == "stone" && available == true]
        | order(sortOrder asc, _createdAt desc)[0...8] {
            _id, name, category, origin, carat, price, images
        }
    `);
}

function formatPrice(price?: number | null) {
    if (price === null || price === undefined) return "Price on request";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(price);
}

export default async function Page() {
    const stones = await getStones();

    return (
        <div style={pageStyle}>

            {/* ══════════ 1. HERO BANNER ══════════
                Horizontal image banner + centered serif masthead below.
             */}
            <section style={heroStyle} className="cg-home-hero">
                <Image
                    src="/background.jpg"
                    alt="Ceylon Gem Company"
                    fill
                    priority
                    sizes="100vw"
                    style={heroImgStyle}
                />
            </section>

            {/* ══════════ 2. MASTHEAD ══════════ */}
            <section style={mastheadSectionStyle} className="cg-home-masthead">
                <div style={mastheadInnerStyle}>
                    <div style={mastheadRuleStyle} />
                    <div style={mastheadKickerStyle}>Ceylon · Sri Lanka</div>
                    <h1 style={heroWordmarkStyle}>Ceylon Gem Co.</h1>
                    <div style={mastheadTaglineStyle} className="cg-home-masthead-tagline">
                        Fine gemstones sourced in Ceylon and distributed across global markets
                    </div>
                    <div style={mastheadRuleStyle} />
                </div>
            </section>

            {/* ══════════ 3. AVAILABLE NOW — STONES GRID ══════════ */}
            <section id="collection" style={collectionSectionStyle} className="cg-home-collection">
                <div style={collectionHeaderStyle}>
                    <Reveal>
                        <div style={sectionLabelStyle}>Available Now</div>
                    </Reveal>
                </div>

                <div style={{ height: 1, background: "#000", margin: "24px 0 60px" }} />

                {stones.length > 0 ? (
                    <div style={stonesGridStyle} className="stones-grid">
                        {stones.map((s, i) => {
                            const cover = s.images?.[0];
                            return (
                                <Reveal key={s._id} delayMs={Math.min(i * 60, 400)}>
                                    <Link href={`/stones/id/${encodeURIComponent(s._id)}`} style={stoneCardStyle} className="stone-card">
                                        <div style={stoneMediaStyle}>
                                            {cover ? (
                                                <Image
                                                    src={urlFor(cover).width(900).height(1100).fit("crop").auto("format").url()}
                                                    alt={s.name}
                                                    width={900}
                                                    height={1100}
                                                    style={stoneImgStyle}
                                                />
                                            ) : (
                                                <div style={stoneImgFallbackStyle}>No image</div>
                                            )}
                                        </div>
                                        <div style={stoneFooterStyle}>
                                            <div style={stoneNameStyle}>{s.name}</div>
                                            {typeof s.carat === "number" && (
                                                <div style={stoneMetaStyle}>{s.carat} ct</div>
                                            )}
                                            <div style={stonePriceStyle}>{formatPrice(s.price)}</div>
                                        </div>
                                    </Link>
                                </Reveal>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "var(--serif)", fontStyle: "italic" }}>
                        The collection is being updated. Please check back shortly.
                    </div>
                )}

                <Reveal delayMs={300}>
                    <div style={viewAllWrapStyle}>
                        <Link href="/stones" style={btnDarkStyle}>View the Full Inventory</Link>
                    </div>
                </Reveal>
            </section>

            {/* ══════════ 3. THE HOUSE — vertical video + copy ══════════
                File: /public/media/atelier.mp4 (9:16 vertical)
                Falls back to /public/media/plate-02.jpg as poster if missing.
             */}
            <section style={splitSectionStyle} className="cg-home-split">
                <div style={splitGridStyle} className="split-grid-left">
                    <Reveal>
                        <div style={verticalMediaStyle}>
                            <video
                                autoPlay muted loop playsInline
                                style={verticalVideoStyle}
                                poster="/media/plate-02.jpg"
                            >
                                <source src="/media/atelier.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </Reveal>
                    <div style={copyStackStyle}>
                        <Reveal delayMs={80}>
                            <div style={sectionLabelStyle}>The House</div>
                        </Reveal>
                        <Reveal delayMs={140}>
                            <h2 style={sectionH2Style}>
                                Hand-selected,<br />one stone at a time.
                            </h2>
                        </Reveal>
                        <Reveal delayMs={220}>
                            <p style={paraStyle}>
                                Three generations of dealers, working from Colombo to Ratnapura. Every stone passes through our hands — examined, weighed, certified — before it reaches yours.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ══════════ 4. FULL-BLEED PLATE ══════════
                File: /public/media/plate-01.jpg (horizontal, wide)
                Image renders at its natural aspect ratio, fills width.
             */}
            <section style={plateSectionStyle}>
                <Reveal>
                    <Image
                        src="/media/plate-01.jpg"
                        alt="Ceylon Gem Company"
                        width={2400}
                        height={1200}
                        sizes="100vw"
                        style={plateImgStyle}
                    />
                </Reveal>
            </section>

            {/* ══════════ 5. COMMISSIONS — copy + vertical video (mirrored) ══════════
                File: /public/media/worn.mp4 (9:16 vertical)
             */}
            <section style={commissionsSectionStyle} className="cg-home-commissions">
                <div style={splitGridStyle} className="split-grid-right">
                    <div style={copyStackStyle}>
                        <Reveal>
                            <div style={sectionLabelStyle}>Commissions</div>
                        </Reveal>
                        <Reveal delayMs={80}>
                            <h2 style={sectionH2Style}>A piece,<br />made for you.</h2>
                        </Reveal>
                        <Reveal delayMs={180}>
                            <p style={paraStyle}>
                                Every commission begins in conversation. A stone is chosen, or found; a setting is drawn; revisions are made in person or by correspondence. Nothing leaves our workshop without meeting the standard we set for ourselves.
                            </p>
                        </Reveal>
                        <Reveal delayMs={260}>
                            <div style={{ marginTop: 32 }}>
                                <Link href="/custom-jewelry" style={btnDarkStyle}>Begin a Commission</Link>
                            </div>
                        </Reveal>
                    </div>
                    <Reveal delayMs={140}>
                        <div style={verticalMediaStyle}>
                            <video
                                autoPlay muted loop playsInline
                                style={verticalVideoStyle}
                                poster="/media/plate-02.jpg"
                            >
                                <source src="/media/worn.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ══════════ 6. CONTACT ══════════ */}
            <section id="contact" style={contactSectionStyle} className="cg-home-contact">
                <Reveal>
                    <div style={sectionLabelStyle}>Contact</div>
                </Reveal>
                <Reveal delayMs={80}>
                    <h2 style={sectionH2Style}>By appointment.</h2>
                </Reveal>

                <div style={{ height: 1, background: "#000", margin: "40px 0 60px" }} />

                <div style={contactGridStyle} className="contact-grid">
                    <div>
                        <div style={contactLabelStyle}>Email</div>
                        <a href="mailto:ceylongemcompany.inquiries@gmail.com" style={contactValueLinkStyle}>
                            ceylongemcompany.<br />inquiries@gmail.com
                        </a>
                    </div>
                    <div>
                        <div style={contactLabelStyle}>Telephone</div>
                        <a href="tel:+94777752858" style={contactValueLinkStyle}>+94 77 775 2858</a>
                        <div style={{ height: 6 }} />
                        <a href="tel:+16084212077" style={contactValueLinkStyle}>+1 608 421 2077</a>
                    </div>
                    <div>
                        <div style={contactLabelStyle}>Colombo</div>
                        <div style={contactValueStyle}>By appointment<br />Colombo 03<br />Sri Lanka</div>
                    </div>
                    <div>
                        <div style={contactLabelStyle}>Madison</div>
                        <div style={contactValueStyle}>By appointment<br />Madison, WI<br />United States</div>
                    </div>
                </div>

                <div style={{ height: 1, background: "rgba(0,0,0,0.2)", margin: "80px 0 24px" }} />

                <div style={footerRowStyle} className="footer-row">
                    <div style={footerCopyStyle}>
                        © {new Date().getFullYear()} Ceylon Gem Company
                    </div>
                    <div style={{ display: "flex", gap: 28 }}>
                        <a href="https://www.instagram.com/ceylongemcompany.official/" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Instagram</a>
                        <a href="https://www.facebook.com/profile.php?id=61586976603078" target="_blank" rel="noopener noreferrer" style={footerLinkStyle}>Facebook</a>
                    </div>
                </div>
            </section>

            <style>{`
                /* split grid: video LEFT, copy RIGHT (default order) */
                .split-grid-left {
                    grid-template-columns: minmax(280px, 1fr) 1.2fr;
                }
                /* split grid: copy LEFT, video RIGHT */
                .split-grid-right {
                    grid-template-columns: 1.2fr minmax(280px, 1fr);
                }
                @media (max-width: 960px) {
                    .split-grid-left, .split-grid-right {
                        grid-template-columns: 1fr !important;
                        gap: 32px !important;
                    }
                    /* On mobile, always put media FIRST */
                    .split-grid-right > div:nth-child(1) { order: 2; }
                    .split-grid-right > div:nth-child(2) { order: 1; }
                    .stones-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
                    .contact-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 48px 32px !important; }

                    /* Tighter vertical spacing on tablet */
                    .cg-home-hero { height: calc(42vh + 64px) !important; min-height: 360px !important; }
                    .cg-home-masthead { padding: 48px 24px 44px !important; gap: 20px !important; }
                    .cg-home-masthead-tagline { letter-spacing: 0.2em !important; }
                    .cg-home-collection { padding: 30px 24px 80px !important; }
                    .cg-home-split { padding: 60px 24px 40px !important; }
                    .cg-home-commissions { padding: 70px 24px !important; }
                    .cg-home-contact { padding: 80px 24px 40px !important; }
                }
                @media (max-width: 600px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                    .footer-row { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }

                    /* Keep stones 2-per-row on phones, tighter gap + smaller type */
                    .stones-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
                    .stone-card > div:last-child > div:first-child {
                        font-size: 16px !important;
                        line-height: 1.15 !important;
                    }

                    /* Even tighter on phones */
                    .cg-home-hero { height: calc(38vh + 64px) !important; min-height: 320px !important; }
                    .cg-home-masthead { padding: 40px 20px 36px !important; }
                    .cg-home-masthead-tagline { font-size: 10px !important; letter-spacing: 0.16em !important; }
                    .cg-home-collection,
                    .cg-home-split,
                    .cg-home-commissions,
                    .cg-home-contact {
                        padding-left: 20px !important;
                        padding-right: 20px !important;
                    }
                }
                @media (max-width: 440px) {
                    .stones-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
                    .stone-card > div:last-child > div:first-child { font-size: 14px !important; }
                }
                .stone-card:hover img { transform: scale(1.03); }
            `}</style>
        </div>
    );
}

/* ═══════════════════ STYLES ═══════════════════ */

const pageStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    backgroundColor: "var(--paper, #F4F1EB)",
    color: "#000",
};

/* HERO IMAGE (no text overlay) */
const heroStyle: React.CSSProperties = {
    position: "relative",
    height: "calc(56vh + 64px)",
    minHeight: 480,
    maxHeight: 720,
    width: "100%",
    overflow: "hidden",
    background: "#000",
};
const heroImgStyle: React.CSSProperties = {
    objectFit: "cover",
    objectPosition: "center",
    zIndex: 0,
};

/* MASTHEAD (text under the banner) */
const mastheadSectionStyle: React.CSSProperties = {
    padding: "70px 5vw 60px",
    background: "var(--paper, #F4F1EB)",
};
const mastheadInnerStyle: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 26,
};
const mastheadRuleStyle: React.CSSProperties = {
    width: "100%",
    height: 1,
    background: "rgba(0,0,0,0.2)",
};
const mastheadKickerStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "#000",
    opacity: 0.55,
    fontWeight: 500,
};
const heroWordmarkStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(38px, 5.8vw, 86px)",
    fontWeight: 400,
    letterSpacing: "0.015em",
    lineHeight: 1,
    color: "#000",
    textAlign: "center",
    textTransform: "uppercase",
    margin: 0,
};
const mastheadTaglineStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "#000",
    opacity: 0.7,
    fontWeight: 400,
    lineHeight: 1.5,
    maxWidth: 720,
};

/* SHARED TEXT */
const sectionLabelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    fontWeight: 500,
    marginBottom: 16,
};
const sectionH2Style: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(40px, 6vw, 88px)",
    fontWeight: 400,
    lineHeight: 0.95,
    letterSpacing: "-0.02em",
    color: "#000",
};
const sectionLedeStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(18px, 1.8vw, 22px)",
    lineHeight: 1.55,
    color: "#000",
    maxWidth: 620,
    marginTop: 24,
};
const paraStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(18px, 1.8vw, 22px)",
    lineHeight: 1.6,
    color: "#000",
    maxWidth: 520,
    marginTop: 32,
};

/* BUTTONS */
const btnDarkStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    padding: "14px 28px",
    background: "#000",
    color: "#FFF",
    textDecoration: "none",
    fontWeight: 500,
    border: "1px solid #000",
    display: "inline-block",
    cursor: "pointer",
};

/* COLLECTION */
const collectionSectionStyle: React.CSSProperties = {
    padding: "40px 5vw 120px",
    maxWidth: 1600,
    margin: "0 auto",
};
const collectionHeaderStyle: React.CSSProperties = {
    maxWidth: 900,
};
const stonesGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 48,
};
const stoneCardStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: 16,
};
const stoneMediaStyle: React.CSSProperties = {
    aspectRatio: "4 / 5",
    overflow: "hidden",
    background: "#E8E2D4",
    position: "relative",
};
const stoneImgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
};
const stoneImgFallbackStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "rgba(0,0,0,0.35)",
};
const stoneFooterStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
};
const stoneNameStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 1.15,
    letterSpacing: "-0.005em",
    color: "#000",
};
const stoneMetaStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#000",
    opacity: 0.6,
};
const stonePriceStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 15,
    color: "#000",
    marginTop: 2,
};
const viewAllWrapStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    marginTop: 100,
};

/* SPLIT SECTIONS (shared by The House + Commissions) */
const splitSectionStyle: React.CSSProperties = {
    padding: "80px 5vw 60px",
    maxWidth: 1400,
    margin: "0 auto",
};
const splitGridStyle: React.CSSProperties = {
    display: "grid",
    gap: 80,
    alignItems: "center",
};
const verticalMediaStyle: React.CSSProperties = {
    aspectRatio: "9 / 16",
    width: "100%",
    maxWidth: 440,
    overflow: "hidden",
    background: "#1a1a1a",
    position: "relative",
};
const verticalVideoStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
};
const copyStackStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
};

/* FULL-BLEED PLATE */
const plateSectionStyle: React.CSSProperties = {
    padding: "40px 0 0",
    margin: 0,
    background: "var(--paper, #F4F1EB)",
    lineHeight: 0,
};
const plateImgStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    display: "block",
    maxHeight: "80vh",
    objectFit: "cover",
};

/* COMMISSIONS */
const commissionsSectionStyle: React.CSSProperties = {
    padding: "100px 5vw",
    background: "#FFFFFF",
    borderTop: "1px solid rgba(0,0,0,0.12)",
    borderBottom: "1px solid rgba(0,0,0,0.12)",
};

/* CONTACT */
const contactSectionStyle: React.CSSProperties = {
    padding: "120px 5vw 50px",
    maxWidth: 1600,
    margin: "0 auto",
};
const contactGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 40,
};
const contactLabelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(0,0,0,0.2)",
    fontWeight: 500,
};
const contactValueLinkStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 19,
    color: "#000",
    textDecoration: "none",
    lineHeight: 1.3,
    display: "inline-block",
    borderBottom: "1px solid rgba(0,0,0,0.25)",
    paddingBottom: 2,
};
const contactValueStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 17,
    color: "#000",
    lineHeight: 1.5,
};
const footerRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
};
const footerCopyStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#000",
};
const footerLinkStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#000",
    textDecoration: "none",
};