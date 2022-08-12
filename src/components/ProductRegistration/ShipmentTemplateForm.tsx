import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import Button from "@components/common/Button";
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
  NumberInputContainer,
  NumberInputWrapper,
  ReturnExchangeFeeInputContainer,
  ShipmentChargeInputContainer,
} from "@components/ProductRegistration/ShipmentChargeSection";
import closeIconSource from "@icons/close.svg";
import downwordArrowMedium from "@icons/arrow-downward-medium.svg";
import {
  removeLeadingZero,
  isNumber,
  hasEveryInputFulfilled,
} from "@utils/index";
import { ShipmentChargeType } from "@models/shipmentTemplate";
import { overModalVar } from "@cache/index";
import { shipmentTemplateVar } from "@cache/productRegistration/shipmentTemplate";

const ShipmentTemplateForm = ({
  formTitle,
  handleRegisterButtonClick,
  handleCancelButtonClick,
}: {
  formTitle: string;
  handleRegisterButtonClick: () => void;
  handleCancelButtonClick: () => void;
}) => {
  const theme = useTheme();
  const shipmentTemplate = useReactiveVar(shipmentTemplateVar);
  const [hasRegisterReady, setHasRegisterReady] = useState<boolean>(false);

  useEffect(() => {
    const allowsZeroInputNames: Array<string> = [];

    if (shipmentChargeType === ShipmentChargeType.Free) {
      allowsZeroInputNames.push("shipmentCharge");
    }

    const { isFulfilled } = hasEveryInputFulfilled(
      shipmentTemplate,
      allowsZeroInputNames
    );

    if (isFulfilled) {
      setHasRegisterReady(true);
    } else {
      setHasRegisterReady(false);
    }
  }, [shipmentTemplate]);

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
        shipmentTemplateVar({
          ...shipmentTemplateVar(),
          [inputName]: e.target.value === "가능" ? true : false,
        });

        return;
      }

      if (inputName === "shipmentChargeType") {
        const isShipmentChargeFree = e.target.value === ShipmentChargeType.Free;
        const shipmentChargeType = e.target.value as ShipmentChargeType;

        shipmentTemplateVar({
          ...shipmentTemplateVar(),
          [inputName]: shipmentChargeType,
          shipmentCharge: isShipmentChargeFree
            ? 0
            : shipmentTemplateVar().shipmentCharge,
        });

        return;
      }

      shipmentTemplateVar({
        ...shipmentTemplateVar(),
        [inputName]: isNumber(e.target.value)
          ? Number(e.target.value)
          : e.target.value,
      });
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

  return (
    <Container>
      <CloseButton src={closeIconSource} onClick={handleCloseButtonClick} />

      <Title>{formTitle}</Title>

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
              id="bundling-disabled"
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

            <NumberInputContainer>
              <NumberInputWrapper hasLeftMargin={false}>
                <NumberInput
                  width={"138px"}
                  onChange={handleInputChange("shipmentCharge")}
                  value={removeLeadingZero(shipmentCharge)}
                  disabled={shipmentChargeType === ShipmentChargeType.Free}
                  hasHandle={false}
                  step={1000}
                  min={0}
                  placeholder={"숫자만 입력"}
                />
              </NumberInputWrapper>
              원
            </NumberInputContainer>
          </ShipmentChargeInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>제주 도서산간 추가 배송비</Label>

          <NumberInputContainer>
            <NumberInputWrapper>
              <NumberInput
                hasHandle={false}
                step={1000}
                min={0}
                value={removeLeadingZero(additionalCharge)}
                onChange={handleInputChange("additionalCharge")}
                placeholder="숫자만 입력"
              />
            </NumberInputWrapper>
            원
          </NumberInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>반품/교환</Label>

          <ReturnExchangeFeeInputContainer>
            <NumberInputContainer>
              반품배송비(편도)
              <NumberInputWrapper hasLeftMargin={true}>
                <NumberInput
                  hasHandle={false}
                  step={1000}
                  min={0}
                  value={removeLeadingZero(returnCharge)}
                  onChange={handleInputChange("returnCharge")}
                  placeholder="숫자만 입력"
                />{" "}
              </NumberInputWrapper>
              원
            </NumberInputContainer>

            <NumberInputContainer>
              교환배송비(왕복)
              <NumberInputWrapper hasLeftMargin={true}>
                <NumberInput
                  hasHandle={false}
                  step={1000}
                  min={0}
                  value={removeLeadingZero(exchangeCharge)}
                  onChange={handleInputChange("exchangeCharge")}
                  placeholder="숫자만 입력"
                />{" "}
              </NumberInputWrapper>
              원
            </NumberInputContainer>
          </ReturnExchangeFeeInputContainer>
        </InputContainer>
      </InputList>

      <ButtonContainer>
        <RegisterButton
          size="small"
          color={"white"}
          backgroundColor={theme.palette.grey700}
          onClick={handleRegisterButtonClick}
          disabled={!hasRegisterReady ? true : false}
          className={!hasRegisterReady ? "negative" : ""}
        >
          등록
        </RegisterButton>
        <CancelButton size="small" onClick={handleCancelButtonClick}>
          취소
        </CancelButton>
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

const CancelButton = styled(Button)`
  margin-left: 16px;
`;

export default ShipmentTemplateForm;
