import { defineField, defineType } from "sanity";

export default defineType({
    name: "stone",
    title: "Stone",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (r) => r.required(),
        }),

        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name", maxLength: 96 },
            validation: (r) => r.required(),
        }),

        defineField({
            name: "category",
            title: "Category",
            type: "string",
            options: { list: ["Sapphire", "Ruby", "Emerald", "Spinel", "Other"] },
            validation: (r) => r.required(),
        }),

        defineField({ name: "origin", title: "Origin", type: "string" }),
        defineField({ name: "carat", title: "Carat", type: "number" }),

        defineField({
            name: "notes",
            title: "Notes",
            type: "text",
        }),

        defineField({
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "image", options: { hotspot: true } }],
            validation: (r) => r.min(1),
        }),

        defineField({
            name: "available",
            title: "Available",
            type: "boolean",
            initialValue: true,
        }),
    ],
});
