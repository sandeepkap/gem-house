import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import stone from "./stone";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContentType,
  categoryType,
  postType,
  authorType,
  stone,
];
