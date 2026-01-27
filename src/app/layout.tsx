import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
    title: "Ceylon Gem Company. — Fine Gemstones Private Trade",
    description:
        "Fine gemstones sourced in Sri Lanka and offered internationally. Selected for color, proportion, and provenance.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            {/* Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* Google tag (gtag.js) */}
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
        </head>
        <body>{children}</body>
        </html>
    );
}
