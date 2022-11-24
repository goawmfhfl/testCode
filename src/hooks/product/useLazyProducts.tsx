import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
  GET_ALL_PRODUCTS_BY_SELLER,
  ProductsType,
} from "@graphql/queries/getAllProductsBySeller";

import {
  pageNumberListVar,
  checkedProductIdsVar,
  checkAllBoxStatusVar,
} from "@cache/index";

const useLazyProducts = () => {
  const [products, setProducts] = useState<Array<ProductsType>>([]);
  const [isCheckedList, setIsCheckedList] = useState<{
    [key: string]: { isChecked: boolean };
  }>({});

  const [getProducts, { loading, error, data }] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  useEffect(() => {
    const totalPages: number = data?.getAllProductsBySeller.totalPages;
    const products: Array<ProductsType> = data?.getAllProductsBySeller.products;

    const checkedList: {
      [key: string]: { isChecked: boolean };
    } =
      products?.reduce((acc, cur) => {
        acc[cur.id] = { isChecked: false };
        return acc;
      }, {}) || {};

    pageNumberListVar(
      Array(totalPages)
        .fill(null)
        .map((_, index) => index + 1)
    );
    setProducts(products);
    setIsCheckedList(checkedList);
    checkedProductIdsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  return {
    loading,
    error,
    products,
    setProducts,
    isCheckedList,
    setIsCheckedList,
    getProducts,
  };
};
export default useLazyProducts;
