import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import checkedIconSrc from "@icons/checkbox-checked-white.svg";
import darkCheckedIconSrc from "@icons/checkbox-checked-grey.svg";

const colors: { name: string; hex: string; darkCheckedIcon?: boolean }[] = [
  { name: "빨강", hex: "#FF0000" },
  { name: "주황", hex: "#FF8A00" },
  { name: "노랑", hex: "#FFE600" },
  { name: "연두", hex: "#37D300" },
  { name: "초록", hex: "#008A0E" },
  { name: "하늘", hex: "#7ACFFF" },
  { name: "파랑", hex: "#0BA7FF" },
  { name: "남색", hex: "#003AAD" },
  { name: "분홍", hex: "#FF81FA" },
  { name: "보라", hex: "#9038FF" },
  { name: "자주", hex: "#DA00AA" },
  { name: "검정", hex: "#000000" },
  { name: "흰색", hex: "#FFFFFF", darkCheckedIcon: true },
  { name: "회색", hex: "#BBC0C6" },
  { name: "아이보리", hex: "#FEFAF0", darkCheckedIcon: true },
  { name: "베이지", hex: "#FDF2D7", darkCheckedIcon: true },
  { name: "갈색", hex: "#955D0A" },
  { name: "패턴/일러스트", hex: "#008A0E" },
];

const ProductColor = () => {
  const [mappedColorList, setMappedColorList] = useState<
    Array<{ key: string; name: string; hex: string; darkCheckedIcon?: boolean }>
  >([]);

  useEffect(() => {
    const mappedColors = colors.map((el) => ({ ...el, key: uuidv4() }));

    setMappedColorList(mappedColors);
  }, []);

  return (
    <Container>
      {mappedColorList.map(({ key, name, hex, darkCheckedIcon }) => {
        return (
          <ColorContainer key={key}>
            <Color hex={hex} darkCheckedIcon={darkCheckedIcon} />
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
  margin-right: 24px;
  margin-bottom: 54px;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
`;

const Label = styled.label`
  font-family: "SpoqaHanSansNeo";
  font-weight: 300;
  font-size: 10px;
  line-height: 14px;

  position: absolute;
  top: 100%;
  margin-top: 24px;

  word-break: keep-all;
  text-align: center;
`;

const Color = styled.input.attrs({
  type: "checkbox",
})<{
  hex: string;
  darkCheckedIcon: boolean | undefined;
}>`
  appearance: none;

  &:after {
    content: "";
    background-color: ${({ hex }) => (hex ? hex : "")};
    width: 24px;
    height: 24px;
    border-radius: 50%;

    position: absolute;
    top: 0;
    left: 50%;
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
