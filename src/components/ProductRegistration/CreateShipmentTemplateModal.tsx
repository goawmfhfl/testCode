import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { gql, useMutation } from "@apollo/client";

import { Input as TextInput } from "@components/common/input/TextInput";
import NumberInput from "@components/common/input/NumberInput";
import {
  SelectInput as Dropdown,
  OptionInput as DropdownOption,
} from "@components/common/input/Dropdown";
import {
  InputContainer,
  Label,
  RadioInputContainer,
  TextInputContainer,
  TextInputWrapper,
  ReturnExchangeFeeInputContainer,
  ShipmentChargeInputContainer,
} from "@components/ProductRegistration/ProductShipmentChargeSection";
import Button from "@components/common/Button";
import closeIconSource from "@icons/close.svg";
import downwordArrowMedium from "@icons/arrow-downward-medium.svg";
import { overModalVar } from "@cache/index";
import { removeLeadingZero, isNumber } from "@utils/index";

enum ShipmentChargeType {
  Charged = "CHARGE",
  Free = "FREE",
}

interface ShipmentTemplateType {
  name: string;
  isBundlingEnabled: boolean;
  shipmentChargeType: ShipmentChargeType;
  shipmentCharge: number;
  additionalCharge: number;
  returnCharge: number;
  exchangeCharge: number;
}

interface CreateShipmentTemplateInput {
  name: string;
  isBundleShipment: boolean;
  type: ShipmentChargeType;
  price: number;
  distantPrice: number;
  returnPrice: number;
  exchangePrice: number;
}

