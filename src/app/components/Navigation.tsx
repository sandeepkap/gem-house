"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
    const [scrolled, setScrolled]             = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [designOpen, setDesignOpen]         = useState(false);
    const dropdownRef                          = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const router   = useRouter();
    const isHome   = pathname === "/";

    const isDesignPage = pathname === "/configure" || pathname === "/custom-jewelry";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDesignOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    const goToSection = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        closeMobileMenu();
        if (isHome) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        router.push(`/#${id}`);
    };

    const goHomeTop = (e: React.MouseEvent) => {
        e.preventDefault();
        closeMobileMenu();
        if (isHome) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
        router.push("/");
    };

    const goTo = (path: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        closeMobileMenu();
        setDesignOpen(false);
        router.push(path);
    };

    return (
        <>
            <nav style={{
                ...navStyle,
                backgroundColor: scrolled ? "rgba(10,10,10,0.98)" : "rgba(10,10,10,0.92)",
                borderBottom: scrolled ? "1px solid rgba(250,250,250,0.08)" : "1px solid rgba(250,250,250,0.00)",
                backdropFilter: "blur(10px)",
            }}>
                <div style={navContainerStyle}>

                    {/* LEFT: Logo */}
                    <Link href="/" onClick={goHomeTop} style={logoLinkStyle}>
                        <img src="/logo.png" alt="Ceylon Gem Co." style={navLogoStyle} />
                    </Link>

                    {/* CENTER: Desktop links */}
                    <div style={navLinksStyle} className="nav-links-desktop">
                        <a href="/#collection" onClick={goToSection("collection")} style={navLinkStyle}>
                            Collection
                        </a>

                        {/* ── DESIGN DROPDOWN ── */}
                        <div ref={dropdownRef} style={{ position: "relative" }}>
                            <button
                                type="button"
                                onClick={() => setDesignOpen(v => !v)}
                                style={{
                                    ...navLinkStyle,
                                    ...designLinkStyle,
                                    background: isDesignPage || designOpen
                                        ? "rgba(250,250,250,0.12)"
                                        : "rgba(250,250,250,0.06)",
                                    borderColor: isDesignPage || designOpen
                                        ? "rgba(250,250,250,0.40)"
                                        : "rgba(250,250,250,0.20)",
                                    display: "flex", alignItems: "center", gap: 6,
                                    cursor: "pointer",
                                }}
                            >
                                Design a Piece
                                {/* Chevron */}
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transition: "transform 0.2s", transform: designOpen ? "rotate(180deg)" : "none" }}>
                                    <path d="M1 1l4 4 4-4" stroke="rgba(250,250,250,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {/* Dropdown panel */}
                            {designOpen && (
                                <div style={dropdownPanel}>
                                    <a href="/configure" onClick={goTo("/configure")} style={{
                                        ...dropdownItem,
                                        background: pathname === "/configure" ? "rgba(250,250,250,0.06)" : "transparent",
                                    }}>

                                        <div>
                                            <div style={dropdownItemTitle}>Design a Ring</div>
                                            <div style={dropdownItemDesc}>Choose a stone, pick a setting & metal</div>
                                        </div>
                                    </a>
                                    <div style={{ height: 1, background: "rgba(250,250,250,0.07)", margin: "4px 0" }} />
                                    <a href="/custom-jewelry" onClick={goTo("/custom-jewelry")} style={{
                                        ...dropdownItem,
                                        background: pathname === "/custom-jewelry" ? "rgba(250,250,250,0.06)" : "transparent",
                                    }}>

                                        <div>
                                            <div style={dropdownItemTitle}>Custom Jewellery</div>
                                            <div style={dropdownItemDesc}>Commission a fully bespoke piece</div>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>

                        <a href="/contact" onClick={goTo("/contact")} style={navLinkStyle}>
                            Contact
                        </a>
                    </div>

                    {/* RIGHT: Brand text + mobile toggle */}
                    <div style={rightSlotStyle}>
                        <Link href="/" onClick={goHomeTop} style={companyNameLinkStyle} className="company-name-link">
                            <span style={companyNameStyle} className="company-name">CEYLON GEM CO.</span>
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(v => !v)}
                            style={mobileMenuButtonStyle}
                            className="mobile-menu-button"
                            aria-label="Toggle menu"
                            type="button"
                        >
                            <span style={{ ...hamburgerLineStyle, transform: mobileMenuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
                            <span style={{ ...hamburgerLineStyle, opacity: mobileMenuOpen ? 0 : 1 }} />
                            <span style={{ ...hamburgerLineStyle, transform: mobileMenuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
                        </button>
                    </div>
                </div>

                <style>{`
                    @media (max-width: 860px) {
                        .nav-links-desktop { display: none !important; }
                        .mobile-menu-button { display: inline-flex !important; }
                        .company-name { letter-spacing: 0.22em !important; }
                        img[alt="Ceylon Gem Co."] { height: 28px; }
                    }
                `}</style>
            </nav>

            {/* ── MOBILE MENU ── */}
            {mobileMenuOpen && (
                <div style={mobileMenuOverlayStyle} onClick={closeMobileMenu}>
                    <div style={mobileMenuContentStyle} onClick={e => e.stopPropagation()}>
                        <a href="/#collection" onClick={goToSection("collection")} style={mobileMenuLinkStyle}>
                            Collection
                        </a>

                        {/* Mobile: Design sub-section */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                            <span style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(250,250,250,0.30)" }}>
                                Design a Piece
                            </span>
                            <a href="/configure" onClick={goTo("/configure")} style={mobileMenuLinkStyle}>
                                Design a Ring
                            </a>
                            <a href="/custom-jewelry" onClick={goTo("/custom-jewelry")} style={mobileMenuLinkStyle}>
                                Custom Jewellery
                            </a>
                        </div>

                        <a href="/contact" onClick={goTo("/contact")} style={mobileMenuLinkStyle}>
                            Contact
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

/* ── STYLES ── */

const F = `"Crimson Pro","Cormorant Garamond","EB Garamond",Georgia,serif`;

const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    fontFamily: F,
};
const navContainerStyle: React.CSSProperties = {
    maxWidth: 1600, margin: "0 auto", padding: "20px 5vw",
    display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
};
const logoLinkStyle: React.CSSProperties = { display: "flex", alignItems: "center" };
const navLogoStyle: React.CSSProperties = {
    height: 52, width: "auto", objectFit: "contain", opacity: 0.95,
    filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.35))",
    marginTop: -8, marginBottom: -8,
};
const navLinksStyle: React.CSSProperties = {
    display: "flex", gap: 36, alignItems: "center", justifyContent: "center",
};
const navLinkStyle: React.CSSProperties = {
    fontSize: 14, letterSpacing: "0.02em",
    color: "rgba(250,250,250,0.75)", textDecoration: "none", fontWeight: 300,
    background: "none", border: "none", fontFamily: F, padding: 0,
};
const designLinkStyle: React.CSSProperties = {
    padding: "7px 14px 7px 16px",
    border: "1px solid",
    borderRadius: 2,
    letterSpacing: "0.06em",
    fontSize: 12,
    textTransform: "uppercase" as const,
    color: "rgba(250,250,250,0.90)",
    transition: "background 0.2s ease, border-color 0.2s ease",
    fontWeight: 400,
};

/* Dropdown */
const dropdownPanel: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 12px)", left: "50%",
    transform: "translateX(-50%)",
    width: 300,
    background: "rgba(14,14,14,0.99)",
    border: "1px solid rgba(250,250,250,0.10)",
    backdropFilter: "blur(16px)",
    padding: "6px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.70)",
    zIndex: 200,
};
const dropdownItem: React.CSSProperties = {
    display: "block",
    padding: "18px 22px",
    textDecoration: "none",
    transition: "background 0.15s ease",
    cursor: "pointer",
};
const dropdownItemIcon: React.CSSProperties = { display: "none" };
const dropdownItemTitle: React.CSSProperties = {
    fontSize: 20, color: "rgba(250,250,250,0.95)", fontWeight: 600,
    fontFamily: F, letterSpacing: "-0.01em", lineHeight: 1.2,
};
const dropdownItemDesc: React.CSSProperties = {
    fontSize: 12, color: "rgba(250,250,250,0.38)", fontWeight: 300,
    lineHeight: 1.5, marginTop: 4, fontFamily: F,
};

/* Right slot */
const rightSlotStyle: React.CSSProperties = {
    display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 18,
};
const companyNameLinkStyle: React.CSSProperties = { textDecoration: "none" };
const companyNameStyle: React.CSSProperties = {
    fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase",
    color: "rgba(250,250,250,0.85)", whiteSpace: "nowrap",
};

/* Mobile */
const mobileMenuButtonStyle: React.CSSProperties = {
    display: "none", flexDirection: "column", gap: 6,
    background: "none", border: "none", cursor: "pointer", padding: 8,
};
const hamburgerLineStyle: React.CSSProperties = {
    width: 24, height: 2, backgroundColor: "#fafafa", transition: "all 0.3s ease",
};
const mobileMenuOverlayStyle: React.CSSProperties = {
    position: "fixed", inset: 0,
    backgroundColor: "rgba(10,10,10,0.97)", backdropFilter: "blur(10px)",
    zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
};
const mobileMenuContentStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 40, alignItems: "center",
};
const mobileMenuLinkStyle: React.CSSProperties = {
    fontSize: 28, color: "#fafafa", textDecoration: "none", fontWeight: 300, fontFamily: F,
};