import { makeVar } from "@apollo/client";

import { systemModalVar } from "@cache/index";
import { ProductStatus } from "@constants/product";

// TABLE: 테이블 필터
export const filterOptionVar = makeVar<{
  skip?: number;
  status?: ProductStatus;
  query?: string;
}>({
  skip: 20,
  status: null,
  query: "",
});

export interface ProductsListVarType {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    parent?: { id: number; name: string };
    children?: { id: number; name: string };
  };
  originalPrice: number;
  discountAmount?: number;
  discountMethod?: string;
  status: string;
  thumbnail: string;
  quantity: number;
  isChecked?: boolean;
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
