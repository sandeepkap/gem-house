import Image from "next/image";
import Navigation from "@/app/components/Navigation";
import ContactFormClient from "./ContactFormClient";
import { submitContact } from "./actions";

export default async function ContactPage({
                                              searchParams,
                                          }: {
    searchParams?: Promise<{ sent?: string }>;
}) {
    const sp = (await searchParams) ?? {};
    const sent = sp.sent === "1";
    const failed = sp.sent === "0";

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

            {/* FORM (client component handles animation + submit) */}
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

                    {failed && (
                        <div style={errorStyle}>
                            Please complete the required fields and try again.
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
    objectPosition: "center 60%",
};

const heroOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
        "linear-gradient(120deg, rgba(10,30,24,0.35), rgba(90,70,25,0.20), rgba(20,18,14,0.30))",
};

const imageFadeStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "22%",
    background:
        "linear-gradient(to bottom, rgba(249,248,246,0), rgba(249,248,246,0.95))",
};

const mastheadWrapStyle: React.CSSProperties = {
    backgroundColor: "#F9F8F6",
    padding: "46px 5vw 22px",
};

const mastheadInnerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
};

const mastheadRuleStyle: React.CSSProperties = {
    height: 1,
    width: "min(720px, 92%)",
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
    fontSize: "clamp(32px, 8vw, 54px)",
    fontWeight: 400,
    letterSpacing: "0.08em",
    margin: "16px 0 12px",
};

const mastheadSubStyle: React.CSSProperties = {
    fontSize: 13,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.55)",
    lineHeight: 1.7,
};

const mainStyle: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "56px 5vw 120px",
};

const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: "46px min(4vw, 54px)",
    border: "1px solid rgba(26,26,26,0.1)",
    boxShadow: "0 28px 80px rgba(0,0,0,0.07)",
};

const cardHeaderStyle: React.CSSProperties = { marginBottom: 28 };

const sectionKickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.55)",
    marginBottom: 12,
};

const h2Style: React.CSSProperties = {
    fontSize: "clamp(26px, 6vw, 40px)",
    fontWeight: 400,
    margin: 0,
};

const subtitleStyle: React.CSSProperties = {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 1.7,
    color: "rgba(26,26,26,0.65)",
};

const successStyle: React.CSSProperties = {
    marginBottom: 18,
    padding: "14px 16px",
    borderRadius: 12,
    background: "rgba(230,245,235,0.9)",
    border: "1px solid rgba(40,120,70,0.3)",
};

const errorStyle: React.CSSProperties = {
    marginBottom: 18,
    padding: "14px 16px",
    borderRadius: 12,
    background: "rgba(255,230,230,0.9)",
    border: "1px solid rgba(120,20,20,0.3)",
};

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 18,
};

const grid2Style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
};

const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 0,
};

const labelStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(26,26,26,0.58)",
};

const inputStyle: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid rgba(26,26,26,0.16)",
    width: "100%",
    boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "vertical",
};

const buttonRowStyle: React.CSSProperties = {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
    background: "#0d0d0d",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.25)",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: 12,
    cursor: "pointer",
};

const noteStyle: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(26,26,26,0.5)",
};

const directBoxStyle: React.CSSProperties = {
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid rgba(26,26,26,0.14)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 0,
};

const directLinkStyle: React.CSSProperties = {
    fontSize: 14,
    color: "rgba(26,26,26,0.88)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(26,26,26,0.14)",
    paddingBottom: 3,
    width: "fit-content",
    maxWidth: "100%",
    overflowWrap: "anywhere",
};
