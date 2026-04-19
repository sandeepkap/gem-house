// src/app/components/Navigation.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Always-black navigation bar with white text.
 * Fixed to top of page, spans full width.
 * Left: logo image. Right: Inventory / Commissions / Contact.
 */
export default function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!menuOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [menuOpen]);

    const go = (p: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(false);
        router.push(p);
    };

    return (
        <>
            <nav style={navStyle}>
                <div style={rowStyle}>
                    {/* LEFT: Logo */}
                    <Link href="/" style={logoLinkStyle} aria-label="Ceylon Gem Company — Home">
                        <Image
                            src="/logo.png"
                            alt="Ceylon Gem Company"
                            width={180}
                            height={48}
                            priority
                            style={logoImgStyle}
                        />
                    </Link>

                    {/* RIGHT: Links (desktop) */}
                    <div style={linksStyle} className="nav-links-desktop">
                        <a href="/stones" onClick={go("/stones")} style={linkStyle}>
                            Inventory
                        </a>
                        <a href="/custom-jewelry" onClick={go("/custom-jewelry")} style={linkStyle}>
                            Commissions
                        </a>
                        <a href="/contact" onClick={go("/contact")} style={linkStyle}>
                            Contact
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        style={mobileBtnStyle}
                        className="nav-mobile-btn"
                        aria-label="Menu"
                        type="button"
                    >
                        <span style={mobileBtnLabelStyle}>
                            {menuOpen ? "Close" : "Menu"}
                        </span>
                    </button>
                </div>
            </nav>

            <style>{`
                @media (max-width: 840px) {
                    .nav-links-desktop { display: none !important; }
                    .nav-mobile-btn { display: inline-flex !important; }
                }
                @media (max-width: 560px) {
                    .nav-logo-link { height: 40px !important; }
                }
            `}</style>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div style={mobileMenuStyle} onClick={() => setMenuOpen(false)}>
                    <div style={mobileMenuInnerStyle} onClick={e => e.stopPropagation()}>
                        <a href="/stones" onClick={go("/stones")} style={mobileLinkStyle}>Inventory</a>
                        <a href="/custom-jewelry" onClick={go("/custom-jewelry")} style={mobileLinkStyle}>Commissions</a>
                        <a href="/contact" onClick={go("/contact")} style={mobileLinkStyle}>Contact</a>
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════════════════ STYLES ═══════════════════ */

const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    background: "#000000",
    color: "#FFFFFF",
    fontFamily: "var(--sans)",
    height: 64,
    display: "flex",
    alignItems: "center",
};

const rowStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 1600,
    margin: "0 auto",
    padding: "0 5vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
};

const logoLinkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    height: 48,
};

const logoImgStyle: React.CSSProperties = {
    width: "auto",
    height: "100%",
    objectFit: "contain",
    display: "block",
};

const linksStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 36,
};

const linkStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "#FFFFFF",
    textDecoration: "none",
    transition: "opacity 0.2s ease",
};

const mobileBtnStyle: React.CSSProperties = {
    display: "none",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 8,
    alignItems: "center",
};

const mobileBtnLabelStyle: React.CSSProperties = {
    color: "#FFFFFF",
    fontSize: 11,
    letterSpacing: "0.22em",
    fontFamily: "var(--sans)",
    textTransform: "uppercase",
    fontWeight: 500,
};

const mobileMenuStyle: React.CSSProperties = {
    position: "fixed",
    top: 64,
    left: 0, right: 0, bottom: 0,
    background: "#000000",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const mobileMenuInnerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 36,
    alignItems: "center",
};

const mobileLinkStyle: React.CSSProperties = {
    fontFamily: "var(--serif)",
    fontSize: 36,
    letterSpacing: "-0.01em",
    color: "#FFFFFF",
    textDecoration: "none",
    fontWeight: 400,
};