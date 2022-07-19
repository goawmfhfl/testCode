import { useFormContext } from "react-hook-form";
import styled from "styled-components";

import Textarea from "@components/common/input/Textarea";

const ShopPolicy = () => {
  const { register } = useFormContext();

  return (
    <ShopPolicyContainer>
      <SectionContainer>
        <Description>배송 정책</Description>
        <TextareaContainer>
          <Textarea
            width={"379px"}
            height={"156px"}
            size="small"
            register={register("shipmentPolicy")}
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
            register={register("returnPolicy")}
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

  & > div:first-child {
    margin-bottom: 48px;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > span {
    margin-bottom: 8px;
  }
`;

const Description = styled.span`
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
