import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useReactiveVar } from "@apollo/client";
import styled from "styled-components/macro";

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
import { checkedOrderItemsVar } from "@cache/sale";
import { showHasServerErrorModal } from "@cache/productManagement";

import { decryptSaleNameId, decryptSaleTypeId } from "@constants/index";
import {
  searchQueryType,
  OrderSearchType,
  OrderStatusName,
  OrderStatusGroup,
  OrderStatusType,
  optionListType,
  SendType,
} from "@constants/sale";

import { CONFIRM_ORDERITMES_BY_SELLER } from "@graphql/mutations/confirmOrderItemsBySeller";
import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { SEND_ORDER_ITEMS } from "@graphql/mutations/sendOrderItems";

import {
  ConfirmOrderItemsBySellerInputType,
  ConfirmOrderItemsBySellerType,
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale/order";
import { ResetOrderItemType } from "@models/sale";

import { getHasCheckedOrderStatus } from "@utils/sale/order/getHasCheckedOrderStatus";
import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import ControllerContainer from "@components/sale/ControllerContainer";
import HandleCancelOrderModal from "@components/sale/orderManagement/HandleCancelOrderModal";
import HandleRefundModal from "@components/sale/orderManagement/HandleRefundModal";
import HandleExchangeModal from "@components/sale/orderManagement/HandleExchangeModal";

const Controller = () => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

  const checkedOrderItems =
    useReactiveVar<Array<ResetOrderItemType>>(checkedOrderItemsVar);
  const reconstructCheckedOrderItems =
    getReconstructCheckedOrderItems(checkedOrderItems);

  const {
    isPaymentCompletedChecked,
    isPreparingChecked,
    isShippingChecked,
    isShippingCompletedChecked,
    isCancelRequestChecked,
  } = getHasCheckedOrderStatus(reconstructCheckedOrderItems);

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
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.ORDER,
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
  >(SEND_ORDER_ITEMS, {
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
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.ORDER,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

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

    if (
      isPreparingChecked ||
      isShippingChecked ||
      isShippingCompletedChecked ||
      isCancelRequestChecked
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
          const checkedOrderItemIds = reconstructCheckedOrderItems.map(
            ({ id }) => id
          );

          void (async () => {
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
      isShippingCompletedChecked ||
      isCancelRequestChecked
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
      reconstructCheckedOrderItems.reduce(
        (result, { temporaryShipmentCompany, temporaryShipmentNumber }) => {
          if (!temporaryShipmentCompany)
            result.isShipmentCompanyFullFilled = false;
          if (!temporaryShipmentNumber)
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
          void (async () => {
            loadingSpinnerVisibilityVar(true);

            const components = reconstructCheckedOrderItems.map(
              ({ id, temporaryShipmentCompany, temporaryShipmentNumber }) => ({
                orderItemId: id,
                shipmentCompany: temporaryShipmentCompany,
                shipmentNumber: Number(temporaryShipmentNumber),
              })
            );

            const {
              data: {
                sendOrderItems: { ok, error },
              },
            } = await sendOrderItems({
              variables: {
                input: { components: components, type: SendType.SEND },
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

    if (
      isShippingChecked ||
      isShippingCompletedChecked ||
      isCancelRequestChecked
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

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>취소처리 하시겠습니까?</>,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });

        modalVar({
          isVisible: true,
          component: <HandleCancelOrderModal option={optionListType} />,
        });
      },
    });
  };

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

    if (
      isPaymentCompletedChecked ||
      isPreparingChecked ||
      isCancelRequestChecked
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

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>반품처리 하시겠습니까?</>,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });

        modalVar({
          isVisible: true,
          component: <HandleRefundModal />,
        });
      },
    });
  };

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

    if (
      isPaymentCompletedChecked ||
      isPreparingChecked ||
      isCancelRequestChecked
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

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>교환처리 하시겠습니까?</>,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });

        modalVar({
          isVisible: true,
          component: <HandleExchangeModal />,
        });
      },
    });
  };

  const changeSearchTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as OrderSearchType;

    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      orderSearchType: type,
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
        <ControlButton
          size="small"
          onClick={handleConfirmOrderButtonClick}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.PREPARING ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_COMPLETED
          }
        >
          주문확인
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleSendButtonClick}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.PAYMENT_COMPLETED ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_COMPLETED
          }
        >
          발송 처리
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleCancelOrderClick}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_COMPLETED
          }
        >
          주문 취소
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleReturnButtonClick}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.PAYMENT_COMPLETED ||
            decryptSaleNameId[nameId] === OrderStatusName.PREPARING
          }
        >
          반품 처리
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleExchangeButtonClick}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.PAYMENT_COMPLETED ||
            decryptSaleNameId[nameId] === OrderStatusName.PREPARING
          }
        >
          교환 처리
        </ControlButton>
      </ActiveButtonContainer>

      <FilterContainer>
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={orderSearchType}
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
      </FilterContainer>
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

const ControlButton = styled(Button)`
  margin-right: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
`;

export default Controller;
