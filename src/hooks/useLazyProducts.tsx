import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
  ProductsType,
  GET_ALL_PRODUCTS_BY_SELLER,
} from "@graphql/queries/getAllProductsBySeller";

const useLazyProducts = () => {
  const [products, setProducts] = useState<Array<ProductsType>>([]);

  const [getProducts, { data, loading, error }] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: {
        page: 1,
        skip: 20,
        status: null,
        query: "",
      },
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });

  const totalPages = data?.getAllProductsBySeller.totalPages || 1;

  useEffect(() => {
    const products: Array<ProductsType> =
      data?.getAllProductsBySeller.products.map((list) => ({
        ...list,
        isChecked: false,
      })) || [];

    setProducts(products);
  }, [data]);

  return { loading, error, products, setProducts, totalPages, getProducts };
};
export default useLazyProducts;
