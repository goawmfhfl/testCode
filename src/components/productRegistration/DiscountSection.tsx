import React from "react";
import styled from "styled-components/macro";
import {
  useFormContext,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import DateInput from "@components/common/input/DateInput";
import Checkbox from "@components/common/input/Checkbox";

import {
  PRODUCT_PRICE,
  DISCOUNT_AMOUNT,
  DISCOUNT_OPTION,
  DISCOUNT_STARTS_AT,
  DISCOUNT_ENDS_AT,
  HAS_DISCOUNT_SPAN,
  IS_DISCOUNTED,
} from "@cache/productRegistration/index";
import { DiscountMethod } from "@models/productRegistration";
import { getDiscountedPrice } from "@utils/productRegistration";

const ProductDiscount = () => {
  const { register, watch, control, getValues } = useFormContext();

  const isDiscounted = watch(IS_DISCOUNTED) as boolean;
  const productPrice = watch(PRODUCT_PRICE) as string;
  const discountOption = watch(DISCOUNT_OPTION) as string;
  const discountAmount = watch(DISCOUNT_AMOUNT) as string;
  const hasDiscountSpan = watch(HAS_DISCOUNT_SPAN) as boolean;
  const discountStartsAt = watch(DISCOUNT_STARTS_AT) as boolean;
  const discountEndsAt = watch(DISCOUNT_ENDS_AT) as boolean;

  return (
    <Container>
      <InputContainer>
        <DiscountCheckbox {...register(IS_DISCOUNTED)} /> 할인 설정하기
      </InputContainer>

      <InputContainer>
        <TextInput
          register={register(DISCOUNT_AMOUNT)}
          numbersOnly={true}
          placeholder={"숫자만 입력"}
          width={"112px"}
          disabled={!isDiscounted}
        />
        <DropdownWrapper>
          <Dropdown
            size={"medium"}
            // eslint-disable-next-line
            options={[
              { name: "%", value: DiscountMethod.PERCENT },
              { name: "₩", value: DiscountMethod.WON },
            ]}
            register={register(DISCOUNT_OPTION)}
            disabled={!isDiscounted}
          />
        </DropdownWrapper>
        할인
        <Controller
          control={control}
          name={HAS_DISCOUNT_SPAN}
          defaultValue={false}
          render={({
            field: { onChange, onBlur, value, ref },
          }: {
            field: {
              onChange: () => void;
              onBlur: () => void;
              value: boolean;
              ref: React.RefCallback<HTMLInputElement>;
            };
          }) => (
            <DiscountSpanCheckbox
              onChange={onChange}
              onBlur={onBlur}
              checked={value}
              ref={ref}
              disabled={!isDiscounted}
            />
          )}
        />
        기간할인 설정하기
      </InputContainer>

      <CalendarContainer>
        {/* TODO: Controller 필요성 검토 */}
        <Controller
          control={control}
          name={DISCOUNT_STARTS_AT}
          defaultValue={""}
          render={({
            field: { onChange, onBlur, value },
          }: {
            field: ControllerRenderProps<Record<string, string>>;
          }) => {
            return (
              <StartAt
                onBlur={onBlur}
                onChange={(e) => {
                  const {
                    target: { value },
                  } = e;

                  const startAt = new Date(value).getTime();
                  const endAt = new Date(
                    watch(DISCOUNT_ENDS_AT) as string
                  ).getTime();
                  const today = new Date().getTime();

                  const isBeforeToday = startAt < today;

                  if (isBeforeToday) {
                    return;
                  }

                  if (startAt > endAt) return;

                  onChange(e);
                }}
                value={value}
                disabled={!hasDiscountSpan || !isDiscounted}
              />
            );
          }}
        />
        ~
        <Controller
          control={control}
          name={DISCOUNT_ENDS_AT}
          defaultValue={""}
          render={({
            field: { onChange, onBlur, value, ref },
          }: {
            field: ControllerRenderProps<Record<string, string>>;
          }) => {
            return (
              <EndAt
                onBlur={onBlur}
                onChange={(e) => {
                  const {
                    target: { value },
                  } = e;

                  const startAt = new Date(
                    getValues(DISCOUNT_STARTS_AT) as string
                  ).getTime();
                  const endAt = new Date(value).getTime();
                  const today = new Date().getTime();

                  const isBeforeToday = endAt < today;

                  if (isBeforeToday) {
                    return;
                  }

                  if (startAt > endAt) return;

                  onChange(e);
                }}
                value={value}
                disabled={!hasDiscountSpan || !isDiscounted}
                inputRef={ref}
              />
            );
          }}
        />
      </CalendarContainer>

      <HorizontalLine />

      <DiscountedPrice>
        최종 가격
        <PriceWrapper>
          {isDiscounted &&
            discountAmount &&
            `${getDiscountedPrice(
              Number(productPrice),
              Number(discountAmount),
              discountOption
            ).toLocaleString()}원`}
        </PriceWrapper>
        {hasDiscountSpan && (
          <DiscountTimespanNotification>
            ({discountStartsAt ? discountStartsAt : "-"} 부터{" "}
            {discountEndsAt ? discountEndsAt : "-"} 까지 할인됩니다.)
          </DiscountTimespanNotification>
        )}
      </DiscountedPrice>
    </Container>
  );
};

const Container = styled.div`
  & > div:first-child {
    margin-bottom: 16px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;

  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
`;

const DiscountCheckbox = styled(Checkbox)`
  margin-right: 8px;
`;

const DropdownWrapper = styled.span`
  margin-left: 16px;
  margin-right: 8px;
`;

const DiscountSpanCheckbox = styled(Checkbox)`
  margin-left: 24px;
  margin-right: 8px;
`;

const CalendarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
`;

const StartAt = styled(DateInput)`
  margin-right: 16px;
  width: 112px;
`;
const EndAt = styled(DateInput)<{
  inputRef: React.RefCallback<HTMLInputElement>;
}>`
  margin-left: 16px;
  width: 112px;
`;

const HorizontalLine = styled.div`
  height: 1px;
  margin: 24px 0px;
  background-color: ${({ theme: { palette } }) => palette.grey500}; ;
`;

const DiscountedPrice = styled.div`
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
  letter-spacing: 0.1px;
`;

const PriceWrapper = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;

  margin-left: 65px;
  margin-right: 8px;
`;

const DiscountTimespanNotification = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

export default ProductDiscount;
