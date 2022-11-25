import { makeVar } from "@apollo/client";

import { SearchTag } from "@models/productRegistration/searchTag";

export const tagListVar = makeVar<Array<SearchTag>>([]);
