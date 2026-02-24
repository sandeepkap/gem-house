export const revalidate = 0;

import Navigation from "@/app/components/Navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import ConfiguratorClient from "./ConfiguratorClient";

export type StoneForConfigurator = {
    _id: string;
    name: string;
    category: string;
    origin?: string;
    carat?: number;
    price?: number | null;
    priceOnRequest?: boolean | null;
    currency?: string | null;
    imageUrl: string | null;
    dominantColor: string;
    priceDisplay: string;
};

async function getStones(): Promise<StoneForConfigurator[]> {
    const raw = await client.fetch(`
    *[_type == "stone" && available == true]
    | order(sortOrder asc, _createdAt desc) {
      _id, name, category, origin, carat,
      price, priceOnRequest, currency, images
    }
  `);

    return raw.map((s: any) => ({
        ...s,
        imageUrl: s.images?.[0]
            ? urlFor(s.images[0]).width(800).height(800).fit("crop").auto("format").url()
            : null,
        dominantColor: categoryToColor(s.category),
        priceDisplay: formatPrice(s),
    }));
}

function categoryToColor(cat: string = ""): string {
    const c = cat.toLowerCase();
    if (c.includes("sapphire")) return "#1a4fa0";
    if (c.includes("ruby")) return "#9b1b30";
    if (c.includes("emerald")) return "#1a6b3c";
    if (c.includes("padparadscha")) return "#e8734a";
    if (c.includes("spinel")) return "#7b2d8b";
    if (c.includes("alexandrite")) return "#2d6b4a";
    if (c.includes("garnet")) return "#6b1a1a";
    if (c.includes("opal")) return "#a0c4c8";
    if (c.includes("tourmaline")) return "#2d8b5a";
    if (c.includes("peridot")) return "#7ab648";
    return "#8a7055";
}

function formatPrice(s: any): string {
    if (s.priceOnRequest || s.price == null) return "Price on request";
    return `${(s.currency || "USD").toUpperCase()} ${Number(s.price).toLocaleString()}`;
}

export default async function ConfigurePage() {
    const stones = await getStones();
    return (
        <>
            <Navigation />
            <div style={{ paddingTop: 90 }}>
                <ConfiguratorClient stones={stones} />
            </div>
        </>
    );
}