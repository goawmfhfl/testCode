import styled from "styled-components/macro";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import Dropdown from "@components/common/input/Dropdown";
import NoticeContainer from "@components/common/NoticeContainer";
import exclamationMarkSrc from "@icons/exclamationmark.svg";

interface CategoryType {
  depthFirst: Array<string>;
  depthSecond: CategoryDepthSecondType;
}

interface CategoryDepthSecondType {
  HOMEDECO: Array<string>;
  FABRIC: Array<string>;
  TABLEWARE: Array<string>;
  FURNITURE: Array<string>;
  TECH: Array<string>;
  DESKWARE: Array<string>;
  "WEAR&ACC": Array<string>;
}

const ProductCategory = () => {
  const { watch } = useFormContext();

  const categoryDepthFirst: string = watch("categoryDepthFirst") as string;

  const [category, setCategory] = useState<CategoryType>({
    depthFirst: [
      "대분류를 선택해주세요",
      "HOMEDECO",
      "FABRIC",
      "TABLEWARE",
      "FURNITURE",
      "TECH",
      "DESKWARE",
      "WEAR&ACC",
    ],
    depthSecond: {
      HOMEDECO: [
        "인센스/캔들",
        "포스터",
        "오브제",
        "화병/화분",
        "조명",
        "거울",
        "트레이",
        "모빌",
        "비누/디퓨저",
        "티슈커버",
        "홈 DIY",
      ],
      FABRIC: ["포스터/블랭킷", "쿠션", "러그/매트", "침구", "기타"],
      TABLEWARE: ["컵", "접시/그릇", "보울"],
      FURNITURE: [],
      TECH: ["멀티탭/콘센트", "시계"],
      DESKWARE: ["노트/메모", "문구", "카드/엽서"],
      "WEAR&ACC": ["폰", "액세서리", "쥬얼리", "가방/파우치", "기타"],
    },
  });

  const { register } = useFormContext();

  const depthSecondCategory: Array<string> =
    (category.depthSecond[categoryDepthFirst] as Array<string>) || [];

  return (
    <Container>
      <NoticeContainer icon={exclamationMarkSrc}>
        카테고리는 하나만 설정 가능합니다. <br /> 상품과 어울리지 않는
        카테고리에 등록할 경우, 강제 이동되거나 판매보류 될 수 있습니다.
      </NoticeContainer>

      <DropdownContainer>
        <DropdownWrapper>
          <DropdownLabel>대분류</DropdownLabel>
          <Dropdown
            size={"big"}
            options={category.depthFirst}
            register={register("categoryDepthFirst")}
          />
        </DropdownWrapper>

        <DropdownWrapper>
          <DropdownLabel>중분류</DropdownLabel>
          <Dropdown
            size={"big"}
            options={["중분류를 선택해주세요", ...depthSecondCategory]}
            register={register("categoryDepthSecond")}
            disabled={!depthSecondCategory.length ? true : false}
          />
        </DropdownWrapper>

        <DropdownWrapper>
          <DropdownLabel>소분류</DropdownLabel>
          <Dropdown
            size={"big"}
            options={["소분류를 선택해주세요"]}
            register={register("categoryDepthThird")}
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
`;

export default ProductCategory;
