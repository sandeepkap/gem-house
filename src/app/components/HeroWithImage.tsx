export const revalidate = 0;
import { client } from "@/sanity/lib/client";
import Reveal from "@/app/components/Reveal";
import StoneFilters from "@/app/components/StoneFilters";
import Navigation from "@/app/components/Navigation";
import HeroWithImage from "@/app/components/HeroWithImage";

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

            {/* HERO SECTION with Portrait Image - Now a Client Component */}
            <HeroWithImage imageSrc="/background.png" />

            {/* COLLECTION SECTION */}
            <section id="collection" style={collectionSectionStyle}>
                <div style={accentLineStyle} />
                <div style={collectionContainerStyle}>
                    <StoneFilters stones={stones} />
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" style={contactSectionStyle}>
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

const h2LightStyle: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 46px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: 32,
    color: "#fafafa",
};

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

const contactLabelLightStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
};

const contactValueLinkLightStyle: React.CSSProperties = {
    fontSize: 18,
    color: "#fafafa",
    textDecoration: "none",
    letterSpacing: "-0.01em",
    transition: "opacity 0.3s ease",
    fontWeight: 300,
};

const contactValueLightStyle: React.CSSProperties = {
    fontSize: 18,
    color: "rgba(250, 250, 250, 0.75)",
    fontWeight: 300,
    lineHeight: 1.6,
    letterSpacing: "-0.01em",
};

const contactDividerLightStyle: React.CSSProperties = {
    width: "100%",
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(250, 250, 250, 0.12), transparent)",
    marginBottom: 80,
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