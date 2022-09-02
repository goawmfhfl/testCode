import styled from "styled-components/macro";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import Dropdown from "@components/common/input/Dropdown";
import NoticeContainer from "@components/common/NoticeContainer";
import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
} from "@cache/productRegistration";
import { CategoryName } from "@models/productRegistration";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import { categoryMapper } from "constants/index";

interface CategoryType {
  depthFirst: Array<string>;
  depthSecond: {
    HOMEDECO: Array<string>;
    FABRIC: Array<string>;
    TABLEWARE: Array<string>;
    FURNITURE: Array<string>;
    TECH: Array<string>;
    DESKWARE: Array<string>;
    "WEAR&ACC": Array<string>;
  };
}

const ProductCategory = () => {
  const { watch } = useFormContext();

  const categoryDepthFirst: string = watch(CATEGORY_FIRST) as string;

  // TODO: 로컬 상태로 관리되는 것이 적합한지 검토
  const [category, setCategory] = useState<CategoryType>({
    depthFirst: [
      CategoryName.HOMEDECO,
      CategoryName.FABRIC,
      CategoryName.TABLEWARE,
      CategoryName.FURNITURE,
      CategoryName.TECH,
      CategoryName.DESKWARE,
      CategoryName.WEAR_ACC,
    ],
    depthSecond: {
      HOMEDECO: [
        CategoryName.INCENSE_CANDLE,
        CategoryName.POSTER,
        CategoryName.OBJET,
        CategoryName.VASE_FLOWERPOT,
        CategoryName.LIGHTING,
        CategoryName.MIRROR,
        CategoryName.TRAY,
        CategoryName.MOBILE,
        CategoryName.SOAP_DIFFUSER,
        CategoryName.TISSUE_COVER,
        CategoryName.HOME_DIY,
      ],
      FABRIC: [
        CategoryName.POSTER_BLANKET,
        CategoryName.CUSHION,
        CategoryName.RUG_MAT,
        CategoryName.BEDDING,
        CategoryName.FABRIC_ETC,
      ],
      TABLEWARE: [CategoryName.CUP, CategoryName.PLATE, CategoryName.BOWL],
      FURNITURE: [],
      TECH: [CategoryName.MULTITAP_SOCKET, CategoryName.WATCH],
      DESKWARE: [
        CategoryName.NOTE_MEMO,
        CategoryName.STATIONERY,
        CategoryName.CARD_POSTCARD,
      ],
      "WEAR&ACC": [
        CategoryName.PHONE,
        CategoryName.ACCESSORIES,
        CategoryName.JEWELLERY,
        CategoryName.BAG_POUCH,
        CategoryName.WEAR_ACC_ETC,
      ],
    },
  });

  const { register } = useFormContext();

  const depthSecondCategory: Array<string> =
    (category.depthSecond[categoryDepthFirst] as Array<string>) || [];

  return (
    <Container>
      <NoticeContainer icon={exclamationMarkSrc} width={"472px"}>
        카테고리는 하나만 설정 가능합니다. <br /> 상품과 맞지 않는 카테고리에
        등록할 경우 강제 이동되거나 판매보류 될 수 있습니다.
      </NoticeContainer>

      <DropdownContainer>
        <DropdownWrapper>
          <DropdownLabel>대분류</DropdownLabel>
          <Dropdown
            size={"big"}
            width={"231px"}
            options={[
              {
                name: "대분류를 선택해주세요",
                value: null,
              },
              ...category.depthFirst.map((value: string) => ({
                name: categoryMapper[value],
                value,
              })),
            ]}
            register={register(CATEGORY_FIRST)}
          />
        </DropdownWrapper>

        <DropdownWrapper>
          <DropdownLabel>중분류</DropdownLabel>
          <Dropdown
            size={"big"}
            width={"231px"}
            options={[
              { name: "중분류를 선택해주세요", value: null },
              ...depthSecondCategory.map((value) => ({
                name: categoryMapper[value],
                value,
              })),
            ]}
            register={register(CATEGORY_SECOND)}
            disabled={!depthSecondCategory.length ? true : false}
          />
        </DropdownWrapper>

        <DropdownWrapper>
          <DropdownLabel>소분류</DropdownLabel>
          <Dropdown
            size={"big"}
            width={"247px"}
            options={[{ name: "소분류를 선택해주세요", value: null }]}
            register={register(CATEGORY_THIRD)}
            disabled={true}
          />
        </DropdownWrapper>
      </DropdownContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DropdownContainer = styled.div`
  display: flex;

  margin-top: 16px;

  & > select {
    margin-right: 16px;
  }
`;

const DropdownLabel = styled.label`
  font-family: Spoqa Han Sans Neo;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  margin-left: 16px;
  margin-bottom: 8px;
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-right: 16px;
`;

export default ProductCategory;
