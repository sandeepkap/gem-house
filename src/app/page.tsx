export const revalidate = 0;

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import Reveal from "@/app/components/Reveal";
import StoneFilters from "@/app/components/StoneFilters";
import Navigation from "@/app/components/Navigation";

type StoneListItem = {
    _id: string;
    name: string;
    category: string; // StoneFilters uses this for the "subtitle" line
    origin?: string;
    carat?: number;
    price?: number | null;
    images?: any[];
};

// ✅ UPDATED: Now sorts by sortOrder first, then creation date
async function getStones(): Promise<StoneListItem[]> {
    return client.fetch(`
    *[_type == "stone" && available == true] | order(sortOrder asc, _createdAt desc) {
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

    // ✅ Make homepage show PRICE where StoneFilters currently shows CATEGORY
    const stonesForHome: StoneListItem[] = stones.map((s) => ({
        ...s,
        category: formatPrice(s.price), // overwrite category with formatted price string
    }));

    return (
        <div style={pageStyle}>
            <Navigation />

            {/* COMPACT HERO - No text over image */}
            <section style={heroSectionStyle}>
                <div style={imageContainerStyle} className="hero-banner-container">
                    <img
                        src="/background.jpg"
                        alt="Fine Gemstones"
                        style={bannerImageStyle}
                        className="hero-banner-image"
                    />
                    <div style={imageOverlayStyle} />
                </div>

                <div style={heroTextSectionStyle} className="hero-text-section">
                    <div style={heroContentStyle}>
                        <Reveal delayMs={0}>
                            <h1 style={brandHeadingStyle} className="hero-h1">
                                Ceylon Gem Co.
                            </h1>
                        </Reveal>

                        <Reveal delayMs={100}>
                            <div
                                style={{ ...brandStyle, marginTop: 14, marginBottom: 0 }}
                                className="hero-brand-text"
                            >
                                Fine gemstones sourced in Ceylon and distributed across global markets
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* COLLECTION SECTION */}
            <section id="collection" style={collectionSectionStyle}>
                <div style={collectionContainerStyle}>
                    {/* ✅ Category shortcuts */}
                    <div style={categoryNavWrapStyle}>
                        <Reveal delayMs={0}>
                            <div style={categoryNavTitleStyle}>Browse by stone</div>
                        </Reveal>

                        <Reveal delayMs={100}>
                            <div style={categoryNavStyle} className="category-nav">
                                <Link
                                    href="/stones/category/sapphire"
                                    style={categoryPillStyle}
                                    className="category-pill"
                                >
                                    Sapphires
                                </Link>
                                <Link
                                    href="/stones/category/padparadscha"
                                    style={categoryPillStyle}
                                    className="category-pill"
                                >
                                    Padparadscha
                                </Link>
                                <Link
                                    href="/stones/category/spinel"
                                    style={categoryPillStyle}
                                    className="category-pill"
                                >
                                    Spinel
                                </Link>
                                <Link
                                    href="/stones/category/other"
                                    style={categoryPillStyle}
                                    className="category-pill"
                                >
                                    Other
                                </Link>
                            </div>
                        </Reveal>
                    </div>

                    {/* ✅ pass transformed stones so homepage displays price */}
                    <StoneFilters stones={stonesForHome} />
                </div>
            </section>

            {/* PARTNERS SECTION */}
            <section style={partnersSectionStyle}>
                <div style={partnersContainerStyle}>
                    <Reveal delayMs={0}>
                        <div style={partnerKickerStyle}>Our Network</div>
                    </Reveal>
                    <Reveal delayMs={100}>
                        <h2 style={partnersHeadingStyle}>People We Work With</h2>
                    </Reveal>
                    <Reveal delayMs={200}>
                        <p style={partnersDescriptionStyle}>
                            We collaborate with Sri Lanka&apos;s most respected gemological laboratories
                            and certification authorities to ensure authenticity and quality.
                        </p>
                    </Reveal>

                    <Reveal delayMs={300}>
                        <div style={partnersGridStyle} className="partners-grid">
                            <div style={partnerCardStyle} className="partner-card">
                                <div style={partnerLogoStyle} className="partner-logo">
                                    <a href="https://www.gia.edu/" target="_blank" rel="noopener noreferrer">
                                        <img
                                            src="/GIA.jpg"
                                            alt="GIA - Gemological Institute of America"
                                            style={logoImageStyle}
                                        />
                                    </a>
                                </div>
                            </div>

                            <div style={partnerCardStyle} className="partner-card">
                                <div style={partnerLogoStyle} className="partner-logo">
                                    <a href="https://www.agclgemlab.com/" target="_blank" rel="noopener noreferrer">
                                        <img
                                            src="/AGCL.png"
                                            alt="AGCL - Asian Gemological Centre & Laboratory"
                                            style={logoImageStyle}
                                        />
                                    </a>
                                </div>
                            </div>

                            <div style={partnerCardStyle} className="partner-card">
                                <div style={partnerLogoStyle} className="partner-logo">
                                    <a
                                        href="https://www.facebook.com/p/RGTL-Rockland-Gem-Testing-Laboratory-100093904602773/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src="/RGTL.png"
                                            alt="RGTL - Rockland Gem Testing Laboratory"
                                            style={logoImageStyle}
                                        />
                                    </a>
                                </div>
                            </div>

                            <div style={partnerCardStyle} className="partner-card">
                                <div style={partnerLogoStyle} className="partner-logo">
                                    <a href="https://www.gemlabanalysis.com/" target="_blank" rel="noopener noreferrer">
                                        <img
                                            src="/bellerophon.png"
                                            alt="Bellerophon Gemological Laboratory"
                                            style={logoImageStyle}
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" style={contactSectionStyle}>
                <div style={contactContainerStyle}>
                    <Reveal delayMs={0}>
                        <div style={sectionKickerStyle}>Inquiries</div>
                    </Reveal>
                    <Reveal delayMs={100}>
                        <h2 style={h2Style}>Get in Touch</h2>
                    </Reveal>
                    <Reveal delayMs={200}>
                        <p style={contactDescriptionStyle}>
                            For inquiries about our collection, private viewings, or bespoke sourcing,
                            please reach out via email or telephone. All appointments are arranged by
                            prior arrangement only.
                        </p>
                    </Reveal>
                    <Reveal delayMs={300}>
                        <div style={contactGridStyle}>
                            <div style={contactBlockStyle}>
                                <div style={contactLabelStyle}>Email</div>
                                <a href="mailto:hasinirana1@gmail.com" style={contactValueLinkStyle}>
                                    hasinirana1@gmail.com
                                </a>
                                <a href="mailto:sandeepkap08@gmail.com" style={contactValueLinkStyle}>
                                    sandeepkap08@gmail.com
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
                </div>
                <div style={footerStyle}>
                    © {new Date().getFullYear()} CEYLON GEM COMPANY — Private sourcing by appointment
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

const heroSectionStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    position: "relative",
};

const imageContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "50vh",
    maxHeight: 500,
    minHeight: 350,
    position: "relative",
    overflow: "hidden",
    marginTop: 60,
};

const bannerImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 60%",
    display: "block",
    filter: "none",
};

const imageOverlayStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "15%",
    background: "linear-gradient(to bottom, transparent, rgba(249, 248, 246, 0.3))",
    pointerEvents: "none",
};

const heroTextSectionStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    padding: "60px 5vw",
};

const heroContentStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: "0 auto",
    textAlign: "center",
};

const brandStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "rgba(26, 26, 26, 0.5)",
    marginBottom: 20,
    lineHeight: 1.6,
};

const brandHeadingStyle: React.CSSProperties = {
    ...brandStyle,
    fontSize: "clamp(28px, 3.8vw, 50px)",
    letterSpacing: "0.2em",
    marginBottom: 0,
    color: "#1a1a1a",
    lineHeight: 1.12,
};

const collectionSectionStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    color: "#1a1a1a",
    padding: "60px 5vw 120px",
    position: "relative",
};

const collectionContainerStyle: React.CSSProperties = {
    maxWidth: 1600,
    margin: "0 auto",
};

/* ✅ Category nav styles */
const categoryNavWrapStyle: React.CSSProperties = {
    marginBottom: 36,
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
    border: "1px solid rgba(26, 26, 26, 0.14)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: "10px 14px",
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transition: "opacity 0.25s ease",
};

/* PARTNERS SECTION */
const partnersSectionStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    padding: "140px 5vw",
    position: "relative",
    borderTop: "1px solid rgba(26, 26, 26, 0.08)",
};

const partnersContainerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
};

const partnerKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(26, 26, 26, 0.4)",
    marginBottom: 16,
};

const partnersHeadingStyle: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 46px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: 24,
    color: "#1a1a1a",
};

const partnersDescriptionStyle: React.CSSProperties = {
    fontSize: 17,
    lineHeight: 1.7,
    color: "rgba(26, 26, 26, 0.6)",
    fontWeight: 300,
    marginBottom: 80,
    maxWidth: 640,
    margin: "0 auto 80px",
};

const partnersGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 40,
    maxWidth: 1400,
    margin: "0 auto",
};

const partnerCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 40px",
    border: "1px solid rgba(26, 26, 26, 0.08)",
    backgroundColor: "rgba(249, 248, 246, 0.3)",
    transition: "all 0.3s ease",
    minHeight: "180px",
};

const partnerLogoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const logoImageStyle: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "120px",
    width: "auto",
    height: "auto",
    objectFit: "contain",
    filter: "grayscale(100%)",
    opacity: 0.7,
    transition: "all 0.3s ease",
};

const contactSectionStyle: React.CSSProperties = {
    backgroundColor: "#111111",
    color: "#F9F8F6",
    padding: "120px 5vw 80px",
    position: "relative",
};

const contactContainerStyle: React.CSSProperties = {
    maxWidth: 1000,
    margin: "0 auto",
};

const sectionKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(249, 248, 246, 0.4)",
    marginBottom: 16,
};

const h2Style: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: 60,
};

const contactDescriptionStyle: React.CSSProperties = {
    fontSize: 18,
    lineHeight: 1.7,
    color: "rgba(249, 248, 246, 0.7)",
    fontWeight: 300,
    marginBottom: 80,
    maxWidth: 650,
};

const contactGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 60,
    marginBottom: 80,
};

const contactBlockStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
};

const contactLabelStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(249, 248, 246, 0.4)",
};

const contactValueLinkStyle: React.CSSProperties = {
    fontSize: 18,
    color: "#F9F8F6",
    textDecoration: "none",
    fontWeight: 300,
    borderBottom: "1px solid rgba(249, 248, 246, 0.1)",
    paddingBottom: 4,
    width: "fit-content",
    transition: "opacity 0.3s ease",
};

const contactValueStyle: React.CSSProperties = {
    fontSize: 18,
    color: "rgba(249, 248, 246, 0.8)",
    fontWeight: 300,
    lineHeight: 1.6,
};

const footerStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(249, 248, 246, 0.3)",
    letterSpacing: "0.02em",
    textAlign: "center",
    paddingTop: 60,
    borderTop: "1px solid rgba(249, 248, 246, 0.08)",
};