const CreateShipmentTemplateModal = () => {
  const [shipmentTemplate, setShipmentTemplate] =
    useState<ShipmentTemplateType>({
      name: "",
      isBundlingEnabled: false,
      shipmentChargeType: ShipmentChargeType.Free,
      shipmentCharge: 0,
      additionalCharge: 0,
      returnCharge: 0,
      exchangeCharge: 0,
    });

  const handleCloseButtonClick = () => {
    overModalVar({
      ...overModalVar(),
      isVisible: false,
    });
  };

  const handleInputChange =
    (inputName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (inputName === "isBundlingEnabled") {
        setShipmentTemplate((prev) => ({
          ...prev,
          [inputName]: e.target.value === "가능" ? true : false,
        }));

        return;
      }

      if (inputName === "shipmentChargeType") {
        const isShipmentChargeFree = e.target.value === ShipmentChargeType.Free;
        const shipmentChargeType = e.target.value as ShipmentChargeType;

        setShipmentTemplate((prev) => ({
          ...prev,
          [inputName]: shipmentChargeType,
          shipmentCharge: isShipmentChargeFree ? 0 : prev.shipmentCharge,
        }));

        return;
      }

      setShipmentTemplate((prev) => ({
        ...prev,
        [inputName]: isNumber(e.target.value)
          ? Number(e.target.value)
          : e.target.value,
      }));
    };

  const {
    name,
    isBundlingEnabled,
    shipmentChargeType,
    shipmentCharge,
    additionalCharge,
    returnCharge,
    exchangeCharge,
  } = shipmentTemplate;

  useEffect(() => {
    console.log(shipmentTemplate);
  }, [shipmentTemplate]);

  const theme = useTheme();

  const CREATE_SHIPMENT_TEMPLATE = gql`
    mutation CreateShipmentTemplate($input: CreateShipmentTemplateInput!) {
      createShipmentTemplate(input: $input) {
        ok
        error
      }
    }
  `;

  const [createShipmentTemplate] = useMutation<
    { createShipmentTemplate: { ok: boolean; error: string } },
    { input: CreateShipmentTemplateInput }
  >(CREATE_SHIPMENT_TEMPLATE);

  const handleRegisterButtonClick = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async function (): Promise<void> {
        // shipmentTemplate을 서버로 보낸다!
        const {
          data: {
            createShipmentTemplate: { ok, error },
          },
        } = await createShipmentTemplate({
          variables: {
            input: {
              name,
              isBundleShipment: isBundlingEnabled,
              type: shipmentChargeType,
              price: shipmentCharge,
              distantPrice: additionalCharge,
              returnPrice: returnCharge,
              exchangePrice: exchangeCharge,
            },
          },
        });

        if (error) {
          // TODO: system modal로 템플릿 생성 에러 알림
          console.log(error);

          return;
        }
      })();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <CloseButton src={closeIconSource} onClick={handleCloseButtonClick} />

      <Title>배송 템플릿 만들기</Title>

      <InputList>
        <InputContainer>
          <Label>배송 템플릿명</Label>

          <TextInput value={name} onChange={handleInputChange("name")} />
        </InputContainer>

        <InputContainer>
          <Label>묶음 배송</Label>

          <RadioInputContainer>
            <label htmlFor="bundling-enabled">가능</label>
            <input
              type="radio"
              name="isBundlingEnabled"
              id="bundling-enabled"
              value="가능"
              onChange={handleInputChange("isBundlingEnabled")}
              checked={isBundlingEnabled}
            />

            <label htmlFor="bundling-disabled">불가능</label>
            <input
              type="radio"
              name="isBundlingEnabled"
              id="bundling-enabled"
              value="불가능"
              onChange={handleInputChange("isBundlingEnabled")}
              checked={!isBundlingEnabled}
            />
          </RadioInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>배송비</Label>
          <ShipmentChargeInputContainer>
            <Dropdown
              width="160px"
              sizing="medium"
              arrowSrc={downwordArrowMedium}
              onChange={handleInputChange("shipmentChargeType")}
            >
              <DropdownOption value={ShipmentChargeType.Free}>
                무료
              </DropdownOption>
              <DropdownOption value={ShipmentChargeType.Charged}>
                유료
              </DropdownOption>
            </Dropdown>

            <TextInputContainer>
              <TextInputWrapper hasLeftMargin={false}>
                <NumberInput
                  width={"138px"}
                  onChange={handleInputChange("shipmentCharge")}
                  value={removeLeadingZero(shipmentCharge)}
                  disabled={shipmentChargeType === ShipmentChargeType.Free}
                  hasHandle={false}
                />
              </TextInputWrapper>
              원
            </TextInputContainer>
          </ShipmentChargeInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>제주 도서산간 추가 배송비</Label>

          <TextInputContainer>
            <TextInputWrapper>
              <NumberInput
                hasHandle={false}
                value={removeLeadingZero(additionalCharge)}
                onChange={handleInputChange("additionalCharge")}
                placeholder="숫자만 입력"
              />
            </TextInputWrapper>
            원
          </TextInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>반품/교환</Label>

          <ReturnExchangeFeeInputContainer>
            <TextInputContainer>
              반품배송비(편도)
              <TextInputWrapper hasLeftMargin={true}>
                <NumberInput
                  hasHandle={false}
                  value={removeLeadingZero(returnCharge)}
                  onChange={handleInputChange("returnCharge")}
                  placeholder="숫자만 입력"
                />{" "}
              </TextInputWrapper>
              원
            </TextInputContainer>

            <TextInputContainer>
              교환배송비(왕복)
              <TextInputWrapper hasLeftMargin={true}>
                <NumberInput
                  hasHandle={false}
                  value={removeLeadingZero(exchangeCharge)}
                  onChange={handleInputChange("exchangeCharge")}
                  placeholder="숫자만 입력"
                />{" "}
              </TextInputWrapper>
              원
            </TextInputContainer>
          </ReturnExchangeFeeInputContainer>
        </InputContainer>
      </InputList>

      <ButtonContainer>
        <RegisterButton
          size="small"
          color={"white"}
          backgroundColor={theme.palette.grey700}
          onClick={handleRegisterButtonClick}
        >
          등록
        </RegisterButton>
        <CancelButton size="small">취소</CancelButton>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 552px;
  height: 500px;

  background-color: #fff;

  padding: 24px;
`;

const Title = styled.h2`
  font-family: "Spoqa Han Sans Neo";
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.015em;
  text-align: left;

  margin-bottom: 24px;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;

  cursor: pointer;
  user-select: none;
`;

const InputList = styled.div``;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  position: absolute;
  bottom: 24px;
  right: 24px;
`;

const RegisterButton = styled(Button)``;

const CancelButton = styled(Button)``;

export default CreateShipmentTemplateModal;
