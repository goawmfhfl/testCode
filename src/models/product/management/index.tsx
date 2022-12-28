import { ProductStatus } from "@constants/product";
import { ProductsType } from "@graphql/queries/getProductsBySeller";

export interface NormalizedType {
  products: {
    allIds: Array<number>;
    byId: { [key: number]: ProductsType };
  };
}

export interface CaculatedProductsType {
  productId: number;
  thumbnail: string;
  productName: string;
  firstCategory: string;
  secondCategory: string;
  thirdCategory: string;
  originalPriceToWonSign: string;
  discountedRate: string;
  finalSellngPrice: string;
  quantity: number;
  status: ProductStatus;
  isChecked: boolean;
}
