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
    const v = sp.v;
    const validationFailed = failed && v === "1";
    const sendFailed = failed && v === "2";

    return (
        <div style={pageStyle} className="cg-contact-page">
            <div style={mastheadStyle}>
                <div style={mastheadMetaStyle}>
                    <div>
                        <div style={labelStyle}>Section</div>
                        <div style={valueStyle}>Correspondence</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Response</div>
                        <div style={valueStyle}>Within 24 hours</div>
                    </div>
                </div>

                <h1 style={h1Style}>
                    To make enquiry,<br />
                    or arrange a <em style={{ fontStyle: "italic" }}>viewing.</em>
                </h1>

                <p style={ledeStyle}>
                    The house is shown by prior arrangement — at our offices in Colombo and Madison, or by private video viewing. For availability, certification, or commissions, write below.
                </p>

                <div style={{ height: 1, background: "#000", margin: "40px 0 0" }} />
            </div>

            <main style={mainStyle}>

                {sent && <div style={successBoxStyle}>Your enquiry has been sent. We'll be in touch shortly.</div>}
                {validationFailed && <div style={errorBoxStyle}>Please complete the required fields and try again.</div>}
                {sendFailed && (
                    <div style={errorBoxStyle}>
                        We couldn't send your enquiry. Please email directly at{" "}
                        <a href="mailto:ceylongemcompany.inquiries@gmail.com" style={{ color: "#000", borderBottom: "1px solid #000" }}>
                            ceylongemcompany.inquiries@gmail.com
                        </a>.
                    </div>
                )}

                <ContactFormClient
                    action={submitContact}
                    styles={{
                        form: formStyle,
                        grid2: grid2Style,
                        field: fieldStyle,
                        label: labelStyleForm,
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

                <style>{`
                    @media (max-width: 860px) {
                        .cg-grid2 { grid-template-columns: 1fr !important; }
                    }
                    @media (max-width: 768px) {
                        .cg-contact-page { padding: 100px 24px 80px !important; }
                    }
                    @media (max-width: 560px) {
                        .cg-contact-page { padding: 90px 20px 60px !important; }
                    }
                `}</style>
            </main>
        </div>
    );
}

/* STYLES */
const pageStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    backgroundColor: "var(--paper, #F4F1EB)",
    color: "#000",
    minHeight: "100vh",
    padding: "140px 5vw 120px",
};
const mastheadStyle: React.CSSProperties = {
    maxWidth: 1000, margin: "0 auto 60px",
};
const mastheadMetaStyle: React.CSSProperties = {
    display: "flex",
    gap: 60,
    paddingBottom: 20,
    borderBottom: "1px solid rgba(0,0,0,0.15)",
    marginBottom: 40,
};
const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 6,
    fontWeight: 500,
};
const valueStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 18,
    color: "#000",
};
const h1Style: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(48px, 7vw, 104px)",
    fontWeight: 400,
    lineHeight: 0.95,
    letterSpacing: "-0.025em",
    color: "#000",
    marginBottom: 32,
};
const ledeStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 20,
    lineHeight: 1.55,
    color: "#000",
    maxWidth: 640,
};
const mainStyle: React.CSSProperties = {
    maxWidth: 1000,
    margin: "0 auto",
    paddingTop: 40,
};
const successBoxStyle: React.CSSProperties = {
    marginBottom: 32,
    padding: "18px 22px",
    fontFamily: "var(--serif)",
    fontSize: 16,
    color: "#000",
    background: "transparent",
    borderLeft: "2px solid #000",
};
const errorBoxStyle: React.CSSProperties = {
    marginBottom: 32,
    padding: "18px 22px",
    fontFamily: "var(--serif)",
    fontSize: 16,
    color: "#000",
    borderLeft: "2px solid rgba(120,20,20,0.8)",
    background: "rgba(120,20,20,0.04)",
};
const formStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 36,
};
const grid2Style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 36,
};
const fieldStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
};
const labelStyleForm: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    fontWeight: 500,
};
const inputStyle: React.CSSProperties = {
    padding: "12px 0",
    fontFamily: "var(--serif)",
    fontSize: 18,
    color: "#000",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(0,0,0,0.25)",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "vertical",
    minHeight: 140,
    borderBottom: "none",
    border: "1px solid rgba(0,0,0,0.2)",
    padding: "14px 16px",
};
const buttonRowStyle: React.CSSProperties = {
    marginTop: 24,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    gap: 24, flexWrap: "wrap",
    paddingTop: 28,
    borderTop: "1px solid #000",
};
const buttonStyle: React.CSSProperties = {
    background: "#000",
    color: "#FFF",
    padding: "18px 44px",
    border: "none",
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    fontWeight: 500,
    cursor: "pointer",
};
const noteStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "#000",
    opacity: 0.7,
};
const directBoxStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 10,
    paddingTop: 12,
};
const directLinkStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 17,
    color: "#000",
    textDecoration: "none",
    borderBottom: "1px solid rgba(0,0,0,0.25)",
    paddingBottom: 3,
    width: "fit-content",
    maxWidth: "100%",
    overflowWrap: "anywhere",
};