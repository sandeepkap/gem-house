import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import Script from "next/script";
import Navigation from "@/app/components/Navigation";
import "./globals.css";

const geist = Geist({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--geist-font",
    display: "swap",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--geist-mono-font",
    display: "swap",
});

const pinyonScript = Pinyon_Script({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--pinyon-font",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Ceylon Gem Company — Fine Gemstones, Offered Privately",
    description:
        "A private house of fine gemstones. Sapphires, rubies, spinels, and padparadschas — sourced in Sri Lanka, offered internationally by appointment.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${geist.variable} ${geistMono.variable} ${pinyonScript.variable}`}>
        <head>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=AW-17868873914"
                strategy="afterInteractive"
            />
            <Script id="google-tag" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'AW-17868873914');
                `}
            </Script>
            <style>{`
                :root {
                    --sans: var(--geist-font), "Inter", "Helvetica Neue", Arial, sans-serif;
                    --mono: var(--geist-mono-font), ui-monospace, monospace;
                    --script: var(--pinyon-font), "Snell Roundhand", "Apple Chancery", cursive;
                }
            `}</style>
        </head>
        <body>
        <Navigation />
        {children}
        </body>
        </html>
    );
}