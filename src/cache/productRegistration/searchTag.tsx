import { makeVar } from "@apollo/client";

import { SearchTag } from "@models/searchTag";

export const tagListVar = makeVar<Array<SearchTag>>([]);
