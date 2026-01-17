"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    const goToSection = (id: string) => async (e: React.MouseEvent) => {
        e.preventDefault();
        closeMobileMenu();

        // If we're already on home, smooth scroll.
        if (pathname === "/") {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        // If we're on another route, navigate to home with hash.
        // Browser will jump to the section automatically.
        router.push(`/#${id}`);
    };

    const goHomeTop = (e: React.MouseEvent) => {
        e.preventDefault();
        closeMobileMenu();

        if (pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        router.push("/");
    };

    return (
        <>
            <nav
                style={{
                    ...navStyle,
                    backgroundColor: scrolled ? "rgba(10,10,10,0.98)" : "rgba(10,10,10,0.92)",
                    borderBottom: scrolled
                        ? "1px solid rgba(250,250,250,0.08)"
                        : "1px solid rgba(250,250,250,0.00)",
                    backdropFilter: "blur(10px)",
                }}
            >
                <div style={navContainerStyle}>
                    {/* Left spacer (keeps center column mathematically centered) */}
                    <div style={leftSpacerStyle} aria-hidden />

                    {/* Center links (desktop) */}
                    <div style={navLinksStyle} className="nav-links-desktop">
                        <a href="/#collection" onClick={goToSection("collection")} style={navLinkStyle}>
                            Collection
                        </a>
                        <a href="/#contact" onClick={goToSection("contact")} style={navLinkStyle}>
                            Contact
                        </a>
                    </div>

                    {/* Right side */}
                    <div style={rightSlotStyle}>
                        <Link
                            href="/"
                            onClick={goHomeTop}
                            style={companyNameLinkStyle}
                            className="company-name-link"
                        >
              <span style={companyNameStyle} className="company-name">
                CEYLON GEM CO.
              </span>
                        </Link>

                        {/* Mobile menu button (only visible on small screens via CSS below) */}
                        <button
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            style={mobileMenuButtonStyle}
                            className="mobile-menu-button"
                            aria-label="Toggle menu"
                            type="button"
                        >
              <span
                  style={{
                      ...hamburgerLineStyle,
                      transform: mobileMenuOpen ? "rotate(45deg) translateY(8px)" : "none",
                  }}
              />
                            <span style={{ ...hamburgerLineStyle, opacity: mobileMenuOpen ? 0 : 1 }} />
                            <span
                                style={{
                                    ...hamburgerLineStyle,
                                    transform: mobileMenuOpen ? "rotate(-45deg) translateY(-8px)" : "none",
                                }}
                            />
                        </button>
                    </div>
                </div>

                {/* Minimal CSS for responsive behavior */}
                <style>{`
          @media (max-width: 860px) {
            .nav-links-desktop { display: none !important; }
            .mobile-menu-button { display: inline-flex !important; }
            .company-name { letter-spacing: 0.22em !important; }
          }
        `}</style>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div style={mobileMenuOverlayStyle} onClick={closeMobileMenu}>
                    <div style={mobileMenuContentStyle} onClick={(e) => e.stopPropagation()}>
                        <a href="/#collection" onClick={goToSection("collection")} style={mobileMenuLinkStyle}>
                            Collection
                        </a>
                        <a href="/#contact" onClick={goToSection("contact")} style={mobileMenuLinkStyle}>
                            Contact
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

/* ------------------ STYLES ------------------ */

const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    fontFamily: `"Crimson Pro", "Cormorant Garamond", "EB Garamond", Georgia, serif`,
};

const navContainerStyle: React.CSSProperties = {
    maxWidth: 1600,
    margin: "0 auto",
    padding: "20px 5vw",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 0,
};

const leftSpacerStyle: React.CSSProperties = {
    minHeight: 1,
};

const navLinksStyle: React.CSSProperties = {
    display: "flex",
    gap: 48,
    alignItems: "center",
    justifyContent: "center",
};

const navLinkStyle: React.CSSProperties = {
    fontSize: 14,
    letterSpacing: "0.02em",
    color: "rgba(250, 250, 250, 0.75)",
    textDecoration: "none",
    transition: "color 0.3s ease",
    cursor: "pointer",
    fontWeight: 300,
};

const rightSlotStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 18,
};

const companyNameLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
};

const companyNameStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    fontWeight: 400,
    color: "rgba(250, 250, 250, 0.85)",
    transition: "color 0.3s ease",
    whiteSpace: "nowrap",
};

const mobileMenuButtonStyle: React.CSSProperties = {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 6,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
};

const hamburgerLineStyle: React.CSSProperties = {
    width: 24,
    height: 2,
    backgroundColor: "#fafafa",
    transition: "all 0.3s ease",
};

const mobileMenuOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 10, 10, 0.97)",
    backdropFilter: "blur(10px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const mobileMenuContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 40,
    alignItems: "center",
    padding: 40,
};

const mobileMenuLinkStyle: React.CSSProperties = {
    fontSize: 28,
    letterSpacing: "-0.01em",
    color: "#fafafa",
    textDecoration: "none",
    fontWeight: 300,
    transition: "opacity 0.3s ease",
};
