// src/app/inquire/id/[id]/page.tsx
export const revalidate = 0;

import Link from "next/link";
import { client } from "@/sanity/lib/client";

type Stone = {
    _id: string;
    name: string;
    carat?: number;
};

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

    // Keep your WhatsApp number here
    const whatsappHref = buildWhatsAppLink("16084212077", stoneName, carat);

    return (
        <main style={pageStyle}>
            <div style={cardStyle}>
                <div style={kickerStyle}>Inquiry</div>

                <h1 style={h1Style}>WhatsApp opened in a new tab</h1>

                <p style={ledeStyle}>
                    If you don’t see WhatsApp, use the button below to open it again for{" "}
                    <span style={{ color: "#fafafa" }}>{stoneName}</span>.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={ctaStyle}>
                        Open WhatsApp now →
                    </a>

                    <Link href={`/stones/id/${encodeURIComponent(decodedId)}`} style={secondaryStyle}>
                        Back to stone
                    </Link>
                </div>

            </div>
        </main>
    );
}

/* ------------------ STYLES ------------------ */

const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5vw",
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
    textAlign: "center",
};

const cardStyle: React.CSSProperties = {
    maxWidth: 560,
    width: "100%",
    padding: "56px 28px",
};

const kickerStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "rgba(250,250,250,0.48)",
    marginBottom: 16,
};

const h1Style: React.CSSProperties = {
    fontSize: "clamp(22px, 2.4vw, 34px)",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
    marginBottom: 16,
};

const ledeStyle: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(250,250,250,0.6)",
    fontWeight: 300,
    marginBottom: 28,
};

const ctaStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    letterSpacing: "0.02em",
    color: "#fafafa",
    textDecoration: "none",
    padding: "16px 24px",
    border: "1px solid rgba(250, 250, 250, 0.16)",
    background: "rgba(250, 250, 250, 0.03)",
};

const secondaryStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    letterSpacing: "0.02em",
    color: "rgba(250, 250, 250, 0.75)",
    textDecoration: "none",
    padding: "16px 24px",
    border: "1px solid rgba(250, 250, 250, 0.10)",
    background: "transparent",
};

const noteStyle: React.CSSProperties = {
    marginTop: 18,
    fontSize: 11,
    color: "rgba(250,250,250,0.42)",
    letterSpacing: "0.01em",
};
