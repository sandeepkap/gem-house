export const revalidate = 0;
import { client } from "@/sanity/lib/client";
import Reveal from "@/app/components/Reveal";
import StoneFilters from "@/app/components/StoneFilters";
import Navigation from "@/app/components/Navigation";

type StoneListItem = {
    _id: string;
    name: string;
    category: string;
    origin?: string;
    carat?: number;
    price?: number | null;
    images?: any[];
};

async function getStones(): Promise<StoneListItem[]> {
    return client.fetch(`
    *[_type == "stone" && available == true] | order(_createdAt desc) {
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

export default async function Page() {
    const stones = await getStones();

    return (
        <div style={pageStyle}>
            <Navigation />

            {/* COMPACT HERO - No text over image */}
            <section style={heroSectionStyle}>
                {/* Gemstone Image Banner - Horizontal, no text overlay */}
                <div style={imageContainerStyle}>
                    <img
                        src="/background.jpg"
                        alt="Fine Gemstones"
                        style={bannerImageStyle}
                    />
                    {/* Subtle gradient overlay at bottom for blend */}
                    <div style={imageOverlayStyle} />
                </div>

                {/* Minimal Text Section Below Image */}
                <div style={heroTextSectionStyle}>
                    <div style={heroContentStyle}>
                        <Reveal delayMs={0}>
                            <div style={brandStyle}>CEYLON GEM CO.</div>
                        </Reveal>
                        <Reveal delayMs={100}>
                            <h3 style={h1Style}>Fine gemstones sourced in Ceylon and distributed across global markets.</h3>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* COLLECTION SECTION - Immediately visible */}
            <section id="collection" style={collectionSectionStyle}>
                <div style={collectionContainerStyle}>
                    <StoneFilters stones={stones} />
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

// COMPACT HERO SECTION
const heroSectionStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    position: "relative",
};

// Image Container - Horizontal banner style
const imageContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "50vh", // Half viewport - short and elegant
    maxHeight: 500,
    minHeight: 350,
    position: "relative",
    overflow: "hidden",
    marginTop: 60, // Push image lower, below the navigation
};

// Banner Image - Fills width, crops height if needed
const bannerImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 60%",
    display: "block",
    filter: "none", // No filters for crisp quality
};

// Subtle gradient at bottom for seamless transition - much more subtle
const imageOverlayStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "15%", // Reduced from 30% - less overlay
    background: "linear-gradient(to bottom, transparent, rgba(249, 248, 246, 0.3))", // More transparent
    pointerEvents: "none",
};

// Text Section Below Image
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
};

const h1Style: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 48px)",
    lineHeight: 1.2,
    fontWeight: 400,
    letterSpacing: "-0.01em",
    color: "#1a1a1a",
    margin: 0,
};

// COLLECTION SECTION - Compact, shows stones immediately
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

// CONTACT SECTION
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