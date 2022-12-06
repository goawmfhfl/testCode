import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import checkedIconSrc from "@icons/checkbox-checked-white.svg";
import darkCheckedIconSrc from "@icons/checkbox-checked-grey.svg";
import { PRODUCT_COLOR } from "@cache/productForm/index";
import { ColorType, ColorInputType } from "@models/product/index";

const colors: Array<ColorInputType> = [
  { name: "빨강", hex: "#FF0000", value: ColorType.RED },
  { name: "주황", hex: "#FF8A00", value: ColorType.ORANGE },
  { name: "노랑", hex: "#FFE600", value: ColorType.YELLOW },
  { name: "연두", hex: "#37D300", value: ColorType.YELLOW_GREEN },
  { name: "초록", hex: "#008A0E", value: ColorType.GREEN },
  { name: "하늘", hex: "#7ACFFF", value: ColorType.SKY },
  { name: "파랑", hex: "#0BA7FF", value: ColorType.BLUE },
  { name: "남색", hex: "#003AAD", value: ColorType.NAVY },
  { name: "분홍", hex: "#FF81FA", value: ColorType.PINK },
  { name: "보라", hex: "#9038FF", value: ColorType.VIOLET },
  { name: "자주", hex: "#DA00AA", value: ColorType.PURPLE },
  { name: "검정", hex: "#000000", value: ColorType.BLACK },
  {
    name: "흰색",
    hex: "#FFFFFF",
    value: ColorType.WHITE,
    darkCheckedIcon: true,
  },
  { name: "회색", hex: "#BBC0C6", value: ColorType.GRAY },
  {
    name: "아이보리",
    hex: "#FEFAF0",
    value: ColorType.IVORY,
    darkCheckedIcon: true,
  },
  {
    name: "베이지",
    hex: "#FDF2D7",
    value: ColorType.BEIGE,
    darkCheckedIcon: true,
  },
  { name: "갈색", hex: "#955D0A", value: ColorType.BROWN },
  { name: "패턴/일러스트", hex: "#008A0E", value: ColorType.PATTERN_ILLUST },
];

interface MappedColorInputType extends ColorInputType {
  key: string;
}

const ProductColor = () => {
  const { register } = useFormContext();

  const [mappedColorList, setMappedColorList] = useState<
    Array<MappedColorInputType>
  >([]);

  useEffect(() => {
    const mappedColors = colors.map((el) => ({ ...el, key: uuidv4() }));

    setMappedColorList(mappedColors);
  }, []);

  return (
    <Container>
      {mappedColorList.map(({ key, name, hex, value, darkCheckedIcon }) => {
        return (
          <ColorContainer key={key}>
            <ColorCheckbox
              hex={hex}
              darkCheckedIcon={darkCheckedIcon}
              value={value}
              {...register(PRODUCT_COLOR)}
            />
            <Label>{name}</Label>
          </ColorContainer>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  width: 656px;
`;

const ColorContainer = styled.div`
  width: 24px;
  margin: 3px 12px;
  margin-bottom: 54px;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
`;

const Label = styled.label`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 10px;
  line-height: 14px;

  position: absolute;
  top: 100%;
  margin-top: 24px;

  word-break: keep-all;
  text-align: center;
`;

const ColorCheckbox = styled.input.attrs({
  type: "checkbox",
})<{
  hex: string;
  darkCheckedIcon: boolean | undefined;
}>`
  appearance: none;
  cursor: pointer;

  &:after {
    content: "";
    background-color: ${({ hex }) => (hex ? hex : "")};
    width: 24px;
    height: 24px;
    border-radius: 50%;

    position: absolute;
    top: 0;
    left: 48%;
    transform: translateX(-50%);
  }

  &:checked {
    &:after {
      background-image: ${({ darkCheckedIcon }) =>
        `url(${darkCheckedIcon ? darkCheckedIconSrc : checkedIconSrc})`};
      background-repeat: no-repeat;
      background-position: center;
      width: 24px;
      height: 24px;

      background-color: ${({ hex }) => (hex ? hex : "")};
      z-index: 1;
    }

    &:before {
      content: "";
      width: 27px;
      height: 27px;
      border-radius: 50%;
      background-color: transparent;
      border: 1px solid ${({ hex }) => (hex ? hex : "")};

      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -2.5px);
    }
  }
`;

export default ProductColor;
