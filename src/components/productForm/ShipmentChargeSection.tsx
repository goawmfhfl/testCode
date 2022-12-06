import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components/macro";
import { useFormContext } from "react-hook-form";
import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import Radio from "@components/common/input/Radio";
import Button from "@components/common/Button";
import ShipmentChargeTemplateModal from "@components/productForm/ShipmentChargeTemplateModal";

import { modalVar } from "@cache/index";
import {
  SHIPMENT_TEMPLATE_ID,
  SHIPMENT_TEMPLATE_NAME,
  IS_BUNDLE_SHIPMENT,
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  SHIPMENT_RETURN_PRICE,
  SHIPMENT_EXCHANGE_PRICE,
} from "@cache/productForm/index";
import { shipmentTemplatesVar } from "@cache/productForm/shipmentTemplate";

import {
  CreateShipmentInputType,
  ShipmentChargeType,
} from "@models/product/shipmentTemplate";

const GET_SHIPMENT_TEMPLATES = gql`
  query GetUserShipmentTemplates {
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

const ShipmentChargeSection = () => {
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

      if (!shipmentTemplates) return;

      shipmentTemplatesVar([...shipmentTemplates]);
    })();
  }, [modal.isVisible]);

  const shipmentTemplateId = watch(SHIPMENT_TEMPLATE_ID) as number;
  const shipmentTemplateName = watch(SHIPMENT_TEMPLATE_NAME) as string;

  useEffect(() => {
    // eslint-disable-next-line
    (async () => {
      const {
        data: {
          getUserShipmentTemplates: { shipmentTemplates },
        },
      } = await getShipmentTemplates();

      const selectedTemplate: CreateShipmentInputType = shipmentTemplates.find(
        (template) => template.id === shipmentTemplateId
      );

      if (!selectedTemplate) return;

      setValue(SHIPMENT_TEMPLATE_NAME, selectedTemplate.name);
    })();
  }, [shipmentTemplateId]);

  useEffect(() => {
    // eslint-disable-next-line
    (async () => {
      const {
        data: {
          getUserShipmentTemplates: { shipmentTemplates },
        },
      } = await getShipmentTemplates();

      const selectedTemplate: CreateShipmentInputType = shipmentTemplates.find(
        (template) => template.name === shipmentTemplateName
      );

      if (!selectedTemplate) {
        setHasTemplateSelected(false);
        return;
      }

      const {
        id,
        type,
        price,
        isBundleShipment,
        distantPrice,
        returnPrice,
        exchangePrice,
      } = selectedTemplate;

      setValue(SHIPMENT_TEMPLATE_ID, id);
      setValue(IS_BUNDLE_SHIPMENT, isBundleShipment ? "가능" : "불가능");
      setValue(
        SHIPMENT_PRICE_TYPE,
        type === ShipmentChargeType.Free
          ? ShipmentChargeType.Free
          : ShipmentChargeType.Charged
      );
      setValue(SHIPMENT_PRICE, price);
      setValue(SHIPMENT_DISTANT_PRICE, distantPrice);
      setValue(SHIPMENT_RETURN_PRICE, returnPrice);
      setValue(SHIPMENT_EXCHANGE_PRICE, exchangePrice);

      setHasTemplateSelected(true);
    })();
  }, [shipmentTemplateName]);

  const isShipmentChargeFree =
    watch(SHIPMENT_PRICE_TYPE) === ShipmentChargeType.Free;

  useEffect(() => {
    if (isShipmentChargeFree) {
      setValue(SHIPMENT_PRICE, 0);
    }
  }, [isShipmentChargeFree]);

  return (
    <Container>
      <InputContainer>
        <Label>배송 템플릿</Label>

        <DropdownWrapper>
          <Dropdown
            register={{
              ...register(SHIPMENT_TEMPLATE_NAME),
              // eslint-disable-next-line
              onChange: async (e: React.ChangeEvent<HTMLSelectElement>) => {
                setValue(SHIPMENT_TEMPLATE_NAME, e.target.value);

                const selectedTemplate: CreateShipmentInputType =
                  shipmentTemplates.find(
                    (template) => template.name === e.target.value
                  );
                setValue(SHIPMENT_TEMPLATE_ID, selectedTemplate.id);

                if (!selectedTemplate) {
                  setValue(SHIPMENT_TEMPLATE_ID, null);
                  setValue(SHIPMENT_PRICE_TYPE, ShipmentChargeType.Charged);
                  setValue(SHIPMENT_PRICE, null);
                  setValue(SHIPMENT_DISTANT_PRICE, null);
                  setValue(SHIPMENT_RETURN_PRICE, null);
                  setValue(SHIPMENT_EXCHANGE_PRICE, null);
                }
              },
            }}
            size="medium"
            options={[
              { name: "템플릿 선택 안함", value: "" },
              ...shipmentTemplates.map(({ name }) => ({
                name,
                value: name,
              })),
            ]}
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
          <Radio
            {...register(IS_BUNDLE_SHIPMENT)}
            type="radio"
            name={IS_BUNDLE_SHIPMENT}
            id="bundling-enabled"
            value="가능"
            disabled={hasTemplateSelected}
          />

          <label htmlFor="bundling-disabled">불가능</label>
          <Radio
            {...register(IS_BUNDLE_SHIPMENT)}
            type="radio"
            name={IS_BUNDLE_SHIPMENT}
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
            register={register(SHIPMENT_PRICE_TYPE)}
            size="medium"
            width="160px"
            options={[
              {
                name: "유료",
                value: ShipmentChargeType.Charged,
              },
              { name: "무료", value: ShipmentChargeType.Free },
            ]}
            disabled={hasTemplateSelected}
          />

          <TextInputContainer>
            <TextInputWrapper>
              <TextInput
                width="138px"
                register={register(SHIPMENT_PRICE, {
                  valueAsNumber: true,
                })}
                placeholder={"숫자만 입력"}
                numbersOnly={true}
                disabled={hasTemplateSelected || isShipmentChargeFree}
              />
            </TextInputWrapper>
            원
          </TextInputContainer>
        </ShipmentChargeInputContainer>
      </InputContainer>

      <InputContainer>
        <Label>제주 도서산간 추가 배송비 ●</Label>

        <TextInputContainer>
          <TextInputWrapper>
            <TextInput
              register={register(SHIPMENT_DISTANT_PRICE)}
              placeholder={"숫자만 입력"}
              disabled={hasTemplateSelected}
              numbersOnly={true}
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
                register={register(SHIPMENT_RETURN_PRICE)}
                placeholder={"숫자만 입력"}
                disabled={hasTemplateSelected}
                numbersOnly={true}
              />{" "}
            </TextInputWrapper>
            원
          </TextInputContainer>

          <TextInputContainer>
            교환배송비(왕복)
            <TextInputWrapper hasLeftMargin={true}>
              <TextInput
                register={register(SHIPMENT_EXCHANGE_PRICE)}
                placeholder={"숫자만 입력"}
                disabled={hasTemplateSelected}
                numbersOnly={true}
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

export const TextInputContainer = styled.div`
  display: flex;
  align-items: center;

  margin-top: 9px;
`;

export const TextInputWrapper = styled.div<{
  hasLeftMargin?: boolean;
}>`
  margin-left: ${({ hasLeftMargin }) => (hasLeftMargin ? "8px" : "")};
`;

export default ShipmentChargeSection;
