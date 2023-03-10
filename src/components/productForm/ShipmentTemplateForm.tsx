import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import Button from "@components/common/Button";
import { Input as TextInput } from "@components/common/input/TextInput";
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
} from "@components/productForm/ShipmentChargeSection";
import closeIconSource from "@icons/delete.svg";
import downwordArrowMedium from "@icons/arrow-downward-medium.svg";
import { preventNaNValues } from "@utils/index";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import { loadingSpinnerVisibilityVar, overModalVar } from "@cache/index";
import { shipmentTemplateVar } from "@cache/productForm/shipmentTemplate";
import validateInputFulfillment from "@utils/shopSettings/validateInputFulfillment";

const ShipmentTemplateForm = ({
  formTitle,
  handleRegisterButtonClick,
  handleCancelButtonClick,
  isRegistering,
}: {
  formTitle: string;
  handleRegisterButtonClick: () => void;
  handleCancelButtonClick: () => void;
  isRegistering: boolean;
}) => {
  const theme = useTheme();
  const shipmentTemplate = useReactiveVar(shipmentTemplateVar);
  const [hasRegisterReady, setHasRegisterReady] = useState<boolean>(false);

  useEffect(() => {
    const allowsZeroInputNames: Array<string> = [];

    if (shipmentChargeType === ShipmentChargeType.Free) {
      allowsZeroInputNames.push("shipmentCharge");
    }

    const { isFulfilled } = validateInputFulfillment(
      shipmentTemplate,
      [],
      allowsZeroInputNames
    );

    if (isFulfilled) {
      setHasRegisterReady(true);
    } else {
      setHasRegisterReady(false);
    }
  }, [shipmentTemplate]);

  useEffect(() => {
    if (isRegistering) {
      loadingSpinnerVisibilityVar(true);
    } else {
      loadingSpinnerVisibilityVar(false);
    }
  }, [isRegistering]);

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
          [inputName]: e.target.value === "??????" ? true : false,
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
        [inputName]: e.target.value,
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
          <Label>?????? ????????????</Label>

          <TextInput value={name} onChange={handleInputChange("name")} />
        </InputContainer>

        <InputContainer>
          <Label>?????? ??????</Label>

          <RadioInputContainer>
            <label htmlFor="bundling-enabled">??????</label>
            <input
              type="radio"
              name="isBundlingEnabled"
              id="bundling-enabled"
              value="??????"
              onChange={handleInputChange("isBundlingEnabled")}
              checked={isBundlingEnabled}
            />

            <label htmlFor="bundling-disabled">?????????</label>
            <input
              type="radio"
              name="isBundlingEnabled"
              id="bundling-disabled"
              value="?????????"
              onChange={handleInputChange("isBundlingEnabled")}
              checked={!isBundlingEnabled}
            />
          </RadioInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>?????????</Label>
          <ShipmentChargeInputContainer>
            <Dropdown
              width="160px"
              sizing="medium"
              arrowSrc={downwordArrowMedium}
              onChange={handleInputChange("shipmentChargeType")}
            >
              <DropdownOption value={ShipmentChargeType.Free}>
                ??????
              </DropdownOption>
              <DropdownOption value={ShipmentChargeType.Charged}>
                ??????
              </DropdownOption>
            </Dropdown>

            <TextInputContainer>
              <TextInputWrapper hasLeftMargin={false}>
                <TextInput
                  width={"138px"}
                  value={shipmentCharge}
                  disabled={shipmentChargeType === ShipmentChargeType.Free}
                  onChange={handleInputChange("shipmentCharge")}
                  onKeyDown={preventNaNValues}
                  placeholder={"????????? ??????"}
                />
              </TextInputWrapper>
              ???
            </TextInputContainer>
          </ShipmentChargeInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>?????? ???????????? ?????? ?????????</Label>

          <TextInputContainer>
            <TextInputWrapper>
              <TextInput
                value={additionalCharge}
                onChange={handleInputChange("additionalCharge")}
                onKeyDown={preventNaNValues}
                placeholder="????????? ??????"
              />
            </TextInputWrapper>
            ???
          </TextInputContainer>
        </InputContainer>

        <InputContainer>
          <Label>??????/??????</Label>

          <ReturnExchangeFeeInputContainer>
            <TextInputContainer>
              ???????????????(??????)
              <TextInputWrapper hasLeftMargin={true}>
                <TextInput
                  value={returnCharge}
                  onChange={handleInputChange("returnCharge")}
                  onKeyDown={preventNaNValues}
                  placeholder="????????? ??????"
                />{" "}
              </TextInputWrapper>
              ???
            </TextInputContainer>

            <TextInputContainer>
              ???????????????(??????)
              <TextInputWrapper hasLeftMargin={true}>
                <TextInput
                  value={exchangeCharge}
                  onChange={handleInputChange("exchangeCharge")}
                  onKeyDown={preventNaNValues}
                  placeholder="????????? ??????"
                />{" "}
              </TextInputWrapper>
              ???
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
          disabled={!hasRegisterReady ? true : false}
          className={!hasRegisterReady ? "negative" : ""}
        >
          ??????
        </RegisterButton>
        <CancelButton size="small" onClick={handleCancelButtonClick}>
          ??????
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
