import { SyntheticEvent } from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components/macro";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import Radio from "@components/common/input/Radio";
import NoticeContainer from "@components/common/NoticeContainer";

import informationMarkSource from "@icons/info.svg";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";
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
import { unfulfilledInputListVar } from "@cache/shopSettings";
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

  const unfulfilledInputList = useReactiveVar(unfulfilledInputListVar);

  const isShipmentConditionalPriceUnfulfilled = unfulfilledInputList
    .map(({ name }) => name)
    .includes("shipmentConditionalPrice");

  return (
    <Container>
      <DefaultShipmentSection>
        <SectionLabelContainer>
          <SectionLabel>?????? ?????? ??????</SectionLabel>
          <NoticeContainer
            icon={informationMarkSource}
            width={"274px"}
            isOneLiner={true}
          >
            ?????? ?????? ????????? ?????????????????? ???????????????.
          </NoticeContainer>
        </SectionLabelContainer>

        <Contents>
          <InputContainer>
            <InputLabel>?????? ??????</InputLabel>
            <RadioLabel>??????</RadioLabel>
            <Radio
              {...register(SHIPMENT_BUNDLING)}
              value="??????"
              defaultChecked
            />
            <RadioLabel>?????????</RadioLabel>
            <Radio {...register(SHIPMENT_BUNDLING)} value="?????????" />
          </InputContainer>

          <InputContainer>
            <InputLabel>????????? ???</InputLabel>

            <ShipmentPriceContainer>
              <Dropdown
                size="medium"
                options={[
                  {
                    name: "??????",
                    value: ShipmentChargeType.Charged,
                  },
                  {
                    name: "??????",
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
                  placeholder="????????? ??????"
                  numbersOnly={true}
                  register={register(SHIPMENT_PRICE)}
                  disabled={isShipmentPriceFree}
                />
                ???
              </PriceInputContainer>
            </ShipmentPriceContainer>
          </InputContainer>

          <InputContainer>
            <InputLabel>?????? ???????????? ?????? ????????? ???</InputLabel>
            <TextInput
              placeholder="????????? ??????"
              numbersOnly={true}
              register={register(SHIPMENT_DISTANT_PRICE)}
            />{" "}
            ???
          </InputContainer>

          <InputContainer>
            <InputLabel>??????/?????? ???</InputLabel>

            <ShipmentPriceContainer>
              <ReturnPriceInputContainer>
                <ReturnPriceLabel>???????????????(??????)</ReturnPriceLabel>
                <ReturnPriceInput
                  placeholder="????????? ??????"
                  numbersOnly={true}
                  register={register(SHIPMENT_RETURN_PRICE)}
                />{" "}
                ???
              </ReturnPriceInputContainer>

              <ExchangePriceInputContainer>
                <ExchangePriceLabel>???????????????(??????)</ExchangePriceLabel>
                <ExchangePriceInput
                  placeholder="????????? ??????"
                  numbersOnly={true}
                  register={register(SHIPMENT_EXCHANGE_PRICE)}
                />{" "}
                ???
              </ExchangePriceInputContainer>
            </ShipmentPriceContainer>
          </InputContainer>
        </Contents>
      </DefaultShipmentSection>

      <ConditionalShipmentSection>
        <SectionLabelContainer>
          <SectionLabel style={{ marginRight: "16px" }}>
            ??? ????????? ????????????
          </SectionLabel>

          <RadioLabel>??????</RadioLabel>
          <Radio
            {...register(HAS_SET_CONDITIONAL_FREE_SHIPMENT)}
            onChange={handleSetConditionalFreePolicyChange}
            type="radio"
            value={ConditionalFreeShipmentPolicy.Set}
          />

          <RadioLabel>????????????</RadioLabel>
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
              placeholder={"????????? ??????"}
              numbersOnly={true}
              disabled={!isSetConditionalShipmentPolicy}
            />
            ??? ?????? ????????? ????????????
            {isShipmentConditionalPriceUnfulfilled && (
              <UnfulfilledMessageWrapper>
                1??? ????????? ?????? ??????????????????
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
  max-width: 631px;

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
