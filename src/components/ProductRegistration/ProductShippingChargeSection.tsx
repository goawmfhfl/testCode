import styled, { useTheme } from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import Button from "@components/common/Button";

const ProductShippingCharge = () => {
  const theme = useTheme();
  const { register } = useFormContext();

  return (
    <Container>
      <InputContainer>
        <Label>배송 템플릿</Label>

        <DropdownWrapper>
          <Dropdown
            register={register("shippingTemplate")}
            size="medium"
            options={["기본 배송 설정", "배송 템플릿 1", "배송 템플릿 2"]}
          />
        </DropdownWrapper>

        <Button
          size="small"
          color="white"
          backgroundColor={`${theme.palette.grey700}`}
        >
          배송 템플릿
        </Button>
      </InputContainer>

      <InputContainer>
        <Label>묶음 배송</Label>

        <RadioInputContainer>
          <label htmlFor="bundling-enabled">가능</label>
          <input
            type="radio"
            name="shipment-bundling"
            id="bundling-enabled"
            value="가능"
          />

          <label htmlFor="bundling-disabled">불가능</label>
          <input
            type="radio"
            name="shipment-bundling"
            id="bundling-disabled"
            value="불가능"
          />
        </RadioInputContainer>
      </InputContainer>

      <InputContainer>
        <Label>배송비 ●</Label>
        <ShippingChargeInputContainer>
          <Dropdown
            register={register("shippingChargeOption")}
            size="medium"
            width="160px"
            options={["유료", "무료"]}
          />

          <TextInputContainer>
            <TextInputWrapper>
              <TextInput
                width="138px"
                register={register("shippingChargeValue")}
              />
            </TextInputWrapper>
            원
          </TextInputContainer>
        </ShippingChargeInputContainer>
      </InputContainer>

      <InputContainer>
        <Label>제주 도서산간 추가 배송비 ●</Label>

        <TextInputContainer>
          <TextInputWrapper>
            <TextInput
              register={register("countrysideAdditionalShippingCharge")}
            />
          </TextInputWrapper>
          원
        </TextInputContainer>
      </InputContainer>

      <InputContainer>
        <Label>반품/교환 ●</Label>

        <ReturnExchangeFeeInputContainer>
          <TextInputContainer>
            반품배송비(편도)
            <TextInputWrapper hasLeftMargin={true}>
              <TextInput
                register={register("countrysideAdditionalShippingCharge")}
              />{" "}
            </TextInputWrapper>
            원
          </TextInputContainer>

          <TextInputContainer>
            교환배송비(왕복)
            <TextInputWrapper hasLeftMargin={true}>
              <TextInput
                register={register("countrysideAdditionalShippingCharge")}
              />{" "}
            </TextInputWrapper>
            원
          </TextInputContainer>
        </ReturnExchangeFeeInputContainer>
      </InputContainer>
    </Container>
  );
};

const Container = styled.div``;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;

  margin-bottom: 13px;
  min-height: 32px;

  font-family: Spoqa Han Sans Neo;
  font-size: 13px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const DropdownWrapper = styled.span`
  margin-right: 9px;
`;

const RadioInputContainer = styled.div`
  display: flex;
  align-items: center;

  margin-top: 8px;

  font-family: Spoqa Han Sans Neo;
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const ShippingChargeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReturnExchangeFeeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  width: 230px;
  margin-top: 8px;

  font-family: Spoqa Han Sans Neo;
  font-size: 13px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const TextInputContainer = styled.div`
  display: flex;
  align-items: center;

  margin-top: 9px;
`;

const TextInputWrapper = styled.div<{
  hasLeftMargin?: boolean;
}>`
  margin-left: ${({ hasLeftMargin }) => (hasLeftMargin ? "8px" : "")};
`;

export default ProductShippingCharge;
