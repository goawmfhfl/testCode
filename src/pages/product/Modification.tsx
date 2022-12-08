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
import { loadingSpinnerVisibilityVar, systemModalVar } from "@cache/index";
import useAuthGuard from "@hooks/useAuthGuard";

const ProductRegistration = () => {
  useAuthGuard();
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
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!productId) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
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
          console.log("상품 정보를 가져오던 중 에러가 발생하였습니다: ", error);
        }
      } catch (error) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              상품 정보를 가져오던 중 <br />
              에러가 발생하였습니다. <br />
              다시 시도 후 같은 문제가 발생할 시 <br />
              찹스틱스에 문의해주세요.
            </>
          ),
          confirmButtonText: "확인",
          confirmButtonVisibility: true,
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
          cancelButtonVisibility: false,
        });

        console.error(error);
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
