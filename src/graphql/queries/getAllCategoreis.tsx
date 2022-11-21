import { gql } from "@apollo/client";
import { CategoriesType } from "@models/index";

export interface GetAllCategoriesType {
  getAllCategories: {
    ok: boolean;
    error?: string;
    categories: Array<CategoriesType>;
  };
}

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
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
