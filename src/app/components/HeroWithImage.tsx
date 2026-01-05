"use client";

import React, { useState, useEffect } from "react";
import Reveal from "./Reveal";

interface HeroWithImageProps {
    imageSrc: string;
}

const HeroWithImage: React.FC<HeroWithImageProps> = ({ imageSrc }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Preload the image to ensure the fade is perfectly timed
    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => setIsLoaded(true);
    }, [imageSrc]);

    return (
        <section style={heroSectionStyle}>
            {/* BACKGROUND LAYER */}
            <div style={heroImageContainerStyle}>
                {/* The Actual Image */}
                <img
                    src={imageSrc}
                    alt="Ranasinghe & Co. Background"
                    style={{
                        ...heroImageStyle,
                        opacity: isLoaded ? 0.9 : 0, // Fades in from 0
                        transform: isLoaded ? "scale(1)" : "scale(1.03)", // Subtle "settling" effect
                    }}
                />

                {/* Persistent Gradient Overlay - This handles the bleed into the next section */}
                <div style={heroFadeOverlayStyle} />
            </div>

            {/* CONTENT LAYER */}
            <div style={heroContentStyle}>
                <Reveal delayMs={400}>
                    <div style={brandStyle}>RANASINGHE & CO.</div>
                </Reveal>
                <Reveal delayMs={550}>
                    <h1 style={h1Style}>
                        Fine Gemstones
                        <br />
                        Private Trade
                    </h1>
                </Reveal>
                <Reveal delayMs={700}>
                    <p style={ledeStyle}>
                        An understated collection of fine gemstones. Sapphires, rubies,
                        and emeralds selected for color, proportion, and provenance.
                        Offered exclusively by appointment.
                    </p>
                </Reveal>
            </div>

            {/* SCROLL INDICATOR */}
            <div style={{
                ...scrollIndicatorStyle,
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 2s ease 1s" // Waits for image before showing
            }}>
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
    backgroundColor: "#F9F8F6", // High-end 'Paper/Parchment' color
};

const heroImageContainerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    backgroundColor: "#F9F8F6",
};

const heroImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transition: "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 2s cubic-bezier(0.2, 0, 0.2, 1)",
    willChange: "opacity, transform",
};

const heroFadeOverlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    // This creates the seamless transition into the #F9F8F6 background of the next section
    background: "linear-gradient(to bottom, rgba(249, 248, 246, 0) 0%, rgba(249, 248, 246, 0.3) 50%, rgba(249, 248, 246, 1) 100%)",
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
    opacity: 0.2,
};

const scrollTextStyle: React.CSSProperties = {
    fontSize: 9,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#1a1a1a",
    opacity: 0.5,
};

export default HeroWithImage;