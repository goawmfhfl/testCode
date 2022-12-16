import { gql } from "@apollo/client";
import { CategoriesType } from "@models/index";

export interface GetCategoriesType {
  getCategories: {
    ok: boolean;
    error?: string;
    categories: Array<CategoriesType>;
  };
}

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      ok
      error
      categories {
        name
        type
        parent {
          id
          name
        }
        children {
          id
          name
        }
      }
    }
  }
`;
