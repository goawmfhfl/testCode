import { makeVar } from "@apollo/client";

export const getProductBySellerVar = makeVar<Array<ProductsListVarType>>([]);

export const filterOptionStatusVar = makeVar<string | null>(null);

export const checkedProductsListVar = makeVar<Array<ProductsListVarType>>([]);

export interface ProductsListVarType {
  category: string;
  id: number;
  name: string;
  originalPrice: number;
  discountAmount: number | null;
  discountAppliedPrice: number | null;
  discountMethod: string | null;
  status: string;
  quantity: number;
  isChecked: boolean;
}
