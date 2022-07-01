import { useFormContext } from "react-hook-form";
import styled from "styled-components";

const ShopPolicy = () => {
  const { register } = useFormContext();

  return (
    <ShopPolicyContainer>
      <SectionContainer>
        <Description>배송 정책</Description>
        <TextAreaContainer>
          <TextArea {...register("deliveryPolicy")} />
        </TextAreaContainer>
      </SectionContainer>
      <SectionContainer>
        <Description>교환/환불 정책</Description>
        <TextAreaContainer>
          <TextArea {...register("returnPolicy")} />
        </TextAreaContainer>
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

const TextAreaContainer = styled.div`
  display: flex;

  & > span {
    display: flex;
    align-items: flex-end;
    margin-left: 8px;
  }
`;

const TextArea = styled.textarea`
  width: 377px;
  height: 156px;
  background: ${({ theme: { palette } }) => palette.white};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  padding: 8px;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;

  resize: none;
`;

export default ShopPolicy;
