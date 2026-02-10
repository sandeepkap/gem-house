import Image from "next/image";
import Navigation from "@/app/components/Navigation";
import ContactFormClient from "./ContactFormClient";
import { submitContact } from "./actions";

export default async function ContactPage({
                                              searchParams,
                                          }: {
    searchParams?: Promise<{ sent?: string; v?: string }>;
}) {
    const sp = (await searchParams) ?? {};
    const sent = sp.sent === "1";
    const failed = sp.sent === "0";
    const v = sp.v; // "1" validation, "2" send/config

    const validationFailed = failed && v === "1";
    const sendFailed = failed && v === "2";

    return (
        <div style={pageStyle}>
            <Navigation />

            {/* HERO */}
            <section style={heroSectionStyle}>
                <div style={imageContainerStyle} className="cg-hero">
                    <Image
                        src="/background.jpg"
                        alt="Contact — Ceylon Gem Co."
                        fill
                        priority
                        sizes="100vw"
                        style={bannerImageStyle}
                    />
                    <div style={heroOverlayStyle} />
                    <div style={imageFadeStyle} />
                </div>

                <div style={mastheadWrapStyle}>
                    <div style={mastheadInnerStyle}>
                        <div style={mastheadRuleStyle} />
                        <div style={mastheadTopKickerStyle}>INQUIRIES</div>
                        <h1 style={mastheadTitleStyle}>Contact</h1>
                        <div style={mastheadSubStyle}>
                            Availability, private viewings, and bespoke sourcing — by appointment.
                        </div>
                        <div style={mastheadRuleStyle} />
                    </div>
                </div>
            </section>

            {/* FORM */}
            <main style={mainStyle}>
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={sectionKickerStyle}>Preferred Contact</div>
                        <h2 style={h2Style}>Send an Inquiry</h2>
                        <p style={subtitleStyle}>
                            Choose how you’d like us to respond. We’ll follow up promptly.
                        </p>
                    </div>

                    {sent && (
                        <div style={successStyle}>
                            Your inquiry has been sent. We’ll be in touch shortly.
                        </div>
                    )}

                    {validationFailed && (
                        <div style={errorStyle}>Please complete the required fields and try again.</div>
                    )}

                    {sendFailed && (
                        <div style={errorStyle}>
                            We couldn’t send your inquiry right now. Please email us directly at{" "}
                            <a href="mailto:ceylongemcompany.inquiries@gmail.com" style={errorLinkStyle}>
                                ceylongemcompany.inquiries@gmail.com
                            </a>
                            .
                        </div>
                    )}

                    <ContactFormClient
                        action={submitContact}
                        styles={{
                            form: formStyle,
                            grid2: grid2Style,
                            field: fieldStyle,
                            label: labelStyle,
                            input: inputStyle,
                            select: selectStyle,
                            textarea: textareaStyle,
                            buttonRow: buttonRowStyle,
                            button: buttonStyle,
                            note: noteStyle,
                            directBox: directBoxStyle,
                            directLink: directLinkStyle,
                        }}
                    />
                </div>

                <style>{`
          @media (max-width: 860px) {
            .cg-grid2 { grid-template-columns: 1fr !important; }
            .cg-hero { height: 34vh !important; min-height: 300px !important; }
          }
        `}</style>
            </main>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const pageStyle: React.CSSProperties = {
    fontFamily: `"Crimson Pro", Georgia, serif`,
    backgroundColor: "#F9F8F6",
    color: "#1a1a1a",
};

const heroSectionStyle: React.CSSProperties = { position: "relative" };

const imageContainerStyle: React.CSSProperties = {
    height: "46vh",
    minHeight: 420,
    marginTop: 60,
    position: "relative",
    overflow: "hidden",
};

const bannerImageStyle: React.CSSProperties = {
    objectFit: "cover",
    objectPosition: "center 58%",
};

const heroOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
        "linear-gradient(120deg, rgba(10,30,24,0.34), rgba(90,70,25,0.18), rgba(20,18,14,0.30))",
};

const imageFadeStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "14%",
    background:
        "linear-gradient(to bottom, rgba(249,248,246,0), rgba(249,248,246,0.95))",
};

const mastheadWrapStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    padding: "26px 5vw 10px",
};

const mastheadInnerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
};

const mastheadRuleStyle: React.CSSProperties = {
    height: 1,
    width: "min(760px, 94%)",
    margin: "0 auto",
    backgroundColor: "rgba(26,26,26,0.12)",
};

const mastheadTopKickerStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.36em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.56)",
    marginTop: 18,
};

const mastheadTitleStyle: React.CSSProperties = {
    fontSize: "clamp(34px, 7.4vw, 56px)",
    fontWeight: 400,
    letterSpacing: "0.09em",
    margin: "14px 0 12px",
    color: "#0d0d0d", // black
};


const mastheadSubStyle: React.CSSProperties = {
    fontSize: 14,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.56)",
    lineHeight: 1.7,
    marginBottom: 6,
};

const mainStyle: React.CSSProperties = {
    maxWidth: 1020,
    margin: "0 auto",
    padding: "18px 5vw 110px",
    marginTop: -18,
};

const cardStyle: React.CSSProperties = {
    background:
        "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.84) 100%)",
    borderRadius: 22,
    padding: "52px min(4vw, 58px)",
    border: "1px solid rgba(26,26,26,0.10)",
    boxShadow: "0 28px 80px rgba(0,0,0,0.07)",
};

const cardHeaderStyle: React.CSSProperties = { marginBottom: 30 };

const sectionKickerStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.56)",
    marginBottom: 12,
};

const h2Style: React.CSSProperties = {
    fontSize: "clamp(30px, 5.2vw, 44px)",
    fontWeight: 400,
    margin: 0,
    letterSpacing: "-0.01em",
    color: "#0d0d0d", // black
};


const subtitleStyle: React.CSSProperties = {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 1.75,
    color: "rgba(26,26,26,0.68)",
    maxWidth: 720,
};

const successStyle: React.CSSProperties = {
    marginBottom: 18,
    padding: "16px 18px",
    borderRadius: 14,
    background: "rgba(230,245,235,0.92)",
    border: "1px solid rgba(40,120,70,0.30)",
    fontSize: 16,
    lineHeight: 1.6,
};

const errorStyle: React.CSSProperties = {
    marginBottom: 18,
    padding: "16px 18px",
    borderRadius: 14,
    background: "rgba(255,230,230,0.92)",
    border: "1px solid rgba(120,20,20,0.30)",
    fontSize: 16,
    lineHeight: 1.6,
};

const errorLinkStyle: React.CSSProperties = {
    color: "rgba(26,26,26,0.92)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(26,26,26,0.18)",
    paddingBottom: 2,
};

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 18,
};

const grid2Style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 20,
};

const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 0,
};

const labelStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.20em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.60)",
};

const inputStyle: React.CSSProperties = {
    padding: "16px 18px",
    fontSize: 17,
    borderRadius: 14,
    border: "1px solid rgba(26,26,26,0.16)",
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.92)",
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "vertical",
};

const buttonRowStyle: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
    background: "#0d0d0d",
    color: "#fff",
    padding: "16px 24px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.25)",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: 13,
    cursor: "pointer",
};

const noteStyle: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.11em",
    color: "rgba(26,26,26,0.52)",
};

const directBoxStyle: React.CSSProperties = {
    padding: "16px 18px",
    borderRadius: 14,
    border: "1px solid rgba(26,26,26,0.14)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 0,
    background: "rgba(255,255,255,0.65)",
};

const directLinkStyle: React.CSSProperties = {
    fontSize: 15,
    color: "rgba(26,26,26,0.90)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(26,26,26,0.14)",
    paddingBottom: 3,
    width: "fit-content",
    maxWidth: "100%",
    overflowWrap: "anywhere",
};
