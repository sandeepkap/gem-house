import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "KAPUGAMAGE & CO. | Fine Gemstones",
    description:
        "Fine gemstones curated with discretion. Sapphires, rubies, emeralds, and bespoke sourcing.",
    metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
