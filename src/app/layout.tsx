import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Ranasinghe & Co. — Fine Gemstones Private Trade",
    description: "An understated collection of fine gemstones. Sapphires, rubies, and emeralds selected for color, proportion, and provenance. Offered strictly by appointment.",
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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
        </head>
        <body>{children}</body>
        </html>
    );
}