import { useFormContext } from "react-hook-form";
import styled from "styled-components/macro";

import Textarea from "@components/common/input/Textarea";
import NoticeContainer from "@components/common/NoticeContainer";

import questionMarkIconSource from "@icons/questionmark.svg";
import { SHIPMENT_POLICY, RETURN_POLICY } from "@cache/shopSettings";

const ShopPolicy = () => {
  const { register } = useFormContext();

  return (
    <ShopPolicyContainer>
      <NoticeContainer icon={questionMarkIconSource} width={"379px"}>
        배송 정책, 교환/환불 정책은 상품 상세페이지 하단에 노출됩니다.
      </NoticeContainer>

      <SectionContainer>
        <Description>배송 정책</Description>
        <TextareaContainer>
          <Textarea
            width={"379px"}
            height={"156px"}
            size="small"
            register={register(SHIPMENT_POLICY)}
          />
        </TextareaContainer>
      </SectionContainer>

      <SectionContainer>
        <Description>교환/환불 정책</Description>
        <TextareaContainer>
          <Textarea
            width={"379px"}
            height={"156px"}
            size="small"
            register={register(RETURN_POLICY)}
          />
        </TextareaContainer>
      </SectionContainer>
    </ShopPolicyContainer>
  );
};

const ShopPolicyContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 12px;

  & > span {
    margin-bottom: 8px;
  }
`;

const Description = styled.span`
  font-family: "Spoqa Han Sans Neo"
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;
`;

const TextareaContainer = styled.div`
  display: flex;

  & > span {
    display: flex;
    align-items: flex-end;
    margin-left: 8px;
  }
`;

export default ShopPolicy;
