// src/app/components/ImageLightbox.tsx
"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function ImageLightbox({
                                          src, alt, onClose,
                                      }: {
    src: string;
    alt: string;
    onClose: () => void;
}) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
            <button type="button" style={closeStyle} onClick={onClose} aria-label="Close">Close ✕</button>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <Image src={src} alt={alt} width={2400} height={2400} style={imgStyle} />
            </div>
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    zIndex: 2000,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 5vw",
};
const contentStyle: React.CSSProperties = {
    maxWidth: 1400, width: "100%", maxHeight: "90vh",
    overflow: "auto",
};
const imgStyle: React.CSSProperties = {
    width: "100%", height: "auto", display: "block", objectFit: "contain",
};
const closeStyle: React.CSSProperties = {
    position: "fixed",
    top: 24, right: 24,
    background: "transparent",
    color: "#FFFFFF",
    fontFamily: "var(--sans, 'Inter', sans-serif)",
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 16px",
    cursor: "pointer",
};