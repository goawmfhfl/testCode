import { makeVar } from "@apollo/client";

export const getProductBySellerVar = makeVar<Array<ProductsListVarType>>([]);
export const filterOptionStatusVar = makeVar<string | null>(null);

export const filterOptionSkipQuantityVar = makeVar<number>(20);

export const selectedProductListVar = makeVar<Array<ProductsListVarType>>([]);
export const selectedProductListIdsVar = makeVar<Array<number>>([]);
export const checkAllBoxStatusVar = makeVar<boolean>(false);

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
