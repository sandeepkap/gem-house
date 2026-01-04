import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
    S.list()
        .title("Content")
        .items([
            S.documentTypeListItem("stone").title("Stones"),
            S.divider(),
            S.documentTypeListItem("post").title("Posts"),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("author").title("Authors"),
        ]);
