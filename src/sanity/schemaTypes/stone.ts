import { defineField, defineType } from "sanity";

export default defineType({
    name: "stone",
    title: "Stone",
    type: "document",
    fields: [
        defineField({ name: "name", title: "Name", type: "string", validation: (R) => R.required() }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name", maxLength: 96 },
            validation: (R) => R.required(),
        }),

        defineField({
            name: "available",
            title: "Available",
            type: "boolean",
            initialValue: true,
        }),

        // ✅ NEW: Custom sort order field
        defineField({
            name: "sortOrder",
            title: "Sort Order",
            type: "number",
            description: "Set display order on homepage. Lower numbers appear first (1, 2, 3...). Leave empty to use creation date.",
            validation: (R) => R.min(0).integer(),
        }),

        defineField({ name: "category", title: "Category", type: "string" }),
        defineField({ name: "origin", title: "Origin", type: "string" }),
        defineField({ name: "carat", title: "Carat", type: "number" }),

        defineField({
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "image", options: { hotspot: true } }],
        }),

        defineField({
            name: "priceOnRequest",
            title: "Price on request",
            type: "boolean",
            initialValue: true,
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            options: { list: ["USD", "LKR", "EUR", "GBP"] },
            hidden: ({ document }) => Boolean(document?.priceOnRequest),
        }),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
            hidden: ({ document }) => Boolean(document?.priceOnRequest),
        }),

        // -----------------------------
        // REQUIRED NEW FIELDS
        // -----------------------------
        defineField({ name: "agclNo", title: "AGCL No", type: "string" }),
        defineField({ name: "color", title: "Color", type: "string" }),
        defineField({ name: "shape", title: "Shape", type: "string" }),
        defineField({ name: "cut", title: "Cut", type: "string" }),

        defineField({
            name: "dimensions",
            title: "Dimensions (L × W × D mm)",
            type: "object",
            fields: [
                defineField({ name: "length", title: "L (mm)", type: "number" }),
                defineField({ name: "width", title: "W (mm)", type: "number" }),
                defineField({ name: "depth", title: "D (mm)", type: "number" }),
            ],
        }),

        defineField({
            name: "comments",
            title: "Comments",
            type: "text",
            rows: 4,
        }),
    ],
});