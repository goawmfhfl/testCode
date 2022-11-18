import { useState } from "react";
import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
  GET_ALL_PRODUCTS_BY_SELLER,
} from "@graphql/queries/getAllProductsBySeller";

interface UseLazyProduct {
  page: number;
  skip: number;
  status: string;
  query: string;
}

const useLazyProducts = (input: UseLazyProduct) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [getProducts, { loading, error }] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input,
    },
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const orderItems = data.getAllProductsBySeller.products;
      const totalPages = data.getAllProductsBySeller.totalPages;

      setProducts(orderItems);
      setTotalPages(totalPages);
    },
  });

  return { loading, error, products, totalPages, getProducts };
};
export default useLazyProducts;
