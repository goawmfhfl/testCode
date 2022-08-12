import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/macro";
import { useFormContext } from "react-hook-form";
import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";

import NumberInput from "@components/common/input/NumberInput";
import Dropdown from "@components/common/input/Dropdown";
import Button from "@components/common/Button";
import ShipmentChargeTemplateModal from "@components/ProductRegistration/ShipmentChargeTemplateModal";
import { modalVar } from "@cache/index";
import { shipmentTemplatesVar } from "@cache/productRegistration/shipmentTemplate";
import {
  CreateShipmentInputType,
  ShipmentChargeType,
} from "@models/shipmentTemplate";

const GET_SHIPMENT_TEMPLATES = gql`
  query GetAllShipmentTemplates {
    getUserShipmentTemplates {
      ok
      error
      shipmentTemplates {
        id
        name
        createdAt
        updatedAt
        type
        price
        distantPrice
        returnPrice
        exchangePrice
        isBundleShipment
      }
    }
  }
`;

const ProductShipmentCharge = () => {
  const theme = useTheme();
  const { register, setValue, watch } = useFormContext();

  const [hasTemplateSelected, setHasTemplateSelected] = useState(false);
  const shipmentTemplates = useReactiveVar(shipmentTemplatesVar);
  const modal = useReactiveVar(modalVar);

  const [getShipmentTemplates, { loading }] = useLazyQuery<{
    getUserShipmentTemplates: {
      ok: boolean;
      error: string;
      shipmentTemplates: Array<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: ShipmentChargeType;
        name: string;
        price: number;
        distantPrice: number;
        returnPrice: number;
        exchangePrice: number;
        isBundleShipment: boolean;
      }>;
    };
  }>(GET_SHIPMENT_TEMPLATES);

  const handleShipmentChargeTemplateButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    modalVar({
      ...modalVar(),
      isVisible: true,
      component: <ShipmentChargeTemplateModal />,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line
    (async function () {
      const { data } = await getShipmentTemplates();

      const {
        getUserShipmentTemplates: { shipmentTemplates },
      } = data || { getUserShipmentTemplates: {} };

      console.log("결과물!", shipmentTemplates);

      shipmentTemplatesVar([...shipmentTemplates]);
    })();
  }, [modal.isVisible]);

  const options = [
    ...shipmentTemplates.map((template) => template.name),
    "템플릿 선택 안함",
  ];

  const selectedTemplateName = watch("shipmentTemplate") as string;

  useEffect(() => {
    const selectedTemplate: CreateShipmentInputType = shipmentTemplates.find(
      (template) => template.name === selectedTemplateName
    );

    if (!selectedTemplate) {
      setValue("isBundlingEnabled", "불가능");
      setValue("shipmentChargeOption", "무료");
      setValue("shipmentChargeValue", 0);
      setValue("additionalCharge", 0);
      setValue("returnCharge", 0);
      setValue("exchangeCharge", 0);

      setHasTemplateSelected(false);

      return;
    }

    const {
      type,
      price,
      isBundleShipment,
      distantPrice,
      returnPrice,
      exchangePrice,
    } = selectedTemplate;

    setValue("isBundlingShipmentEnabled", isBundleShipment ? "가능" : "불가능");
    setValue(
      "shipmentChargeOption",
      type === ShipmentChargeType.Free ? "무료" : "유료"
    );
    setValue("shipmentChargeValue", price);
    setValue("additionalCharge", distantPrice);
    setValue("returnCharge", returnPrice);
    setValue("exchangeCharge", exchangePrice);

    setHasTemplateSelected(true);
  }, [selectedTemplateName]);

  return (
    <Container>
      <InputContainer>
        <Label>배송 템플릿</Label>

        <DropdownWrapper>
          <Dropdown
            register={register("shipmentTemplate")}
            size="medium"
            options={options}
            disabled={loading}
          />
        </DropdownWrapper>

        <Button
          size="small"
          color="white"
          backgroundColor={`${theme.palette.grey700}`}
          onClick={handleShipmentChargeTemplateButtonClick}
        >
          배송 템플릿
        </Button>
      </InputContainer>

      <InputContainer>
        <Label>묶음 배송</Label>

        <RadioInputContainer>
          <label htmlFor="bundling-enabled">가능</label>
          <input
            {...register("isBundlingShipmentEnabled")}
            type="radio"
            name="isBundlingEnabled"
            id="bundling-enabled"
            value="가능"
            disabled={hasTemplateSelected}
          />

          <label htmlFor="bundling-disabled">불가능</label>
          <input
            {...register("isBundlingShipmentEnabled")}
            type="radio"
            name="isBundlingEnabled"
            id="bundling-disabled"
            value="불가능"
            disabled={hasTemplateSelected}
          />
        </RadioInputContainer>
      </InputContainer>

      <InputContainer>
        <Label>배송비 ●</Label>
        <ShipmentChargeInputContainer>
          <Dropdown
            register={register("shipmentChargeOption")}
            size="medium"
            width="160px"
            options={["유료", "무료"]}
            disabled={hasTemplateSelected}
          />

          <NumberInputContainer>
            <NumberInputWrapper>
              <NumberInput
                width="138px"
                {...register("shipmentChargeValue", {
                  valueAsNumber: true,
                })}
                min={0}
                step={1000}
                placeholder={"숫자만 입력"}
                value={
                  watch("shipmentChargeOption") === "유료"
                    ? Number(watch("shipmentChargeValue")).toString()
                    : 0
                }
                disabled={
                  hasTemplateSelected ||
                  watch("shipmentChargeOption") === "무료"
                }
              />
            </NumberInputWrapper>
            원
          </NumberInputContainer>
        </ShipmentChargeInputContainer>
      </InputContainer>

      <InputContainer>
        <Label>제주 도서산간 추가 배송비 ●</Label>

        <NumberInputContainer>
          <NumberInputWrapper>
            <NumberInput
              {...register("additionalCharge", {
                valueAsNumber: true,
              })}
              placeholder={"숫자만 입력"}
              min={0}
              step={1000}
              value={Number(watch("additionalCharge")).toString()}
              disabled={hasTemplateSelected}
            />
          </NumberInputWrapper>
          원
        </NumberInputContainer>
      </InputContainer>

      <InputContainer>
        <Label>반품/교환 ●</Label>

        <ReturnExchangeFeeInputContainer>
          <NumberInputContainer>
            반품배송비(편도)
            <NumberInputWrapper hasLeftMargin={true}>
              <NumberInput
                {...register("returnCharge", {
                  valueAsNumber: true,
                })}
                placeholder={"숫자만 입력"}
                min={0}
                step={1000}
                value={Number(watch("returnCharge")).toString()}
                disabled={hasTemplateSelected}
              />{" "}
            </NumberInputWrapper>
            원
          </NumberInputContainer>

          <NumberInputContainer>
            교환배송비(왕복)
            <NumberInputWrapper hasLeftMargin={true}>
              <NumberInput
                {...register("exchangeCharge", {
                  valueAsNumber: true,
                })}
                placeholder={"숫자만 입력"}
                min={0}
                step={1000}
                value={Number(watch("exchangeCharge")).toString()}
                disabled={hasTemplateSelected}
              />{" "}
            </NumberInputWrapper>
            원
          </NumberInputContainer>
        </ReturnExchangeFeeInputContainer>
      </InputContainer>
    </Container>
  );
};

const Container = styled.div``;

export const InputContainer = styled.div`
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

export const DropdownWrapper = styled.span`
  margin-right: 9px;
`;

export const RadioInputContainer = styled.div`
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

export const ShipmentChargeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReturnExchangeFeeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  width: 230px;
  margin-top: 8px;

  font-family: Spoqa Han Sans Neo;
  font-size: 13px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

export const NumberInputContainer = styled.div`
  display: flex;
  align-items: center;

  margin-top: 9px;
`;

export const NumberInputWrapper = styled.div<{
  hasLeftMargin?: boolean;
}>`
  margin-left: ${({ hasLeftMargin }) => (hasLeftMargin ? "8px" : "")};
`;

export default ProductShipmentCharge;
