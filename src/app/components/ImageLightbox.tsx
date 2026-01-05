"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function ImageLightbox({
                                          src,
                                          alt,
                                          onClose,
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
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
            <button type="button" style={closeStyle} onClick={onClose} aria-label="Close">
                ×
            </button>

            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <Image src={src} alt={alt} width={2400} height={2400} style={imgStyle} />
            </div>
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(10,10,10,0.92)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 5vw",
};

const contentStyle: React.CSSProperties = {
    maxWidth: 1200,
    width: "100%",
    maxHeight: "85vh",
    border: "1px solid rgba(250,250,250,0.12)",
    background: "rgba(0,0,0,0.35)",
    overflow: "auto",
};

const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "contain",
};

const closeStyle: React.CSSProperties = {
    position: "fixed",
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "1px solid rgba(250,250,250,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    fontSize: 26,
    lineHeight: "40px",
    cursor: "pointer",
};
