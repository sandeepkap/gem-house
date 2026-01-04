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

            {/* HERO SECTION - Full viewport */}
            <section style={heroSectionStyle}>
                {/* Gemstone-inspired gradient background */}
                <div style={heroBackgroundStyle} />

                <div style={heroContentStyle}>
                    <Reveal delayMs={0}>
                        <div style={brandStyle}>RANASINGHE & CO.</div>
                    </Reveal>
                    <Reveal delayMs={150}>
                        <h1 style={h1Style}>
                            Fine Gemstones
                            <br />
                            Private Trade
                        </h1>
                    </Reveal>
                    <Reveal delayMs={300}>
                        <p style={ledeStyle}>
                            An understated collection of fine gemstones. Sapphires, rubies,
                            and emeralds selected for color, proportion, and provenance.
                            Offered by appointment.
                        </p>
                    </Reveal>
                </div>

                {/* Scroll indicator */}
                <div style={scrollIndicatorStyle}>
                    <div style={scrollLineStyle} />
                    <div style={scrollTextStyle}>Explore Collection</div>
                </div>
            </section>

            {/* COLLECTION SECTION - Distinct background */}
            <section id="collection" style={collectionSectionStyle}>
                {/* Subtle accent line */}
                <div style={accentLineStyle} />

                <div style={collectionContainerStyle}>
                    <StoneFilters stones={stones} />
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" style={contactSectionStyle}>
                {/* Dark background */}
                <div style={contactBackgroundStyle} />

                <div style={contactContainerStyle}>
                    <Reveal delayMs={0}>
                        <div style={sectionKickerLightStyle}>Inquiries</div>
                    </Reveal>
                    <Reveal delayMs={100}>
                        <h2 style={h2LightStyle}>Get in Touch</h2>
                    </Reveal>

                    <Reveal delayMs={200}>
                        <p style={contactDescriptionLightStyle}>
                            For inquiries about our collection, private viewings, or bespoke sourcing,
                            please reach out via email or telephone. All appointments are arranged by
                            prior arrangement only.
                        </p>
                    </Reveal>

                    <Reveal delayMs={300}>
                        <div style={contactGridStyle}>
                            <div style={contactBlockStyle}>
                                <div style={contactLabelLightStyle}>Email</div>
                                <a href="mailto:hasinirana1@gmail.com" style={contactValueLinkLightStyle}>
                                    hasinirana1@gmail.com
                                </a>
                                <a href="mailto:sandeepkap08@gmail.com" style={contactValueLinkLightStyle}>
                                    sandeepkap08@gmail.com
                                </a>
                            </div>

                            <div style={contactBlockStyle}>
                                <div style={contactLabelLightStyle}>Telephone</div>
                                <a href="tel:+94777752858" style={contactValueLinkLightStyle}>
                                    +94 77 775 2858
                                </a>
                                <a href="tel:+16084212077" style={contactValueLinkLightStyle}>
                                    +1 608 421 2077
                                </a>
                            </div>

                            <div style={contactBlockStyle}>
                                <div style={contactLabelLightStyle}>Location</div>
                                <div style={contactValueLightStyle}>
                                    Colombo, Sri Lanka
                                    <br />
                                    Madison, WI USA
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delayMs={400}>
                        <div style={contactDividerLightStyle} />
                    </Reveal>

                </div>

                <div style={footerLightStyle}>
                    © {new Date().getFullYear()} Ranasinghe & Co. — Private sourcing by appointment
                </div>
            </section>
        </div>
    );
}

/* ------------------ STYLES ------------------ */

const pageStyle: React.CSSProperties = {
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
    color: "#0a0a0a",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
};

// HERO SECTION
const heroSectionStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5vw",
    position: "relative",
    backgroundColor: "#fafafa",
    overflow: "hidden",
};

const heroBackgroundStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `
    radial-gradient(ellipse 1400px 1000px at 25% 20%, rgba(65, 105, 225, 0.12), transparent 65%),
    radial-gradient(ellipse 1200px 900px at 75% 70%, rgba(220, 20, 60, 0.10), transparent 60%),
    radial-gradient(ellipse 1000px 800px at 50% 50%, rgba(50, 205, 50, 0.08), transparent 55%),
    radial-gradient(ellipse 900px 700px at 80% 30%, rgba(138, 43, 226, 0.09), transparent 50%),
    radial-gradient(ellipse 800px 600px at 20% 80%, rgba(255, 140, 0, 0.07), transparent 45%),
    #fafafa
  `,
    opacity: 1,
    animation: "subtleShift 20s ease-in-out infinite",
};

const heroContentStyle: React.CSSProperties = {
    maxWidth: 780,
    textAlign: "center",
    position: "relative",
    zIndex: 1,
};

const brandStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "#0a0a0a",
    marginBottom: 48,
};

const h1Style: React.CSSProperties = {
    fontSize: "clamp(48px, 7vw, 82px)",
    lineHeight: 1.08,
    fontWeight: 400,
    letterSpacing: "-0.02em",
    marginBottom: 32,
    color: "#0a0a0a",
};

