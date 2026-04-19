"use client";

import React, { useState, useEffect } from "react";
import Reveal from "./Reveal";

/**
 * Kept for backwards compatibility. This component is not used by the new homepage,
 * but may still be referenced elsewhere. Styling has been updated to match the new
 * cream theme and the previous hardcoded "RANASINGHE & CO." brand text has been
 * replaced with "CEYLON GEM CO.".
 */
interface HeroWithImageProps {
    imageSrc: string;
}

const HeroWithImage: React.FC<HeroWithImageProps> = ({ imageSrc }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        img.src = imageSrc;
        img.onload = () => setIsLoaded(true);
    }, [imageSrc]);

    return (
        <section style={heroSectionStyle}>
            <div style={heroImageContainerStyle}>
                <img
                    src={imageSrc}
                    alt="Ceylon Gem Co."
                    style={{
                        ...heroImageStyle,
                        opacity: isLoaded ? 0.9 : 0,
                        transform: isLoaded ? "scale(1)" : "scale(1.03)",
                    }}
                />
                <div style={heroFadeOverlayStyle} />
            </div>

            <div style={heroContentStyle}>
                <Reveal delayMs={400}>
                    <div style={brandStyle}>CEYLON GEM CO.</div>
                </Reveal>
                <Reveal delayMs={550}>
                    <h1 style={h1Style}>
                        Fine Gemstones
                        <br />Private Trade
                    </h1>
                </Reveal>
                <Reveal delayMs={700}>
                    <p style={ledeStyle}>
                        An understated collection of fine gemstones. Sapphires, rubies,
                        and emeralds selected for colour, proportion, and provenance.
                        Offered exclusively by appointment.
                    </p>
                </Reveal>
            </div>
        </section>
    );
};

const heroSectionStyle: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5vw",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#F9F8F6",
};
const heroImageContainerStyle: React.CSSProperties = {
    position: "absolute", inset: 0, zIndex: 0,
    backgroundColor: "#F9F8F6",
};
const heroImageStyle: React.CSSProperties = {
    width: "100%", height: "100%",
    objectFit: "cover", objectPosition: "center",
    transition: "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 2s cubic-bezier(0.2, 0, 0.2, 1)",
};
const heroFadeOverlayStyle: React.CSSProperties = {
    position: "absolute", inset: 0,
    background: "linear-gradient(to bottom, rgba(249,248,246,0) 0%, rgba(249,248,246,0.3) 50%, rgba(249,248,246,1) 100%)",
};
const heroContentStyle: React.CSSProperties = {
    maxWidth: 800, textAlign: "center", position: "relative", zIndex: 2,
};
const brandStyle: React.CSSProperties = {
    fontSize: 11, letterSpacing: "0.5em", textTransform: "uppercase",
    fontWeight: 400, color: "#1A1816", marginBottom: 40,
    fontFamily: `"Inter", sans-serif`,
};
const h1Style: React.CSSProperties = {
    fontSize: "clamp(48px, 7vw, 82px)",
    lineHeight: 1.05, fontWeight: 300,
    letterSpacing: "-0.02em", marginBottom: 32,
    color: "#000000",
};
const ledeStyle: React.CSSProperties = {
    fontSize: "clamp(17px, 2vw, 19px)",
    lineHeight: 1.8, color: "rgba(26,24,22,0.62)",
    fontWeight: 400, maxWidth: 600, margin: "0 auto",
};

export default HeroWithImage;