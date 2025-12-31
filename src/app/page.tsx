export const revalidate = 0;
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Reveal from "@/app/components/Reveal";

type StoneListItem = {
    _id: string;
    name: string;
    category: string;
    origin?: string;
    carat?: number;
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
      images
    }
  `);
}

export default async function Page() {
    const stones = await getStones();

    return (
        <div style={pageStyle}>
            {/* HERO SECTION - Full viewport */}
            <section style={heroSectionStyle}>
                <div style={heroContentStyle}>
                    <Reveal delayMs={0}>
                        <div style={brandStyle}>KAPU & CO.</div>
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
                            Offered strictly by appointment.
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
            <section style={collectionSectionStyle}>
                <div style={collectionContainerStyle}>
                    <Reveal delayMs={0}>
                        <div style={sectionKickerStyle}>Available Now</div>
                    </Reveal>
                    <Reveal delayMs={100}>
                        <h2 style={h2Style}>Collection</h2>
                    </Reveal>

                    <div style={gridStyle}>
                        {stones.map((s, index) => {
                            const cover = s.images?.[0];
                            return (
                                <Reveal key={s._id} delayMs={index * 80}>
                                    <Link href={`/stones/${s._id}`} style={cardStyle}>
                                        <div style={imageContainerStyle}>
                                            {cover ? (
                                                <div style={imageFrameStyle}>
                                                    <Image
                                                        src={urlFor(cover).url()}
                                                        alt={s.name}
                                                        width={800}
                                                        height={800}
                                                        style={imageStyle}
                                                    />
                                                </div>
                                            ) : (
                                                <div style={noImageFrameStyle}>
                                                    <div style={noImageStyle}>No image available</div>
                                                </div>
                                            )}
                                        </div>

                                        <div style={cardContentStyle}>
                                            <div style={cardHeaderStyle}>
                                                <div style={stoneNameStyle}>{s.name}</div>
                                                <div style={stoneCategoryStyle}>{s.category}</div>
                                            </div>
                                            <div style={stoneMetaStyle}>
                                                {s.origin ? s.origin : "Origin undisclosed"}
                                                {typeof s.carat === "number" && ` · ${s.carat} ct`}
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section style={contactSectionStyle}>
                <div style={contactContainerStyle}>
                    <Reveal delayMs={0}>
                        <div style={sectionKickerLightStyle}>Inquiries</div>
                    </Reveal>
                    <Reveal delayMs={100}>
                        <h2 style={h2LightStyle}>Contact</h2>
                    </Reveal>

                    <Reveal delayMs={200}>
                        <div style={contactInfoStyle}>
                            <a href="mailto:inquiries@yourdomain.com" style={contactLinkStyle}>
                                inquiries@yourdomain.com
                            </a>
                            <div style={contactDetailStyle}>+94 XX XXX XXXX</div>
                        </div>
                    </Reveal>
                </div>

                <div style={footerStyle}>
                    © {new Date().getFullYear()} Kapu & Co. — Private sourcing by
                    appointment
                </div>
            </section>
        </div>
    );
}

/* ------------------ STYLES ------------------ */

const pageStyle: React.CSSProperties = {
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
    color: "#fafafa",
    backgroundColor: "#0a0a0a",
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
    backgroundColor: "#0a0a0a",
};

const heroContentStyle: React.CSSProperties = {
    maxWidth: 780,
    textAlign: "center",
};

const brandStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "#fafafa",
    marginBottom: 48,
};

const h1Style: React.CSSProperties = {
    fontSize: "clamp(48px, 7vw, 82px)",
    lineHeight: 1.08,
    fontWeight: 400,
    letterSpacing: "-0.02em",
    marginBottom: 32,
    color: "#fafafa",
};

const ledeStyle: React.CSSProperties = {
    fontSize: "clamp(17px, 2vw, 20px)",
    lineHeight: 1.7,
    color: "rgba(250, 250, 250, 0.68)",
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
};

const scrollLineStyle: React.CSSProperties = {
    width: 1,
    height: 48,
    background: "linear-gradient(to bottom, rgba(250,250,250,0) 0%, rgba(250,250,250,0.3) 100%)",
};

const scrollTextStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
};

// COLLECTION SECTION
const collectionSectionStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    color: "#0a0a0a",
    padding: "160px 5vw 180px",
};

const collectionContainerStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: "0 auto",
};

const sectionKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.48)",
    marginBottom: 12,
};

const sectionKickerLightStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(250, 250, 250, 0.48)",
    marginBottom: 12,
};

const h2Style: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 46px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: 80,
    color: "#0a0a0a",
};

const h2LightStyle: React.CSSProperties = {
    fontSize: "clamp(32px, 4vw, 46px)",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    marginBottom: 48,
    color: "#fafafa",
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 48,
};

const cardStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "pointer",
};

const imageContainerStyle: React.CSSProperties = {
    marginBottom: 24,
};

const imageFrameStyle: React.CSSProperties = {
    border: "1px solid rgba(10, 10, 10, 0.12)",
    overflow: "hidden",
    aspectRatio: "1 / 1",
    backgroundColor: "rgba(10, 10, 10, 0.02)",
};

const noImageFrameStyle: React.CSSProperties = {
    border: "1px solid rgba(10, 10, 10, 0.12)",
    aspectRatio: "1 / 1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 10, 0.02)",
};

const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
};

const noImageStyle: React.CSSProperties = {
    fontSize: 13,
    color: "rgba(10, 10, 10, 0.32)",
    letterSpacing: "0.02em",
};

const cardContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
};

const cardHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 16,
};

const stoneNameStyle: React.CSSProperties = {
    fontSize: 19,
    fontWeight: 400,
    letterSpacing: "-0.01em",
};

const stoneCategoryStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(10, 10, 10, 0.56)",
    whiteSpace: "nowrap",
};

const stoneMetaStyle: React.CSSProperties = {
    fontSize: 14,
    color: "rgba(10, 10, 10, 0.56)",
    fontWeight: 300,
};

// CONTACT SECTION
const contactSectionStyle: React.CSSProperties = {
    backgroundColor: "#0a0a0a",
    color: "#fafafa",
    padding: "160px 5vw 80px",
};

const contactContainerStyle: React.CSSProperties = {
    maxWidth: 1400,
    margin: "0 auto",
    marginBottom: 120,
};

const contactInfoStyle: React.CSSProperties = {
    marginTop: 48,
    display: "flex",
    flexDirection: "column",
    gap: 16,
};

const contactLinkStyle: React.CSSProperties = {
    fontSize: "clamp(20px, 2.8vw, 32px)",
    color: "#fafafa",
    textDecoration: "none",
    letterSpacing: "-0.01em",
    transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
};

const contactDetailStyle: React.CSSProperties = {
    fontSize: 18,
    color: "rgba(250, 250, 250, 0.56)",
    fontWeight: 300,
};

const footerStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(250, 250, 250, 0.42)",
    letterSpacing: "0.02em",
    textAlign: "center",
    maxWidth: 1400,
    margin: "0 auto",
    paddingTop: 48,
    borderTop: "1px solid rgba(250, 250, 250, 0.08)",
};