import { makeVar } from "@apollo/client";

export const filterOptionStatusVar = makeVar<string | null>(null);
export const checkedProductsListVar = makeVar<
  Array<CheckedProductsListVarType>
>([]);

export interface CheckedProductsListVarType {
  category: string;
  id: number;
  name: string;
  originalPrice: number;
  discountAmount: number;
  discountAppliedPrice: number;
  discountMethod: string;
  status: string;
  quantity: number;
}
