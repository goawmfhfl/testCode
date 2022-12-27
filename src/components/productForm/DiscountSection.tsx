import React from "react";
import styled from "styled-components/macro";
import { useFormContext, Controller } from "react-hook-form";
import { format, compareAsc } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import Checkbox from "@components/common/input/Checkbox";

import {
  PRODUCT_PRICE,
  DISCOUNT_AMOUNT,
  DISCOUNT_OPTION,
  DISCOUNT_STARTS_AT,
  DISCOUNT_ENDS_AT,
  HAS_DISCOUNT_SPAN,
  IS_DISCOUNTED,
} from "@cache/productForm/index";
import { DiscountMethod } from "@models/product";
import { getDiscountedPrice } from "@utils/calculator";

const ProductDiscount = () => {
  const { register, watch, control, setValue } = useFormContext();

  const isDiscounted = watch(IS_DISCOUNTED) as boolean;
  const productPrice = watch(PRODUCT_PRICE) as string;
  const discountOption = watch(DISCOUNT_OPTION) as string;
  const discountAmount = watch(DISCOUNT_AMOUNT) as string;
  const hasDiscountSpan = watch(HAS_DISCOUNT_SPAN) as boolean;
  const discountStartsAt = watch(DISCOUNT_STARTS_AT) as Date;
  const discountEndsAt = watch(DISCOUNT_ENDS_AT) as Date;

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
        {/*

          시작일의 규칙
          - 오늘보다 이전 날짜는 선택할 수 없다
          - 종료일보다 이후의 날짜는 선택할 수 없다

        */}
        <Controller
          control={control}
          name={DISCOUNT_STARTS_AT}
          render={() => (
            <DatePicker
              className="date-picker"
              selected={discountStartsAt}
              placeholderText="할인 시작일을 선택해주세요"
              dateFormat="yyyy-MM-dd"
              onChange={(selectedDate: Date) => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                const isBeforeToday = compareAsc(yesterday, selectedDate) > -1;

                if (isBeforeToday) {
                  alert("오늘보다 이른 날짜를 선택할 수 없습니다");

                  return;
                }

                const result = compareAsc(selectedDate, discountEndsAt) > -1;

                if (result) {
                  alert("할인 종료일보다 이른 날짜를 선택해주세요");

                  return;
                }

                setValue(DISCOUNT_STARTS_AT, selectedDate);
              }}
              disabled={!hasDiscountSpan || !isDiscounted}
            />
          )}
        />
        ~
        {/*

          종료일의 규칙
          - 오늘보다 이전의 날짜는 선택할 수 없다
          - 시작일보다 이전의 날짜는 선택할 수 없다

        */}
        <Controller
          control={control}
          name={DISCOUNT_ENDS_AT}
          render={() => (
            <DatePicker
              className="date-picker"
              selected={discountEndsAt}
              placeholderText="할인 종료일을 선택해주세요"
              dateFormat="yyyy-MM-dd"
              onChange={(selectedDate: Date) => {
                const isAfterDiscountStarts =
                  compareAsc(discountStartsAt, selectedDate) > -1;

                if (isAfterDiscountStarts) {
                  alert("할인 시작일보다 늦은 날짜를 선택해주세요");

                  return;
                }

                setValue(DISCOUNT_ENDS_AT, selectedDate);
              }}
              disabled={!hasDiscountSpan || !isDiscounted || !discountStartsAt}
            />
          )}
        />
      </CalendarContainer>

      <HorizontalLine />

      <DiscountedPrice>
        최종 가격
        <PriceWrapper>
          {isDiscounted && discountAmount ? (
            <>
              {`${Number(
                getDiscountedPrice(
                  Number(productPrice),
                  Number(discountAmount),
                  discountOption
                )
              ).toLocaleString()}원`}
            </>
          ) : (
            <>{`${Number(productPrice ?? 0)?.toLocaleString() || ""}원`}</>
          )}
        </PriceWrapper>
        {hasDiscountSpan && (
          <DiscountTimespanNotification>
            <>
              {"("}
              {discountStartsAt
                ? format(new Date(discountStartsAt), "yyyy-MM-dd")
                : "-"}{" "}
              부터{" "}
              {discountEndsAt
                ? format(new Date(discountEndsAt), "yyyy-MM-dd")
                : "-"}{" "}
              까지 할인됩니다.
              {")"}
            </>
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
  justify-content: flex-start;
  align-items: center;
  margin-top: 24px;

  & > div.react-datepicker-wrapper {
    margin-right: 16px;
  }

  & > div + div.react-datepicker-wrapper {
    margin-left: 16px;
  }
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
