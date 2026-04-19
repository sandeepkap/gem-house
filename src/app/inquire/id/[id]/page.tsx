// src/app/inquire/id/[id]/page.tsx
export const revalidate = 0;

import Link from "next/link";
import { client } from "@/sanity/lib/client";

type Stone = { _id: string; name: string; carat?: number; };

function buildWhatsAppLink(phoneDigitsOnly: string, stoneName: string, carat?: number) {
    const safePhone = String(phoneDigitsOnly).replace(/\D/g, "");
    const weightText = typeof carat === "number" ? ` (${carat} ct)` : "";
    const text = `Hello, I'm interested in ${stoneName}${weightText}. Please share availability, price, and certification details.`;
    return `https://wa.me/${safePhone}?text=${encodeURIComponent(text)}`;
}

async function getStoneBasicsById(idRaw: string): Promise<Stone | null> {
    const id = String(idRaw || "").trim();
    if (!id) return null;
    const draftId = id.startsWith("drafts.") ? id : `drafts.${id}`;
    const publishedId = id.startsWith("drafts.") ? id.replace(/^drafts\./, "") : id;
    return client.fetch(
        `*[_type == "stone" && (_id == $publishedId || _id == $draftId)][0]{ _id, name, carat }`,
        { publishedId, draftId }
    );
}

export default async function InquireByIdPage({
                                                  params,
                                              }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const stone = await getStoneBasicsById(decodedId);
    const stoneName = stone?.name || "this stone";
    const carat = stone?.carat;
    const whatsappHref = buildWhatsAppLink("16084212077", stoneName, carat);

    return (
        <main style={pageStyle} className="cg-inquire-main">
            <div style={cardStyle}>
                <div style={labelStyle}>Enquiry Dispatched</div>
                <h1 style={h1Style}>
                    WhatsApp has <em style={{ fontStyle: "italic" }}>opened</em><br />
                    in a new tab.
                </h1>
                <p style={ledeStyle}>
                    If it did not appear, use the button below to open the conversation for{" "}
                    <em style={{ fontStyle: "italic" }}>{stoneName}</em>.
                </p>

                <div style={{ height: 1, background: "rgba(0,0,0,0.2)", margin: "40px 0" }} />

                <div style={actionsStyle}>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={primaryStyle}>
                        Open WhatsApp
                    </a>
                    <Link href={`/stones/id/${encodeURIComponent(decodedId)}`} style={secondaryStyle}>
                        Return to Stone
                    </Link>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .cg-inquire-main { padding: 120px 24px 60px !important; }
                }
                @media (max-width: 560px) {
                    .cg-inquire-main { padding: 100px 20px 40px !important; }
                }
            `}</style>
        </main>
    );
}

/* STYLES */
const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "var(--paper, #F4F1EB)",
    color: "#000",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "140px 5vw 60px",
    fontFamily: "var(--serif)",
};
const cardStyle: React.CSSProperties = {
    maxWidth: 720, width: "100%",
    textAlign: "center",
};
const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#000",
    marginBottom: 24,
    fontWeight: 500,
};
const h1Style: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: "clamp(40px, 6vw, 88px)",
    fontWeight: 400,
    letterSpacing: "-0.025em",
    lineHeight: 0.95,
    color: "#000",
    marginBottom: 32,
};
const ledeStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 20,
    lineHeight: 1.55,
    color: "#000",
    maxWidth: 540,
    marginLeft: "auto", marginRight: "auto",
};
const actionsStyle: React.CSSProperties = {
    display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
};
const primaryStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    fontWeight: 500,
    padding: "16px 32px",
    background: "#000",
    color: "#FFF",
    textDecoration: "none",
};
const secondaryStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    fontWeight: 500,
    padding: "16px 32px",
    background: "transparent",
    color: "#000",
    border: "1px solid #000",
    textDecoration: "none",
};