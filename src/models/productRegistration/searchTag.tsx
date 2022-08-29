export enum TagTypes {
  SearchOnly = "SEARCH_ONLY",
  Exposed = "EXPOSED",
}

export interface SearchTag {
  id: string;
  tagName: string;
  type: TagTypes;
}
