import React from "react";
import styled from "styled-components/macro";
import {
  FormProvider,
  useForm,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  modalVar,
  systemModalVar,
  checkAllBoxStatusVar,
  loadingSpinnerVisibilityVar,
} from "@cache/index";

import {
  showHasServerErrorModal,
  filterOptionVar,
  checkedProductsVar,
} from "@cache/productManagement";

import {
  DISCOUNT_AMOUNT,
  DISCOUNT_ENDS_AT,
  DISCOUNT_OPTION,
  DISCOUNT_STARTS_AT,
  HAS_DISCOUNT_SPAN,
} from "@cache/productForm";
import { DiscountMethod } from "@models/product";
import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import Checkbox from "@components/common/input/Checkbox";
import Button from "@components/common/Button";
import DateInput from "@components/common/input/DateInput";
import NoticeContainer from "@components/common/NoticeContainer";

import {
  ChangeProductsInfoBySellerInputType,
  ChangeProductsInfoBySellerType,
  CHANGE_PRODUCTS_INFO_BY_SELLER,
} from "@graphql/mutations/changeProductsInfoBySeller";

import { GET_PRODUCTS_BY_SELLER } from "@graphql/queries/getProductsBySeller";

import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";

import { getTodayTimeValue } from "@utils/date";
import { CaculatedProductsType } from "@models/product/management";

const ChangeDiscountModal = () => {
  const method = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { register, watch, control, getValues } = method;

  const filterOption = useReactiveVar(filterOptionVar);

  const checkedProducts: Array<CaculatedProductsType> =
    useReactiveVar(checkedProductsVar);

  const checkedProductIds: Array<number> = checkedProducts?.map(
    ({ productId }) => productId
  );

  const discountAmount: number | string = Number(
    watch(DISCOUNT_AMOUNT) as string
  );
  const discountOption: string =
    (watch(DISCOUNT_OPTION) as string) || DiscountMethod.PERCENT;
  const hasDiscountSpan: boolean =
    (watch(HAS_DISCOUNT_SPAN) as boolean) || false;
  const discountStartsAt: string = watch(DISCOUNT_STARTS_AT) as string;
  const discountEndsAt: string = watch(DISCOUNT_ENDS_AT) as string;

  const [updateDiscount] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_PRODUCTS_BY_SELLER,
        variables: {
          input: filterOption,
        },
      },
      "GetProductsBySeller",
    ],
  });

  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  const updateDiscountClick = () => {
    if (!discountAmount) {
      return systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>???????????? ??????????????????</>,
        confirmButtonVisibility: true,
        cancelButtonVisibility: false,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }

    if (hasDiscountSpan && (!discountStartsAt || !discountEndsAt)) {
      return systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>??????????????? ??????????????????</>,
        confirmButtonVisibility: true,
        cancelButtonVisibility: false,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          {checkedProductIds.length}??? ????????? ????????????
          <br />
          ????????? ?????????????????????????
        </>
      ),

      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            loadingSpinnerVisibilityVar(true);
            const {
              data: {
                changeProductsInfoBySeller: { ok, error },
              },
            } = await updateDiscount({
              variables: {
                input: {
                  productIds: checkedProductIds,
                  discountAmount,
                  discountMethod: discountOption,
                  startDiscountDate: discountStartsAt ? discountStartsAt : null,
                  endDiscountDate: discountEndsAt ? discountStartsAt : null,
                },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: <>???????????? ?????????????????????</>,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,

                confirmButtonClickHandler: () => {
                  modalVar({
                    ...modalVar(),
                    isVisible: false,
                  });

                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });

                  checkedProductsVar([]);
                  checkAllBoxStatusVar(false);
                },
              });
            }

            if (error) {
              loadingSpinnerVisibilityVar(false);
              showHasServerErrorModal(error, "????????? ??????");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "????????? ??????");
        }
      },
    });
  };

  return (
    <FormProvider {...method}>
      <Container>
        <CloseButton onClick={handleCloseButtonClick} src={closeIconSource} />
        <Title>????????? ????????????</Title>
        <NoticeContainer icon={exclamationmarkSrc} width={"305px"}>
          ?????? ?????? ?????? ??? ????????? ????????? ?????? ???????????????.
        </NoticeContainer>
        <InputContainer>
          <Label>?????????</Label>
          <TextInput
            register={register(DISCOUNT_AMOUNT)}
            numbersOnly={true}
            placeholder={"????????? ??????"}
            width={"112px"}
          />
          <DropdownWrapper>
            <Dropdown
              register={register(DISCOUNT_OPTION)}
              size={"medium"}
              // eslint-disable-next-line
              options={[
                { name: "%", value: DiscountMethod.PERCENT },
                { name: "???", value: DiscountMethod.WON },
              ]}
            />
          </DropdownWrapper>
          ??????
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
              />
            )}
          />
          ???????????? ?????? ??????
        </InputContainer>

        <CalendarContainer>
          <Label>?????? ??????</Label>
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

                    const today = getTodayTimeValue();

                    const isBeforeToday = startAt < today;

                    if (isBeforeToday) {
                      return;
                    }
                    if (startAt > endAt) return;

                    onChange(e);
                  }}
                  value={value}
                  disabled={!hasDiscountSpan}
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
                  disabled={!hasDiscountSpan}
                  inputRef={ref}
                />
              );
            }}
          />
        </CalendarContainer>

        <ButtonContainer>
          <StyledButton
            size={"small"}
            className={"positive"}
            onClick={updateDiscountClick}
          >
            ??????
          </StyledButton>
          <Button size={"small"} onClick={handleCloseButtonClick}>
            ??????
          </Button>
        </ButtonContainer>
      </Container>
    </FormProvider>
  );
};

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 40px 24px 24px 24px;
  background-color: ${({ theme: { palette } }) => palette.white};
`;

const CloseButton = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;

  width: 24px;
  height: 24px;

  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 24px;

  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;

  margin-top: 34px;

  font-family: "Spoqa Han Sans Neo";
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;
const Label = styled.span`
  width: 80px;

  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const DropdownWrapper = styled.div`
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

  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
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

const ButtonContainer = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;

export default ChangeDiscountModal;
