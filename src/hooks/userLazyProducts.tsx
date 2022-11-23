import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
  GET_ALL_PRODUCTS_BY_SELLER,
  ProductsType,
} from "@graphql/queries/getAllProductsBySeller";

const useLazyProducts = () => {
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
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const totalPages: number = data?.getAllProductsBySeller.totalPages || 1;
  const products: Array<ProductsType> =
    data?.getAllProductsBySeller.products.map((list) => ({
      ...list,
      isChecked: false,
    })) || [];

  useEffect(() => {
    const checkedList: {
      [key: string]: { isChecked: boolean };
    } =
      products?.reduce((acc, cur) => {
        acc[cur.id] = { isChecked: false };
        return acc;
      }, {}) || {};

    setIsCheckedList(checkedList);
  }, [data]);

  return {
    loading,
    error,
    products,
    isCheckedList,
    setIsCheckedList,
    totalPages,
    getProducts,
  };
};
export default useLazyProducts;
