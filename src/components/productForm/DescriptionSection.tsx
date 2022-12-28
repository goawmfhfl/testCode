import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import Textarea from "@components/common/input/Textarea";
import NoticeContainer from "@components/common/NoticeContainer";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import { PRODUCT_DESCRIPTION } from "@cache/productForm/index";

const ProductDescriptionSection = () => {
  const { register, watch } = useFormContext();
  const [text, setText] = useState<string>("");

  const productDescription = watch(PRODUCT_DESCRIPTION, "") as string;

  const changeTextAreaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (!productDescription) {
      return;
    }
    setText(productDescription);
  }, [productDescription]);

  return (
    <div>
      <NoticeContainerWrapper>
        <NoticeContainer
          icon={exclamationmarkSrc}
          width="655px"
          isOneLiner={true}
        >
          상품의 스토리, 장점, 디테일, 사용 방법, 주의 사항 등을 알려주세요.
          소비자가 상품 구매를 결정하는 데에 큰 도움이 됩니다.
        </NoticeContainer>
      </NoticeContainerWrapper>

      <TextAreaContainer>
        <Textarea
          size="small"
          width={"757px"}
          height={"120px"}
          register={register(PRODUCT_DESCRIPTION)}
          onChange={changeTextAreaHandler}
          value={text}
          placeholder={
            "최소 50자 이상 입력해주세요. ‘- (대쉬)’는 ‘・(글머리 기호)’로 나옵니다."
          }
          maxLength={200}
        />
        <TextCounter>{text ? text.length : "0"}/200</TextCounter>
      </TextAreaContainer>
    </div>
  );
};

const NoticeContainerWrapper = styled.div`
  margin-bottom: 16px;
`;

const TextAreaContainer = styled.div`
  display: flex;
`;

const TextCounter = styled.span`
  display: flex;
  align-items: flex-end;
  margin-left: 8px;
`;

export default ProductDescriptionSection;
