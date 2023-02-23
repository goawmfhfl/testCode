import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useSearchParams } from "react-router-dom";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  paginationSkipVar,
  showHasAnyProblemModal,
  systemModalVar,
} from "@cache/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import { checkedOrderItemsVar } from "@cache/sale";
import {
  decryptSaleNameId,
  decryptSaleTypeId,
  skipQuantityType,
} from "@constants/index";
import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  searchQueryType,
} from "@constants/sale";
import { OrderCancel } from "@constants/sale/cancelManagement";
import {
  fixTableType,
  scrollTableType,
} from "@constants/sale/cancelManagement/table";

import { ResetOrderItemType } from "@models/sale";
import {
  ConfirmOrDenyCancelBySellerInputType,
  ConfirmOrDenyCancelBySellerType,
} from "@models/sale/cancel";

import { CONFIRM_OR_DENY_CANCEL_BY_SELLER } from "@graphql/mutations/confirmOrDenyCancelBySeller";
import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";

import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";
import getOrderItemIsCheckedStatus from "@utils/sale/cancel/getOrderItemIsCheckedStatus";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import ControllerContainer from "@components/sale/ControllerContainer";
import Button from "@components/common/Button";
import { SelectInput, OptionInput } from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import HandleCancelRefusalModal from "@components/sale/cancelManagement/HandleCancelRefusalModal";
import ExportToExcelButton from "@components/sale/ExportToExcelButton";

const Controller = () => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

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
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.CANCEL,
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

    if (status === OrderCancel.APPROVE) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>취소요청을 승인하시겠습니까?</>,
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        confirmButtonClickHandler: () => {
          try {
            void (async () => {
              loadingSpinnerVisibilityVar(true);
              const components = reconstructCheckedOrderItems.map(({ id }) => ({
                orderItemId: id,
                mainReason: null,
                detailedReason: null,
              }));
              const {
                data: {
                  confirmOrDenyCancelBySeller: { ok, error },
                },
              } = await confirmOrDenyCancel({
                variables: {
                  input: { components, status: OrderCancel.APPROVE },
                },
              });

              if (ok) {
                loadingSpinnerVisibilityVar(false);
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: true,
                  description: <>취소가 완료되었습니다</>,
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
                      PG사 오류 혹은 네트워크 오류로 인해
                      <br />
                      환불 처리가 되지 않았습니다.
                      <br />
                      취소 승인 버튼을 다시 눌러
                      <br />
                      취소를 진행해주세요.
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
            showHasServerErrorModal(error as string, "취소 승인");
          }
        },
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }

    if (status === OrderCancel.DENY) {
      modalVar({
        isVisible: true,
        component: <HandleCancelRefusalModal />,
      });
    }
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
          onClick={handleConfirmOrDenyButtonClick(OrderCancel.APPROVE)}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.CANCEL_COMPLETED
          }
        >
          취소 승인
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleConfirmOrDenyButtonClick(OrderCancel.DENY)}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.CANCEL_COMPLETED
          }
        >
          취소 거절
        </ControlButton>
      </ActiveButtonContainer>
      <FilterContainer>
        <Select
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

        <ExportToExcelButton
          exportData={checkedOrderItems}
          tableData={[...fixTableType, ...scrollTableType]}
          status={OrderStatusGroup.REFUND}
        >
          내보내기
        </ExportToExcelButton>
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
