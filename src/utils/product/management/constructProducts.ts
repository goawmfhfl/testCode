import { ProductsType } from "@graphql/queries/getProductsBySeller";
import { NormalizedType } from "@models/product/management/index";

const contructProducts = (products: Array<ProductsType>) => {
  const result: NormalizedType = {
    products: {
      allIds: products.map((product) => product.id),
      byId: products.reduce((byId, product) => {
        byId[product.id] = product;
        return byId;
      }, {}),
    },
  };

  return result;
};
export default contructProducts;
