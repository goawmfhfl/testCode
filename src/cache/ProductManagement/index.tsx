import { makeVar } from "@apollo/client";
import { systemModalVar } from "..";

export const getProductBySellerVar = makeVar<Array<ProductsListVarType>>([]);

export const filterOptionPageNumberVar = makeVar<number>(1);
export const pageNumberListVar = makeVar<Array<number>>([]);
export const filterOptionSkipQuantityVar = makeVar<number>(20);
export const filterOptionStatusVar = makeVar<string | null>(null);
export const filterOptionQueryVar = makeVar<string>("");
export const temporaryQueryVar = makeVar<string>("");

export const selectedProductListVar = makeVar<Array<ProductsListVarType>>([]);
export const checkAllBoxStatusVar = makeVar<boolean>(false);

export interface ProductsListVarType {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    parent: { id: number; name: string } | null;
    children: { id: number; name: string } | null;
  };
  originalPrice: number;
  discountAmount: number | null;
  discountMethod: string | null;
  status: string;
  thumbnail: string;
  quantity: number;
  isChecked: boolean;
}

export const showHasCheckedAnyProductModal = () => {
  return systemModalVar({
    ...systemModalVar(),
    isVisible: true,
    description: (
      <>
        선택된 주문건이 없습니다
        <br />
        주문건을 선택해주세요.
      </>
    ),
    confirmButtonVisibility: true,
    confirmButtonClickHandler: () => {
      systemModalVar({
        ...systemModalVar(),
        isVisible: false,
      });
    },
    cancelButtonVisibility: false,
  });
};

export const showHasServerErrorModal = (error: string) => {
  return systemModalVar({
    ...systemModalVar(),
    isVisible: true,
    description: (
      <>
        인터넷 서버 장애로 인해
        <br />
        해당 작업을 완료하지 못했습니다.
        <br />
        다시 시도해 주시길 바랍니다.
        <br />
        에러메시지: {error}
      </>
    ),
    confirmButtonVisibility: true,
    cancelButtonVisibility: false,

    confirmButtonClickHandler: () => {
      systemModalVar({
        ...systemModalVar(),
        isVisible: false,
      });
    },
  });
};
