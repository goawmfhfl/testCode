import { useState } from "react";
import styled from "styled-components/macro";

import questionMarkSource from "@icons/questionmark.svg";

const DescriptionGuide = () => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  return (
    <DescriptionGuideContainer>
      상품설명
      <DescriptionGuideIcon
        src={questionMarkSource}
        onMouseEnter={() => {
          setIsMouseEntered(true);
        }}
        onMouseLeave={() => {
          setIsMouseEntered(false);
        }}
      />
      {isMouseEntered && (
        <DescriptionGuideModal>
          <InnerDescriptionGuideIcon src={questionMarkSource} />
          <InnerDescriptionGuide>
            하단의 내용을 참고하여 상품 설명을 작성해주시면 <br />
            소비자가 상품을 구매를 결정하는 데에 큰 도움이 됩니다. <br />
            <br />
            <DescriptionGuideList>
              <li>
                브랜드가 이 상품에 담고자 했던 스토리나 제작 계기를 간단하게
                작성해 주세요.
              </li>
              <li>
                이 상품은 무엇이며 어떤 강점이 있고 누구에게 왜 필요한지를
                설명해 주세요.
              </li>
              <li>상품의 비주얼과 디테일을 설명해 주세요.</li>
              <li>사용방법 및 주의사항을 알기 쉽게 전달해 주세요.</li>
            </DescriptionGuideList>
          </InnerDescriptionGuide>
        </DescriptionGuideModal>
      )}
    </DescriptionGuideContainer>
  );
};

const DescriptionGuideContainer = styled.div`
  position: relative;
`;

const DescriptionGuideIcon = styled.img`
  position: absolute;
  left: 75px;
  bottom: -2px;
  width: 24px;
  height: 24px;
`;

const InnerDescriptionGuideIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const InnerDescriptionGuide = styled.div`
  margin-top: 4px;
  margin-left: 12px;
`;

const DescriptionGuideModal = styled.div`
  width: 465px;
  height: 200px;
  background-color: ${({ theme: { palette } }) => palette.grey400};
  border-radius: 7px;

  position: absolute;
  bottom: 30px;
  left: 75px;

  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  padding: 8px;

  display: flex;
`;

const DescriptionGuideList = styled.ul`
  list-style: disc;

  & > li {
    margin-bottom: 17px;
  }
`;

export default DescriptionGuide;
