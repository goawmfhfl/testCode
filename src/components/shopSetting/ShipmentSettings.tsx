import { SyntheticEvent, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components/macro";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import Radio from "@components/common/input/Radio";
import NoticeContainer from "@components/common/NoticeContainer";

import informationMarkSource from "@icons/info.svg";
import { ShipmentChargeType } from "@models/productRegistration/shipmentTemplate";
import {
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  SHIPMENT_RETURN_PRICE,
  SHIPMENT_EXCHANGE_PRICE,
  SHIPMENT_CONDITIONAL_PRICE,
  SHIPMENT_BUNDLING,
  HAS_SET_CONDITIONAL_FREE_SHIPMENT,
} from "@cache/shopSettings";
import { ConditionalFreeShipmentPolicy } from "@constants/shop";
import { unfulfilledInputNamesVar } from "@cache/shopSettings";
import { useReactiveVar } from "@apollo/client";

const ShipmentSettings = () => {
  const { register, watch, setValue } = useFormContext();

  const handleSetConditionalFreePolicyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setValue(HAS_SET_CONDITIONAL_FREE_SHIPMENT, value);

    if (value === ConditionalFreeShipmentPolicy.Set) {
      setValue(SHIPMENT_CONDITIONAL_PRICE, 0);
    }

    if (value === ConditionalFreeShipmentPolicy.Unset) {
      setValue(SHIPMENT_CONDITIONAL_PRICE, null);
    }
  };

  const shipmentPriceType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
  const isShipmentPriceFree = shipmentPriceType === ShipmentChargeType.Free;
  const isSetConditionalShipmentPolicy =
    watch(HAS_SET_CONDITIONAL_FREE_SHIPMENT) ===
    ConditionalFreeShipmentPolicy.Set;

  const unfulfilledInputNames = useReactiveVar(unfulfilledInputNamesVar);

  const isShipmentConditionalPriceUnfulfilled = unfulfilledInputNames.includes(
    "shipmentConditionalPrice"
  );

  return (
    <Container>
      <DefaultShipmentSection>
        <SectionLabelContainer>
          <SectionLabel>기본 배송 설정</SectionLabel>
          <NoticeContainer
            icon={informationMarkSource}
            width={"274px"}
            isOneLiner={true}
          >
            기본 배송 설정은 배송템플릿에 저장됩니다.
          </NoticeContainer>
        </SectionLabelContainer>

        <Contents>
          <InputContainer>
            <InputLabel>묶음 배송</InputLabel>
            <RadioLabel>가능</RadioLabel>
            <Radio
              {...register(SHIPMENT_BUNDLING)}
              value="가능"
              defaultChecked
            />
            <RadioLabel>불가능</RadioLabel>
            <Radio {...register(SHIPMENT_BUNDLING)} value="불가능" />
          </InputContainer>

          <InputContainer>
            <InputLabel>배송비 ●</InputLabel>

            <ShipmentPriceContainer>
              <Dropdown
                size="medium"
                options={[
                  {
                    name: "유료",
                    value: ShipmentChargeType.Charged,
                  },
                  {
                    name: "무료",
                    value: ShipmentChargeType.Free,
                  },
                ]}
                register={{
                  ...register(SHIPMENT_PRICE_TYPE, {
                    value: ShipmentChargeType.Charged,
                  }),
                  // eslint-disable-next-line
                  onChange: async (e: SyntheticEvent<HTMLSelectElement>) => {
                    setValue(SHIPMENT_PRICE_TYPE, e.currentTarget.value);

                    if (e.currentTarget.value === ShipmentChargeType.Free) {
                      setValue(SHIPMENT_PRICE, 0);
                      setValue(SHIPMENT_CONDITIONAL_PRICE, null);
                    }

                    if (e.currentTarget.value === ShipmentChargeType.Charged) {
                      setValue(SHIPMENT_PRICE, null);
                    }
                  },
                }}
              />

              <PriceInputContainer>
                <TextInput
                  placeholder="숫자만 입력"
                  numbersOnly={true}
                  register={register(SHIPMENT_PRICE)}
                  disabled={isShipmentPriceFree}
                />
                원
              </PriceInputContainer>
            </ShipmentPriceContainer>
          </InputContainer>

          <InputContainer>
            <InputLabel>제주 도서산간 추가 배송비 ●</InputLabel>
            <TextInput
              placeholder="숫자만 입력"
              numbersOnly={true}
              register={register(SHIPMENT_DISTANT_PRICE)}
            />{" "}
            원
          </InputContainer>

          <InputContainer>
            <InputLabel>반품/교환 ●</InputLabel>

            <ShipmentPriceContainer>
              <ReturnPriceInputContainer>
                <ReturnPriceLabel>반품배송비(편도)</ReturnPriceLabel>
                <ReturnPriceInput
                  placeholder="숫자만 입력"
                  numbersOnly={true}
                  register={register(SHIPMENT_RETURN_PRICE)}
                />{" "}
                원
              </ReturnPriceInputContainer>

              <ExchangePriceInputContainer>
                <ExchangePriceLabel>교환배송비(왕복)</ExchangePriceLabel>
                <ExchangePriceInput
                  placeholder="숫자만 입력"
                  numbersOnly={true}
                  register={register(SHIPMENT_EXCHANGE_PRICE)}
                />{" "}
                원
              </ExchangePriceInputContainer>
            </ShipmentPriceContainer>
          </InputContainer>
        </Contents>
      </DefaultShipmentSection>

      <ConditionalShipmentSection>
        <SectionLabelContainer>
          <SectionLabel style={{ marginRight: "16px" }}>
            샵 조건부 무료배송
          </SectionLabel>

          <RadioLabel>설정</RadioLabel>
          <Radio
            {...register(HAS_SET_CONDITIONAL_FREE_SHIPMENT)}
            onChange={handleSetConditionalFreePolicyChange}
            type="radio"
            value={ConditionalFreeShipmentPolicy.Set}
          />

          <RadioLabel>설정안함</RadioLabel>
          <Radio
            {...register(HAS_SET_CONDITIONAL_FREE_SHIPMENT)}
            onChange={handleSetConditionalFreePolicyChange}
            type="radio"
            value={ConditionalFreeShipmentPolicy.Unset}
            defaultChecked
          />
        </SectionLabelContainer>

        <Contents>
          <InputContainer>
            <TextInput
              register={register(SHIPMENT_CONDITIONAL_PRICE)}
              placeholder={"숫자만 입력"}
              numbersOnly={true}
              disabled={!isSetConditionalShipmentPolicy}
            />
            원 이상 구매시 무료배송
            {isShipmentConditionalPriceUnfulfilled && (
              <UnfulfilledMessageWrapper>
                1원 이상의 값을 입력해주세요
              </UnfulfilledMessageWrapper>
            )}
          </InputContainer>
        </Contents>
      </ConditionalShipmentSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;

  & > h3 {
    width: 234px;
  }
`;

const DefaultShipmentSection = styled(Section)`
  margin-bottom: 24px;
`;

const ConditionalShipmentSection = styled(Section)``;

const SectionLabelContainer = styled.div`
  display: flex;
  align-items: center;

  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
`;

const SectionLabel = styled.label`
  margin-right: 8px;
  white-space: nowrap;

  ${({ theme }) => theme.typo.korean.title.tertiary.basic};
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin-top: 16px;

  background-color: ${({ theme: { palette } }) => palette.grey100};
  border-radius: 7px;

  & > div:last-child {
    margin-bottom: 0;
  }
`;

const UnfulfilledMessageWrapper = styled.div`
  color: red;
  margin-left: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 24px;
`;

const InputLabel = styled.label`
  font-family: "Spoqa Han Sans Neo";
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  width: 234px;
`;

const RadioLabel = styled.label`
  ${({ theme }) => theme.typo.korean.body.secondary.basic};
`;

const ReturnPriceLabel = styled.label`
  margin-right: 8px;
`;
const ReturnPriceInput = styled(TextInput)``;

const ExchangePriceLabel = styled.label`
  margin-right: 8px;
`;
const ExchangePriceInput = styled(TextInput)``;

const ShipmentPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const ReturnPriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const ExchangePriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

export default ShipmentSettings;
