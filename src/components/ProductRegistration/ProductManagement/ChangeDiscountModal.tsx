import React from "react";
import styled from "styled-components";
import {
  FormProvider,
  useForm,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";
import { modalVar, systemModalVar } from "@cache/index";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import {
  DISCOUNT_AMOUNT,
  DISCOUNT_ENDS_AT,
  DISCOUNT_OPTION,
  DISCOUNT_STARTS_AT,
  HAS_DISCOUNT_SPAN,
} from "@cache/productRegistration";
import { DiscountMethod } from "@models/productRegistration";
import Checkbox from "@components/common/input/Checkbox";
import DateInput from "@components/common/input/DateInput";
import { useMutation, useReactiveVar, useLazyQuery } from "@apollo/client";
import {
  ChangeProductsInfoInputType,
  ChangeProductsInfoType,
  CHANGE_PRODUCTS_INFO,
} from "@graphql/mutations/changeProductsInfo";

import {
  selectedProductListVar,
  getProductBySellerVar,
  filterOptionStatusVar,
  filterOptionSkipQuantityVar,
  checkAllBoxStatusVar,
  filterOptionQueryVar,
  showHasServerErrorModal,
} from "@cache/ProductManagement";
import GET_ALL_PRODUCTS_BY_SELLER, {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
} from "@graphql/queries/getAllProductsBySeller";

const ChangeDiscountModal = () => {
  const method = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { register, watch, control, getValues } = method;

  const filterOptionStatus: string | null = useReactiveVar(
    filterOptionStatusVar
  );
  const filterOptionSkipQuantity: number = useReactiveVar(
    filterOptionSkipQuantityVar
  );
  const filterQuery = useReactiveVar(filterOptionQueryVar);

  const selectedProdcutList = useReactiveVar(selectedProductListVar);
  const selectedProductListIds: Array<number> = selectedProdcutList.map(
    (list) => list.id
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

  const [getProductList] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: {
        page: 1,
        skip: filterOptionSkipQuantity,
        status: filterOptionStatus,
        query: filterQuery,
      },
    },
  });

  const [updateDiscount] = useMutation<
    ChangeProductsInfoType,
    ChangeProductsInfoInputType
  >(CHANGE_PRODUCTS_INFO, {
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: {
            page: 1,
            skip: filterOptionSkipQuantity,
            status: filterOptionStatus,
            query: filterQuery,
          },
        },
      },
      "GetAllProductsBySeller",
    ],
    fetchPolicy: "no-cache",
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
        description: <>할인율을 선택해주세요</>,
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
        description: <>할인기간을 설정해주세요</>,
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
          {selectedProdcutList.length}개 상품의 할인율을
          <br />
          이대로 변경하시겠습니까?
        </>
      ),
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
          const {
            data: {
              changeProductsInfo: { ok, error },
            },
          } = await updateDiscount({
            variables: {
              input: {
                productIds: selectedProductListIds,
                discountAmount,
                discountMethod: discountOption,
                startDiscountDate: discountStartsAt ? discountStartsAt : null,
                endDiscountDate: discountEndsAt ? discountStartsAt : null,
              },
            },
          });

          if (ok) {
            const {
              data: {
                getAllProductsBySeller: {
                  products,
                  ok: refetchOk,
                  error: refetchError,
                },
              },
            } = await getProductList();

            if (refetchOk) {
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: <>할인율이 변경되었습니다</>,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,

                confirmButtonClickHandler: () => {
                  getProductBySellerVar(
                    products.map((list) => ({ ...list, isChecked: false }))
                  );

                  modalVar({
                    ...modalVar(),
                    isVisible: false,
                  });

                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });

                  selectedProductListVar([]);
                  checkAllBoxStatusVar(false);
                },
              });
            }

            if (refetchError) {
              showHasServerErrorModal(refetchError);
            }
          }

          if (error) {
            showHasServerErrorModal(error);
          }
        })();
      },
    });
  };

  return (
    <FormProvider {...method}>
      <Container>
        <CloseButton onClick={handleCloseButtonClick}>X</CloseButton>
        <Title>할인율 변경하기</Title>
        <Notice>상품 다중 선택 후 할인율 변경시 일괄 변경됩니다.</Notice>
        <InputContainer>
          <Label>할인율</Label>
          <TextInput
            register={register(DISCOUNT_AMOUNT)}
            numbersOnly={true}
            placeholder={"숫자만 입력"}
          />
          <DropdownWrapper>
            <Dropdown
              register={register(DISCOUNT_OPTION)}
              size={"medium"}
              // eslint-disable-next-line
              options={[
                { name: "%", value: DiscountMethod.PERCENT },
                { name: "₩", value: DiscountMethod.WON },
              ]}
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
              />
            )}
          />
          기간할인 설정 하기
        </InputContainer>

        <CalendarContainer>
          <Label>할인 기간</Label>
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
          <Button onClick={updateDiscountClick}>확인</Button>
          <Button onClick={handleCloseButtonClick}>취소</Button>
        </ButtonContainer>
      </Container>
    </FormProvider>
  );
};

const Container = styled.div`
  padding: 1rem;
  background-color: #f8ede3;
`;

const CloseButton = styled.div`
  padding: 1rem;
  background-color: #dfd3c3;
`;

const Title = styled.div`
  padding: 1rem;
  background-color: #d0b8a8;
`;

const Notice = styled.div`
  padding: 1rem;
  background-color: #7d6e83;
`;

const ButtonContainer = styled.div`
  padding: 1rem;
  background-color: #f8ede3;
  display: flex;
`;

const Button = styled.div`
  padding: 1rem;
  background-color: #dfd3c3;
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
const Label = styled.div``;

const DropdownWrapper = styled.div`
  margin-left: 16px;
  margin-right: 8px;
`;

const DiscountSpanCheckbox = styled(Checkbox)``;

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
}>``;

export default ChangeDiscountModal;
