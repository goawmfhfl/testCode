import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import ControllerContainer from "@components/sale/ControllerContainer";

import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  paginationSkipVar,
  showHasAnyProblemModal,
  SkipQuantityCache,
  systemModalVar,
} from "@cache/index";
import {
  searchQueryType,
  OrderSearchType,
  OrderStatusType,
  OrderStatusName,
} from "@constants/sale";
import { useMutation, useReactiveVar } from "@apollo/client";
import { checkedOrderItemsVar, reasonVar } from "@cache/sale";
import { filterOptionVar } from "@cache/sale/orderManagement";
import { CONFIRM_ORDERITMES_BY_SELLER } from "@graphql/mutations/confirmOrderItemsBySeller";
import {
  CancelOrderItemsBySellerInputType,
  CancelOrderItemsBySellerType,
  ConfirmOrderItemsBySellerInputType,
  ConfirmOrderItemsBySellerType,
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale";
import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { SEND_ORDERITEMS } from "@graphql/mutations/sendOrderItems";
import { CANCEL_ORDERITEMS_BY_SELLER } from "@graphql/mutations/cancelOrderItemsBySeller";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import { showHasServerErrorModal } from "@cache/productManagement";
import AskReasonModal from "@components/common/AskReasonModal";
import { optionListType } from "@constants/sale/orderManagement";
import { getHasCheckedOrderStatus } from "@utils/sale";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const reason = useReactiveVar(reasonVar);

  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const checkedOrderItemIds = checkedOrderItems.map(
    (orderItem) => orderItem.id
  );

  const {
    isPaymentCompletedChecked,
    isPreparingChecked,
    isShippingChecked,
    isShippingCompletedChecked,
  } = getHasCheckedOrderStatus(checkedOrderItems);

  const [temporaryQuery, setTemporaryQuery] = useState("");

  const [confirmOrderItems] = useMutation<
    ConfirmOrderItemsBySellerType,
    {
      input: ConfirmOrderItemsBySellerInputType;
    }
  >(CONFIRM_ORDERITMES_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type,
            statusName,
            statusType,
            statusGroup,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const [sendOrderItems] = useMutation<
    SendOrderItemsType,
    {
      input: SendOrderItemsInputType;
    }
  >(SEND_ORDERITEMS, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type,
            statusName,
            statusType,
            statusGroup,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const [cancelOrderItems] = useMutation<
    CancelOrderItemsBySellerType,
    {
      input: CancelOrderItemsBySellerInputType;
    }
  >(CANCEL_ORDERITEMS_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type,
            statusName,
            statusType,
            statusGroup,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  //주문확인
  const handleConfirmOrderButtonClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (isPreparingChecked || isShippingChecked || isShippingCompletedChecked) {
      showHasAnyProblemModal(
        <>
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
        </>
      );
      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          선택하신 주문을 <br /> 확인처리 하시겠습니까?
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
                confirmOrderItemsBySeller: { ok, error },
              },
            } = await confirmOrderItems({
              variables: {
                input: {
                  orderItemIds: checkedOrderItemIds,
                },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: (
                  <>
                    주문이 확인되었습니다.
                    <br />
                    (상품준비중에서 처리 가능)
                  </>
                ),
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,
                confirmButtonClickHandler: () => {
                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });

                  checkedOrderItemsVar([]);
                  checkAllBoxStatusVar(false);
                },
              });
            }
            if (error) {
              loadingSpinnerVisibilityVar(false);
              showHasServerErrorModal(error, "주문 확인");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "주문 확인");
        }
      },
    });
  };

  //발송처리
  const handleSendButtonClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (
      isPaymentCompletedChecked ||
      isShippingChecked ||
      isShippingCompletedChecked
    ) {
      showHasAnyProblemModal(
        <>
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
        </>
      );
      return;
    }

    const { isShipmentCompanyFullFilled, isShipmentNumberFullFilled } =
      checkedOrderItems.reduce(
        (result, { temporaryShipmentCompany, temporaryShipmentNumber }) => {
          if (temporaryShipmentCompany === "")
            result.isShipmentCompanyFullFilled = false;
          if (temporaryShipmentNumber === "")
            result.isShipmentCompanyFullFilled = false;

          return result;
        },
        {
          isShipmentCompanyFullFilled: true,
          isShipmentNumberFullFilled: true,
        }
      );

    if (!isShipmentCompanyFullFilled || !isShipmentNumberFullFilled) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        icon: exclamationmarkSrc,
        description: <>송장정보를 기입해주세요</>,
        cancelButtonVisibility: false,
        confirmButtonVisibility: true,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
            icon: "",
          });
        },
      });

      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          해당 주문을 <br />
          발송처리 하시겠습니까?
        </>
      ),
      cancelButtonVisibility: true,
      confirmButtonVisibility: true,
      confirmButtonClickHandler: () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            loadingSpinnerVisibilityVar(true);

            const {
              data: {
                sendOrderItems: { ok, error },
              },
            } = await sendOrderItems({
              variables: {
                input: {
                  shipmentCompany: "",
                  shipmentNumber: 0,
                  orderItemIds: checkedOrderItemIds,
                },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: (
                  <>
                    발송이 처리되었습니다
                    <br />
                    (배송중에서 확인 가능)
                  </>
                ),
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,
                confirmButtonClickHandler: () => {
                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });

                  checkedOrderItemsVar([]);
                  checkAllBoxStatusVar(false);
                },
              });
            }
            if (error) {
              loadingSpinnerVisibilityVar(false);
              showHasServerErrorModal(error, "발송 처리");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "발송 처리");
        }
      },
    });
  };

  //주문취소
  const handleCancelOrderClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (isShippingChecked || isShippingCompletedChecked) {
      showHasAnyProblemModal(
        <>
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
        </>
      );
      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>취소처리 하시겠습니까?</>,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        modalVar({
          isVisible: true,
          component: (
            <AskReasonModal
              option={optionListType}
              handleSubmitButtonClick={() => {
                try {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  (async () => {
                    loadingSpinnerVisibilityVar(true);
                    const {
                      data: {
                        cancelOrderItemsBySeller: { ok, error },
                      },
                    } = await cancelOrderItems({
                      variables: {
                        input: {
                          reason,
                          orderItemIds: checkedOrderItemIds,
                        },
                      },
                    });

                    if (ok) {
                      loadingSpinnerVisibilityVar(false);
                      systemModalVar({
                        ...systemModalVar(),
                        isVisible: true,
                        description: (
                          <>
                            선택하신 주문이
                            <br />
                            취소 완료되었습니다.
                            <br />
                            (취소관리 - 취소완료에서 확인 가능)
                          </>
                        ),
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

                          checkedOrderItemsVar([]);
                          checkAllBoxStatusVar(false);
                        },
                      });
                    }
                    if (error) {
                      loadingSpinnerVisibilityVar(false);
                      showHasServerErrorModal(error, "주문 취소");
                    }
                  })();
                } catch (error) {
                  loadingSpinnerVisibilityVar(false);
                  showHasServerErrorModal(error as string, "주문 취소");
                }
              }}
            />
          ),
        });
      },
    });
  };

  //반품처리
  const handleReturnButtonClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (isPaymentCompletedChecked || isPreparingChecked) {
      showHasAnyProblemModal(
        <>
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
        </>
      );
      return;
    }
  };

  //교환처리
  const handleExchangeButtonClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (isPaymentCompletedChecked || isPreparingChecked) {
      showHasAnyProblemModal(
        <>
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
        </>
      );
      return;
    }
  };

  const changeSearchTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as OrderSearchType;

    filterOptionVar({
      ...filterOptionVar(),
      type,
    });
  };

  const changeFilterQueryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemporaryQuery(e.target.value);
  };

  const changeSkipQuantityHandler = ({ target: { value } }) => {
    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      page: 1,
      skip: Number(value),
    });

    paginationSkipVar(0);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return commonFilterOptionVar({
        ...commonFilterOptionVar(),
        query: temporaryQuery,
      });
    }, 500);

    return () => clearTimeout(debounce);
  }, [temporaryQuery]);

  return (
    <ControllerContainer>
      <ActiveButtonContainer>
        <ControllerButton
          size="small"
          onClick={handleConfirmOrderButtonClick}
          disabled={
            statusName === OrderStatusName.PREPARING ||
            statusName === OrderStatusName.SHIPPING ||
            statusName === OrderStatusName.SHIPPING_COMPLETED
          }
        >
          주문확인
        </ControllerButton>
        <ControllerButton
          size="small"
          onClick={handleSendButtonClick}
          disabled={
            statusName === OrderStatusName.PAYMENT_COMPLETED ||
            statusName === OrderStatusName.SHIPPING ||
            statusName === OrderStatusName.SHIPPING_COMPLETED
          }
        >
          발송 처리
        </ControllerButton>
        <ControllerButton
          size="small"
          onClick={handleCancelOrderClick}
          disabled={
            statusName === OrderStatusName.SHIPPING ||
            statusName === OrderStatusName.SHIPPING_COMPLETED
          }
        >
          주문 취소
        </ControllerButton>
        <ControllerButton
          size="small"
          onClick={handleReturnButtonClick}
          disabled={
            statusName === OrderStatusName.PAYMENT_COMPLETED ||
            statusName === OrderStatusName.PREPARING
          }
        >
          반품 처리
        </ControllerButton>
        <ControllerButton
          size="small"
          onClick={handleExchangeButtonClick}
          disabled={
            statusName === OrderStatusName.PAYMENT_COMPLETED ||
            statusName === OrderStatusName.PREPARING
          }
        >
          교환 처리
        </ControllerButton>
      </ActiveButtonContainer>

      <SkipQuantityContainer>
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={type}
          onChange={changeSearchTypeHandler}
        >
          {searchQueryType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </StatusDropDown>
        <SearchQueryInput
          onChange={changeFilterQueryHandler}
          value={temporaryQuery}
        />
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
          onChange={changeSkipQuantityHandler}
        >
          {SkipQuantityCache.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </StatusDropDown>
        <Button size={"small"}>내보내기</Button>
      </SkipQuantityContainer>
    </ControllerContainer>
  );
};

const ActiveButtonContainer = styled.div`
  display: flex;
`;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

const StatusDropDown = styled(Dropdown)`
  padding-right: 0px;
  margin-right: 12px;
`;

const ControllerButton = styled(Button)`
  margin-left: 12px;
`;

const SkipQuantityContainer = styled.div`
  display: flex;
`;

export default Controller;
