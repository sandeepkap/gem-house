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

            <HeroWithImage imageSrc="/background.png" />

            <section id="collection" style={collectionSectionStyle}>
                <div style={collectionContainerStyle}>
                    <StoneFilters stones={stones} />
                </div>
            </section>

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
                    © {new Date().getFullYear()} Ranasinghe & Co. — Private sourcing by appointment
                </div>
            </section>
        </div>
    );
}

/* ------------------ STYLES ------------------ */

const pageStyle: React.CSSProperties = {
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
    color: "#1a1a1a",
    backgroundColor: "#F9F8F6", // Consistent warm parchment
    minHeight: "100vh",
};

const collectionSectionStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    color: "#1a1a1a",
    padding: "80px 5vw 160px",
    position: "relative",
};

const collectionContainerStyle: React.CSSProperties = {
    maxWidth: 1600,
    margin: "0 auto",
};

const contactSectionStyle: React.CSSProperties = {
    backgroundColor: "#111111", // Solid deep charcoal for contrast
    color: "#F9F8F6",
    padding: "140px 5vw 80px",
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