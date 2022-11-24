import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
  GET_ALL_PRODUCTS_BY_SELLER,
  ProductsType,
} from "@graphql/queries/getAllProductsBySeller";

const useLazyProducts = () => {
  const [products, setProducts] = useState<Array<ProductsType>>([]);
  const [isCheckedList, setIsCheckedList] = useState<{
    [key: string]: { isChecked: boolean };
  }>({});

  const [getProducts, { loading, error, data }] = useLazyQuery<
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
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const totalPages: number = data?.getAllProductsBySeller.totalPages || 1;

  useEffect(() => {
    const products: Array<ProductsType> = data?.getAllProductsBySeller.products;
    const checkedList: {
      [key: string]: { isChecked: boolean };
    } =
      products?.reduce((acc, cur) => {
        acc[cur.id] = { isChecked: false };
        return acc;
      }, {}) || {};

    setIsCheckedList(checkedList);
    setProducts(products);
  }, [data]);

  return {
    loading,
    error,
    products,
    setProducts,
    isCheckedList,
    setIsCheckedList,
    totalPages,
    getProducts,
  };
};
export default useLazyProducts;
