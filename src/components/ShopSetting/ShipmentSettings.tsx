import { useFormContext } from "react-hook-form";
import styled from "styled-components/macro";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import Radio from "@components/common/input/Radio";
import NoticeContainer from "@components/common/NoticeContainer";
import informationMarkSource from "@icons/info.svg";
import { ShipmentChargeType } from "@models/shipmentTemplate";
import { useEffect } from "react";

const ShipmentSettings = () => {
  const { register, watch, setValue } = useFormContext();

  const shipmentPriceType = watch("shipmentPriceType") as ShipmentChargeType;

  const isShipmentPriceFree = shipmentPriceType === ShipmentChargeType.Free;

  useEffect(() => {
    if (shipmentPriceType === ShipmentChargeType.Free) {
      setValue("shipmentPrice", 0);
      setValue("shipmentConditionalPrice", null);
    } else {
      setValue("shipmentPrice", null);
    }
  }, [shipmentPriceType]);

  return (
    <Container>
      <Section>
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
            가능 <Radio name="bundleShipment" defaultChecked />
            불가능 <Radio name="bundleShipment" />
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
                register={register("shipmentPriceType")}
              />

              <PriceInputContainer>
                <TextInput
                  placeholder="숫자만 입력"
                  numbersOnly={true}
                  register={register("shipmentPrice")}
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
              register={register("shipmentDistantPrice")}
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
                  register={register("shipmentReturnPrice")}
                />{" "}
                원
              </ReturnPriceInputContainer>

              <ExchangePriceInputContainer>
                <ExchangePriceLabel>교환배송비(왕복)</ExchangePriceLabel>
                <ExchangePriceInput
                  placeholder="숫자만 입력"
                  numbersOnly={true}
                  register={register("shipmentExchangePrice")}
                />{" "}
                원
              </ExchangePriceInputContainer>
            </ShipmentPriceContainer>
          </InputContainer>
        </Contents>
      </Section>

      <Section>
        <SectionLabelContainer>
          <SectionLabel>샵 조건부 무료배송</SectionLabel>
          <NoticeContainer
            icon={informationMarkSource}
            width={"377px"}
            isOneLiner={true}
          >
            상단의 배송비 ‘유료' 선택시 조건부 무료배송 설정이 가능합니다.
          </NoticeContainer>
        </SectionLabelContainer>

        <Contents>
          <InputContainer>
            <TextInput
              register={register("shipmentConditionalPrice")}
              placeholder={"숫자만 입력"}
              numbersOnly={true}
              disabled={isShipmentPriceFree}
            />
            원 이상 구매시 무료배송
          </InputContainer>
        </Contents>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > :first-child {
    margin-bottom: 24px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;

  & > h3 {
    width: 234px;
  }
`;

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
