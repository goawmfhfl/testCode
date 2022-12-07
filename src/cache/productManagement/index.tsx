import { makeVar } from "@apollo/client";
import { systemModalVar } from "@cache/index";
import { ProductStatus } from "@constants/product";
import { CaculatedProductsType } from "@models/product/management";

export const checkedProductsVar = makeVar<Array<CaculatedProductsType>>([]);

export const filterOptionVar = makeVar<{
  status?: ProductStatus;
}>({
  status: null,
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

export const showHasServerErrorModal = (error: string, subject: string) => {
  systemModalVar({
    ...systemModalVar(),
    isVisible: true,
    description: (
      <>
        {subject}을(를) <br />
        완료하지 못했습니다.
        <br />
        다시 시도 후 같은 문제가 발생할 시
        <br />
        찹스틱스에 문의해주세요
        <br />
        <br />
        에러메시지:
        <br />
        {error}
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
