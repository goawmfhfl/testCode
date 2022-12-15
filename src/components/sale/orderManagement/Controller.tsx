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
  paginationSkipVar,
  showHasAnyProblemModal,
  SkipQuantityCache,
  systemModalVar,
} from "@cache/index";
import {
  searchQueryType,
  OrderSearchType,
  OrderStatusType,
} from "@constants/sale";
import { useMutation, useReactiveVar } from "@apollo/client";
import { checkedOrderItemsVar } from "@cache/sale";
import { filterOptionVar } from "@cache/sale/orderManagement";
import { CONFIRM_ORDERITMES_BY_SELLER } from "@graphql/mutations/confirmOrderItemsBySeller";
import {
  ConfirmOrderItemsBySellerInputType,
  ConfirmOrderItemsBySellerType,
} from "@models/sale";
import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { showHasServerErrorModal } from "@cache/productManagement";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);
  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const checkedOrderItemIds = checkedOrderItems.map(
    (orderItem) => orderItem.id
  );

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

  // 주문확인
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

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          선택하신 주문을 <br /> 확인처리 하시겠습니까?{" "}
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
        <ControllerButton size="small" onClick={handleConfirmOrderButtonClick}>
          주문확인
        </ControllerButton>
        <ControllerButton size="small" onClick={handleSendButtonClick}>
          발송 처리
        </ControllerButton>
        <ControllerButton size="small" onClick={handleCancelOrderClick}>
          주문 취소
        </ControllerButton>
        <ControllerButton size="small" onClick={handleReturnButtonClick}>
          반품 처리
        </ControllerButton>
        <ControllerButton size="small" onClick={handleExchangeButtonClick}>
          교환 처리
        </ControllerButton>
      </ActiveButtonContainer>

      <SkipQuantityContainer>
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={OrderSearchType.RECIPIENT_NAME}
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
