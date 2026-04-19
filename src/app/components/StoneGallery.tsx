// src/app/components/StoneGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/app/components/Reveal";
import ImageLightbox from "@/app/components/ImageLightbox";

export default function StoneGallery({
                                         stoneName, imageUrls,
                                     }: {
    stoneName: string;
    imageUrls: string[];
}) {
    const [active, setActive] = useState<string | null>(null);

    if (!imageUrls || imageUrls.length === 0) {
        return <div style={{ color: "rgba(0,0,0,0.5)", fontStyle: "italic" }}>No images available.</div>;
    }

    return (
        <>
            <div className="stone-gallery-grid">
                {imageUrls.map((src, idx) => (
                    <Reveal key={`${src}-${idx}`} delayMs={80 + idx * 60}>
                        <figure style={figureStyle}>
                            <div style={metaRowStyle}>
                                <span style={metaNumStyle}>Fig. {String(idx + 1).padStart(2, "0")}</span>
                                <span style={metaLabelStyle}>
                                    {idx === 0 ? "Crown view" : idx === 1 ? "Pavilion view" : idx === 2 ? "Profile" : "Study"}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActive(src)}
                                style={buttonStyle}
                                aria-label={`Open image ${idx + 1}`}
                            >
                                <div style={imageFrameStyle}>
                                    <Image
                                        src={src}
                                        alt={`${stoneName} view ${idx + 1}`}
                                        width={1200}
                                        height={1200}
                                        sizes="(max-width: 960px) 100vw, 50vw"
                                        style={imageStyle}
                                    />
                                </div>
                            </button>
                        </figure>
                    </Reveal>
                ))}
            </div>

            {active && <ImageLightbox src={active} alt={stoneName} onClose={() => setActive(null)} />}
        </>
    );
}

const figureStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
};
const metaRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingBottom: 8,
    borderBottom: "1px solid rgba(0,0,0,0.2)",
};
const metaNumStyle: React.CSSProperties = {
    fontFamily: "var(--sans, Inter, sans-serif)",
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#000",
    fontWeight: 500,
    fontVariantNumeric: "tabular-nums",
};
const metaLabelStyle: React.CSSProperties = {
    fontFamily: "var(--serif, Times, serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "#000",
    opacity: 0.75,
};
const buttonStyle: React.CSSProperties = {
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "zoom-in",
    width: "100%",
};
const imageFrameStyle: React.CSSProperties = {
    background: "#E8E2D4",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    width: "100%",
};
const imageStyle: React.CSSProperties = {
    width: "100%", height: "100%",
    objectFit: "cover",
    display: "block",
};