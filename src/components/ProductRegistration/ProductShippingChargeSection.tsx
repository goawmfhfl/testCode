import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import Checkbox from "@components/common/input/Checkbox";
import TextInput from "@components/common/input/TextInput";
import NoticeContainer from "@components/common/NoticeContainer";
import Dropdown from "@components/common/input/Dropdown";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import Button from "@components/common/Button";

const ProductShippingCharge = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <InputContainer>
        <InputContainer>
          <Label>배송 템플릿</Label>
          <DropdownWrapper>
            <Dropdown
              register={register("shippingTemplate")}
              size="medium"
              options={["배송 템플릿 1", "배송 템플릿 2"]}
            />
          </DropdownWrapper>
          <Button size="small">배송 템플릿 만들기</Button>
        </InputContainer>
      </InputContainer>

      <InputContainer>
        <InputContainer>
          <Label>배송비 ●</Label>
          <ShippingChargeInputContainer>
            <Dropdown
              register={register("shippingChargeOption")}
              size="medium"
              options={["배송비 옵션 1", "배송비 옵션 2"]}
            />
            <TextInputWrapper>
              <TextInput register={register("shippingChargeValue")} /> 원
            </TextInputWrapper>
          </ShippingChargeInputContainer>
        </InputContainer>
      </InputContainer>

      <InputContainer>
        <InputContainer>
          <Label>제주 도서산간 추가 배송비 ●</Label>
          <TextInput
            register={register("countrysideAdditionalShippingCharge")}
          />{" "}
          원
        </InputContainer>
      </InputContainer>
    </Container>
  );
};

const Container = styled.div``;

const InputContainer = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 13px;
`;

const DropdownWrapper = styled.span`
  margin-right: 9px;
`;

const ShippingChargeInputContainer = styled.div``;

const Label = styled.label`
  width: 230px;
`;

const TextInputWrapper = styled.div`
  margin-top: 9px;
`;

export default ProductShippingCharge;