const ledeStyle: React.CSSProperties = {
    fontSize: "clamp(17px, 2vw, 20px)",
    lineHeight: 1.7,
    color: "rgba(10, 10, 10, 0.68)",
    fontWeight: 300,
    maxWidth: 620,
    margin: "0 auto",
};

const scrollIndicatorStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    animation: "fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both",
    zIndex: 1,
};

const scrollLineStyle: React.CSSProperties = {
    width: 1,
    height: 48,
    background: "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.3) 100%)",
};

const scrollTextStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.48)",
};

// COLLECTION SECTION
const collectionSectionStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    color: "#0a0a0a",
    padding: "160px 5vw 180px",
    position: "relative",
};

const accentLineStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "120px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(10, 10, 10, 0.2), transparent)",
};

const collectionContainerStyle: React.CSSProperties = {
    maxWidth: 1600,
    margin: "0 auto",
};

const sectionKickerLightStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
    marginBottom: 12,
};

const sectionKickerDarkStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.48)",
    marginBottom: 12,
};

const h2LightStyle: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 46px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: 32,
    color: "#fafafa",
};

const h2DarkStyle: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 46px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: 32,
    color: "#0a0a0a",
};

// CONTACT SECTION
const contactSectionStyle: React.CSSProperties = {
    backgroundColor: "#0a0a0a",
    color: "#fafafa",
    padding: "160px 5vw 80px",
    position: "relative",
    overflow: "hidden",
};

const contactBackgroundStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "#0a0a0a",
};

const contactContainerStyle: React.CSSProperties = {
    maxWidth: 1000,
    margin: "0 auto",
    marginBottom: 120,
    position: "relative",
    zIndex: 1,
};

const contactDescriptionStyle: React.CSSProperties = {
    fontSize: 17,
    lineHeight: 1.7,
    color: "rgba(10, 10, 10, 0.68)",
    fontWeight: 300,
    marginBottom: 80,
    maxWidth: 680,
    position: "relative",
    zIndex: 1,
};

const contactDescriptionLightStyle: React.CSSProperties = {
    fontSize: 17,
    lineHeight: 1.7,
    color: "rgba(250, 250, 250, 0.68)",
    fontWeight: 300,
    marginBottom: 80,
    maxWidth: 680,
    position: "relative",
    zIndex: 1,
};

const contactGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 60,
    marginBottom: 80,
    position: "relative",
    zIndex: 1,
};

const contactBlockStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
};

const contactLabelDarkStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.48)",
};

const contactLabelLightStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
};

const contactValueLinkDarkStyle: React.CSSProperties = {
    fontSize: 18,
    color: "#0a0a0a",
    textDecoration: "none",
    letterSpacing: "-0.01em",
    transition: "opacity 0.3s ease",
    fontWeight: 300,
};

const contactValueLinkLightStyle: React.CSSProperties = {
    fontSize: 18,
    color: "#fafafa",
    textDecoration: "none",
    letterSpacing: "-0.01em",
    transition: "opacity 0.3s ease",
    fontWeight: 300,
};

const contactValueDarkStyle: React.CSSProperties = {
    fontSize: 18,
    color: "rgba(10, 10, 10, 0.75)",
    fontWeight: 300,
    lineHeight: 1.6,
    letterSpacing: "-0.01em",
};

const contactValueLightStyle: React.CSSProperties = {
    fontSize: 18,
    color: "rgba(250, 250, 250, 0.75)",
    fontWeight: 300,
    lineHeight: 1.6,
    letterSpacing: "-0.01em",
};

const contactDividerDarkStyle: React.CSSProperties = {
    width: "100%",
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(10, 10, 10, 0.12), transparent)",
    marginBottom: 80,
    position: "relative",
    zIndex: 1,
};

const contactDividerLightStyle: React.CSSProperties = {
    width: "100%",
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(250, 250, 250, 0.12), transparent)",
    marginBottom: 80,
    position: "relative",
    zIndex: 1,
};

const hoursBlockStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    position: "relative",
    zIndex: 1,
};

const hoursTextDarkStyle: React.CSSProperties = {
    fontSize: 16,
    color: "rgba(10, 10, 10, 0.68)",
    fontWeight: 300,
    lineHeight: 1.8,
};

const hoursTextLightStyle: React.CSSProperties = {
    fontSize: 16,
    color: "rgba(250, 250, 250, 0.68)",
    fontWeight: 300,
    lineHeight: 1.8,
};

const footerDarkStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(10, 10, 10, 0.42)",
    letterSpacing: "0.02em",
    textAlign: "center",
    maxWidth: 1400,
    margin: "0 auto",
    paddingTop: 48,
    borderTop: "1px solid rgba(10, 10, 10, 0.08)",
    position: "relative",
    zIndex: 1,
};

const footerLightStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(250, 250, 250, 0.42)",
    letterSpacing: "0.02em",
    textAlign: "center",
    maxWidth: 1400,
    margin: "0 auto",
    paddingTop: 48,
    borderTop: "1px solid rgba(250, 250, 250, 0.08)",
    position: "relative",
    zIndex: 1,
};