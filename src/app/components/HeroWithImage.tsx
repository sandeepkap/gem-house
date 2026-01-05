"use client";

import React from "react";
import Reveal from "./Reveal";

interface HeroWithImageProps {
    imageSrc: string;
}

const HeroWithImage: React.FC<HeroWithImageProps> = ({ imageSrc }) => {
    return (
        <section style={heroSectionStyle}>
            <div style={heroImageContainerStyle}>
                <img
                    src={imageSrc}
                    alt="Ranasinghe & Co. Background"
                    style={heroImageStyle}
                />
                {/* Deep linear fade ensures smooth transition into the collection section */}
                <div style={heroFadeOverlayStyle} />
            </div>

            <div style={heroContentStyle}>
                <Reveal delayMs={0}>
                    <div style={brandStyle}>RANASINGHE & CO.</div>
                </Reveal>
                <Reveal delayMs={150}>
                    <h1 style={h1Style}>
                        Fine Gemstones
                        <br />
                        Private Trade
                    </h1>
                </Reveal>
                <Reveal delayMs={300}>
                    <p style={ledeStyle}>
                        An understated collection of fine gemstones. Sapphires, rubies,
                        and emeralds selected for color, proportion, and provenance.
                        Offered by appointment.
                    </p>
                </Reveal>
            </div>

            <div style={scrollIndicatorStyle}>
                <div style={scrollTextStyle}>The Collection</div>
                <div style={scrollLineStyle} />
            </div>
        </section>
    );
};

/* ------------------ STYLES ------------------ */

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
    position: "absolute",
    inset: 0,
    zIndex: 0,
};

const heroImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    opacity: 0.9,
};

const heroFadeOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    // This fade creates a seamless bleed from the image into the next section's background
    background: "linear-gradient(to bottom, rgba(249, 248, 246, 0) 0%, rgba(249, 248, 246, 0.4) 60%, rgba(249, 248, 246, 1) 100%)",
};

const heroContentStyle: React.CSSProperties = {
    maxWidth: 800,
    textAlign: "center",
    position: "relative",
    zIndex: 2,
};

const brandStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.5em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "#1a1a1a",
    marginBottom: 40,
};

const h1Style: React.CSSProperties = {
    fontSize: "clamp(48px, 7vw, 82px)",
    lineHeight: 1.05,
    fontWeight: 400,
    letterSpacing: "-0.02em",
    marginBottom: 32,
    color: "#000000",
};

const ledeStyle: React.CSSProperties = {
    fontSize: "clamp(17px, 2vw, 19px)",
    lineHeight: 1.8,
    color: "#444444",
    fontWeight: 300,
    maxWidth: 600,
    margin: "0 auto",
};

const scrollIndicatorStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    zIndex: 2,
};

const scrollLineStyle: React.CSSProperties = {
    width: 1,
    height: 50,
    backgroundColor: "#1a1a1a",
    opacity: 0.3,
};

const scrollTextStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#1a1a1a",
    opacity: 0.6,
};

export default HeroWithImage;