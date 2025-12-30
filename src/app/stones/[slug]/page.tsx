import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type Stone = {
    name: string;
    category: string;
    origin?: string;
    carat?: number;
    notes?: string;
    images: any[];
    slug: { current: string };
};

async function getStone(slug: string): Promise<Stone | null> {
    client.fetch(
        `
    *[_type == "stone" && slug.current == $slug][0]{
      name, category, origin, carat, notes, images, slug
    }
  `,
        { slug }
    );
}

export default async function StonePage({
                                            params,
                                        }: {
    params: { slug: string };
}) {
    const stone = await getStone(params.slug);

    if (!stone) {
        return (
            <main className="container" style={{ paddingTop: 96, paddingBottom: 96 }}>
                <div className="small">Not found</div>
                <h2 style={{ marginTop: 16 }}>This stone is unavailable.</h2>
                <div style={{ marginTop: 24 }}>
                    <Link href="/" className="small" style={{ textTransform: "none", letterSpacing: "0.04em" }}>
                        ← Back
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container" style={{ paddingTop: 72, paddingBottom: 96 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                <div>
                    <div className="small">{stone.category}</div>
                    <h2 style={{ marginTop: 14 }}>{stone.name}</h2>
                </div>

                <Link
                    href="/"
                    className="small"
                    style={{ textTransform: "none", letterSpacing: "0.04em" }}
                >
                    ← Back
                </Link>
            </div>

            <div className="divider" style={{ margin: "28px 0" }} />

            <div className="small" style={{ textTransform: "none", letterSpacing: "0.04em" }}>
                {stone.origin ? `Origin: ${stone.origin}` : ""}
                {stone.carat ? ` • Carat: ${stone.carat}` : ""}
            </div>

            {stone.notes ? (
                <p style={{ marginTop: 16, maxWidth: 720 }}>{stone.notes}</p>
            ) : null}

            <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
                {stone.images?.map((img, i) => (
                    <div key={i} style={{ border: "1px solid rgba(245,245,245,0.18)" }}>
                        <Image
                            src={urlFor(img).width(2000).height(1400).fit("max").url()}
                            alt={`${stone.name} image ${i + 1}`}
                            width={2000}
                            height={1400}
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}
