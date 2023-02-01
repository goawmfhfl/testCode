import React, { useState } from "react";
import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

import { skipQuantityType } from "@constants/index";
import {
  Cause,
  MainReason,
  OrderSearchType,
  OrderStatusName,
  searchQueryType,
} from "@constants/sale";
import { OrderCancel, orderCancelType } from "@constants/sale/cancelManagement";
import { ResetOrderItemType } from "@models/sale";

import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  paginationSkipVar,
  showHasAnyProblemModal,
  systemModalVar,
} from "@cache/index";
import { filterOptionVar } from "@cache/sale/cancel";

import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";
import getOrderItemIsCheckedStatus from "@utils/sale/cancel/getOrderItemIsCheckedStatus";
import getConfirmOrDenyCancelComponents from "@utils/sale/cancel/getConfirmOrDenyCancelComponents";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import ControllerContainer from "@components/sale/ControllerContainer";
import Button from "@components/common/Button";
import { SelectInput, OptionInput } from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import { checkedOrderItemsVar } from "@cache/sale/cancel";
import {
  ConfirmOrDenyCancelBySellerInputType,
  ConfirmOrDenyCancelBySellerType,
} from "@models/sale/cancel";
import { CONFIRM_OR_DENY_CANCEL_BY_SELLER } from "@graphql/mutations/confirmOrDenyCancelBySeller";
import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { showHasServerErrorModal } from "@cache/productManagement";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const [temporaryQuery, setTemporaryQuery] = useState<string>("");

  const reconstructCheckedOrderItems: Array<ResetOrderItemType> =
    getReconstructCheckedOrderItems(checkedOrderItems);
  const { isCancelCompletedChecked } = getOrderItemIsCheckedStatus(
    reconstructCheckedOrderItems
  );

  const [confirmOrDenyCancel] = useMutation<
    ConfirmOrDenyCancelBySellerType,
    {
      input: ConfirmOrDenyCancelBySellerInputType;
    }
  >(CONFIRM_OR_DENY_CANCEL_BY_SELLER, {
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

  const handleConfirmOrDenyButtonClick = (status: OrderCancel) => () => {
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

    if (isCancelCompletedChecked) {
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
      description:
        status === OrderCancel.APPROVE ? (
          <>취소요청을 승인하시겠습니까?</>
        ) : (
          <>취소요청을 거절하시겠습니까?</>
        ),
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        try {
          const components: Array<{
            orderItemId: number;
            mainReason: MainReason;
            detailedReason: string;
            cause: Cause;
          }> = getConfirmOrDenyCancelComponents(reconstructCheckedOrderItems);

          console.log([{ components }, { status }]);

          void (async () => {
            loadingSpinnerVisibilityVar(true);
            const {
              data: {
                confirmOrDenyCancelBySeller: { ok, error },
              },
            } = await confirmOrDenyCancel({
              variables: {
                input: { components, status },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description:
                  status === OrderCancel.APPROVE ? (
                    <>취소가 완료되었습니다</>
                  ) : (
                    <>
                      취소 요청이 거절되었습니다.
                      <br />
                      이제 주문관리 - 상품 준비중에서
                      <br />
                      관리 가능합니다.
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
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: (
                  <>
                    취소 `${orderCancelType[status]}`을(를) <br />
                    완료하지 못했습니다.
                    <br />
                    다시 시도 후 같은 문제가 발생할 시
                    <br />
                    찹스틱스에 문의해주세요
                    <br />
                    <br />
                    에러메시지:
                    <br />
                    {error}
                  </>
                ),
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
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(
            error as string,
            `취소 ${orderCancelType[status]}`
          );
        }
      },
      cancelButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
    });
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

  return (
    <ControllerContainer>
      <ActiveButtonContainer>
        <ControlButton
          size="small"
          onClick={handleConfirmOrDenyButtonClick(OrderCancel.APPROVE)}
          disabled={statusName === OrderStatusName.CANCEL_COMPLETED}
        >
          취소 승인
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleConfirmOrDenyButtonClick(OrderCancel.DENY)}
          disabled={statusName === OrderStatusName.CANCEL_COMPLETED}
        >
          취소 거절
        </ControlButton>
      </ActiveButtonContainer>
      <FilterContainer>
        <Select
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
        </Select>
        <SearchQueryInput
          onChange={changeFilterQueryHandler}
          value={temporaryQuery}
        />

        <Select
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
          onChange={changeSkipQuantityHandler}
        >
          {skipQuantityType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </Select>

        <Button size={"small"}>내보내기</Button>
      </FilterContainer>
    </ControllerContainer>
  );
};

const ActiveButtonContainer = styled.div`
  display: flex;
`;

const ControlButton = styled(Button)`
  margin-right: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
`;

const Select = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 12px;
`;
const Option = styled(OptionInput)``;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

export default Controller;
