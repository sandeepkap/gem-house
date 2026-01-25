export const revalidate = 0;

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import Reveal from "@/app/components/Reveal";
import StoneFilters from "@/app/components/StoneFilters";
import Navigation from "@/app/components/Navigation";

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

async function getStones(): Promise<StoneListItem[]> {
    return client.fetch(`
        *[_type == "stone" && available == true]
        | order(sortOrder asc, _createdAt desc) {
            _id,
            name,
            category,
            origin,
            carat,
            price,
            images
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

    // ✅ Preserve real category + show PRICE where StoneFilters displays it
    const stonesForHome: StoneListItem[] = stones.map((s) => ({
        ...s,
        realCategory: s.category, // Store the actual category for filtering
        category: formatPrice(s.price), // Display price instead
    }));

    return (
        <div style={pageStyle}>
            <Navigation />

            {/* HERO */}
            <section style={heroSectionStyle}>
                <div style={imageContainerStyle}>
                    <img src="/background.jpg" alt="Fine Gemstones" style={bannerImageStyle} />
                    <div style={imageFadeStyle} />
                </div>

                <div style={mastheadWrapStyle}>
                    <div style={mastheadInnerStyle}>
                        <div style={mastheadRuleStyle} />
                        <Reveal delayMs={0}>
                            <div style={mastheadTopKickerStyle}>CEYLON · SRI LANKA</div>
                        </Reveal>
                        <Reveal delayMs={80}>
                            <h1 style={mastheadTitleStyle}>CEYLON GEM CO.</h1>
                        </Reveal>
                        <Reveal delayMs={140}>
                            <div style={mastheadSubStyle}>
                                Fine gemstones sourced in Ceylon and distributed across global markets
                            </div>
                        </Reveal>
                        <div style={mastheadRuleStyle} />
                    </div>
                </div>
            </section>

            {/* COLLECTION - Category buttons are now inside StoneFilters */}
            <section id="collection" style={collectionSectionStyle}>
                <div style={collectionContainerStyle}>
                    <StoneFilters stones={stonesForHome} />
                </div>
            </section>

            {/* CONTACT / FOOTER */}
            <section id="contact" style={contactSectionStyle}>
                <div style={contactOuterStyle}>
                    <div style={contactHeaderWrapStyle} className="contact-header">
                        <div>
                            <Reveal delayMs={0}>
                                <div style={sectionKickerStyle}>Inquiries</div>
                            </Reveal>
                            <Reveal delayMs={80}>
                                <h2 style={h2Style}>Get in Touch</h2>
                            </Reveal>
                        </div>

                        <Reveal delayMs={140}>
                            <p style={contactDescriptionStyle} className="contact-desc">
                                For inquiries about our collection, private viewings, or bespoke sourcing,
                                please contact us via telephone or email. All appointments are arranged strictly
                                by prior arrangement.
                            </p>
                        </Reveal>
                    </div>

                    <Reveal delayMs={220}>
                        <div style={contactGridStyle} className="contact-grid">
                            <div style={contactBlockStyle}>
                                <div style={contactLabelStyle}>Email</div>
                                <a
                                    href="mailto:ceylongemcompany.inquiries@gmail.com"
                                    style={contactValueLinkStyle}
                                >
                                    ceylongemcompany.inquiries@gmail.com
                                </a>
                            </div>

                            <div style={contactBlockStyle}>
                                <div style={contactLabelStyle}>Telephone</div>
                                <a href="tel:+94777752858" style={contactValueLinkStyle}>
                                    +94 77 775 2858
                                </a>
                                <a href="tel:+16084212077" style={contactValueLinkStyle}>
                                    +1 608 421 2077
                                </a>
                            </div>

                            <div style={contactBlockStyle}>
                                <div style={contactLabelStyle}>Location</div>
                                <div style={contactValueStyle}>
                                    Colombo, Sri Lanka
                                    <br />
                                    Madison, WI USA
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <div style={contactRuleStyle} />

                    <Reveal delayMs={300}>
                        <div style={socialRowStyle} className="social-row">
                            <div style={socialLabelStyle}>Follow</div>
                            <div style={socialLinksStyle}>
                                <a
                                    href="https://www.instagram.com/ceylongemcompany.official/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={socialLinkStyle}
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://www.facebook.com/profile.php?id=61586976603078"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={socialLinkStyle}
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div style={footerStyle}>
                    © {new Date().getFullYear()} CEYLON GEM COMPANY — Private sourcing by appointment
                </div>

                <style>{`
          @media (max-width: 980px) {
            .contact-header { grid-template-columns: 1fr !important; gap: 26px !important; }
            .contact-desc { max-width: 720px !important; }
            .contact-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
            .social-row { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
          }
        `}</style>
            </section>
        </div>
    );
}

/* ------------------ STYLES ------------------ */

const pageStyle: React.CSSProperties = {
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
    backgroundColor: "#F9F8F6",
    color: "#1a1a1a",
};

const heroSectionStyle: React.CSSProperties = { position: "relative" };
const imageContainerStyle: React.CSSProperties = {
    height: "52vh",
    minHeight: 440,
    marginTop: 60,
    position: "relative",
    overflow: "hidden",
};
const bannerImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 60%",
    display: "block",
};
const imageFadeStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "18%",
    background: "linear-gradient(to bottom, rgba(249,248,246,0) 0%, rgba(249,248,246,0.92) 100%)",
    pointerEvents: "none",
};

const mastheadWrapStyle: React.CSSProperties = { backgroundColor: "#F9F8F6", padding: "48px 5vw 28px" };
const mastheadInnerStyle: React.CSSProperties = { maxWidth: 1400, margin: "0 auto", textAlign: "center" };
const mastheadRuleStyle: React.CSSProperties = {
    height: 1,
    width: "min(760px, 90%)",
    margin: "0 auto",
    backgroundColor: "rgba(26,26,26,0.12)",
};
const mastheadTopKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.34em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.55)",
    marginTop: 22,
};
const mastheadTitleStyle: React.CSSProperties = {
    fontSize: "clamp(34px, 4.1vw, 54px)",
    fontWeight: 400,
    letterSpacing: "0.08em",
    margin: "18px 0 12px",
    color: "#1a1a1a",
    lineHeight: 1.1,
};
const mastheadSubStyle: React.CSSProperties = {
    fontSize: 13,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.55)",
    lineHeight: 1.7,
    maxWidth: 860,
    margin: "0 auto 22px",
};

const collectionSectionStyle: React.CSSProperties = { padding: "80px 5vw", backgroundColor: "#F9F8F6" };
const collectionContainerStyle: React.CSSProperties = { maxWidth: 1600, margin: "0 auto" };

const contactSectionStyle: React.CSSProperties = {
    backgroundColor: "#111111",
    color: "#F9F8F6",
    padding: "140px 5vw 80px",
};
const contactOuterStyle: React.CSSProperties = { maxWidth: 1600, margin: "0 auto" };

const contactHeaderWrapStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 80,
    alignItems: "start",
    marginBottom: 90,
};

const sectionKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(249, 248, 246, 0.45)",
    marginBottom: 14,
};

const h2Style: React.CSSProperties = {
    fontSize: "clamp(34px, 4.2vw, 52px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    margin: 0,
};

const contactDescriptionStyle: React.CSSProperties = {
    fontSize: 18,
    lineHeight: 1.8,
    color: "rgba(249, 248, 246, 0.70)",
    fontWeight: 300,
    margin: 0,
    maxWidth: 760,
};

const contactGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 80,
};

const contactBlockStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };

const contactLabelStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(249, 248, 246, 0.42)",
};

const contactValueLinkStyle: React.CSSProperties = {
    fontSize: 18,
    color: "#F9F8F6",
    textDecoration: "none",
    fontWeight: 300,
    borderBottom: "1px solid rgba(249, 248, 246, 0.14)",
    paddingBottom: 4,
    width: "fit-content",
};

const contactValueStyle: React.CSSProperties = {
    fontSize: 18,
    color: "rgba(249, 248, 246, 0.82)",
    fontWeight: 300,
    lineHeight: 1.6,
};

const contactRuleStyle: React.CSSProperties = {
    margin: "110px 0 40px",
    height: 1,
    background: "rgba(249, 248, 246, 0.10)",
};

const socialRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
};

const socialLabelStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(249, 248, 246, 0.42)",
};

const socialLinksStyle: React.CSSProperties = { display: "flex", gap: 24, flexWrap: "wrap" };

const socialLinkStyle: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(249, 248, 246, 0.88)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(249, 248, 246, 0.18)",
    paddingBottom: 4,
};

const footerStyle: React.CSSProperties = {
    marginTop: 60,
    paddingTop: 40,
    borderTop: "1px solid rgba(249, 248, 246, 0.08)",
    textAlign: "center",
    fontSize: 11,
    color: "rgba(249, 248, 246, 0.35)",
    letterSpacing: "0.02em",
};