import { makeVar } from "@apollo/client";

import { SearchTag } from "@models/product/searchTag";

export const tagListVar = makeVar<Array<SearchTag>>([]);
