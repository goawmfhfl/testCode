import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import {
  GET_PRODUCTS_BY_ID,
  GetProductsByIdType,
  GetProductsByIdInputType,
} from "@graphql/queries/getProductsById";

import { ProductFormValues } from "@models/product/index";

import ProductForm from "@components/productForm/index";
import setProduct from "@utils/product/form/setProduct";
import { loadingSpinnerVisibilityVar } from "@cache/index";

const ProductRegistration = () => {
  const { productId } = useParams();

  const methods = useForm<ProductFormValues>();

  const [getProduct] = useLazyQuery<
    GetProductsByIdType,
    GetProductsByIdInputType
  >(GET_PRODUCTS_BY_ID, {
    variables: {
      input: {
        productId: Number(productId),
      },
    },
  });

  useEffect(() => {
    if (!productId) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      loadingSpinnerVisibilityVar(true);

      const {
        data: {
          getProductById: { product, ok, error },
        },
      } = await getProduct();

      loadingSpinnerVisibilityVar(false);

      if (ok) {
        setProduct(product, methods.reset, methods.setValue);
      }

      if (error) {
        // TODO: 에러 핸들링 로직 추가
        console.log("상품 정보를 가져오던 중 에러가 발생하였습니다: ", error);
      }
    })();
  }, [productId]);

  return (
    <FormProvider {...methods}>
      <ProductForm />
    </FormProvider>
  );
};

export default ProductRegistration;
