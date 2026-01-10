"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/app/components/Reveal";
import ImageLightbox from "@/app/components/ImageLightbox";

export default function StoneGallery({
                                         stoneName,
                                         imageUrls,
                                     }: {
    stoneName: string;
    imageUrls: string[];
}) {
    const [active, setActive] = useState<string | null>(null);

    if (!imageUrls || imageUrls.length === 0) {
        return <div style={{ color: "rgba(250, 250, 250, 0.55)" }}>No images available.</div>;
    }

    return (
        <>
            <div style={galleryGridStyle}>
                {imageUrls.map((src, idx) => (
                    <Reveal key={`${src}-${idx}`} delayMs={100 + idx * 80}>
                        <button
                            type="button"
                            onClick={() => setActive(src)}
                            style={imageButtonStyle}
                            aria-label={`Open image ${idx + 1} in full view`}
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
                    </Reveal>
                ))}
            </div>

            {active && <ImageLightbox src={active} alt={stoneName} onClose={() => setActive(null)} />}
        </>
    );
}

const galleryGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 24,
};

const imageButtonStyle: React.CSSProperties = {
    padding: 0,
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "zoom-in",
};

const imageFrameStyle: React.CSSProperties = {
    border: "1px solid rgba(250, 250, 250, 0.12)",
    background: "rgba(250, 250, 250, 0.02)",
    aspectRatio: "1 / 1",
    overflow: "hidden",
};

const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
};
