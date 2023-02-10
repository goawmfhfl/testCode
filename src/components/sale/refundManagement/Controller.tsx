import React, { useState } from "react";
import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  commonSaleFilterOptionVar,
  commonCheckedOrderItemsVar,
} from "@cache/sale";
import { refundOrderItemsVar } from "@cache/sale/refund";
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
import {
  OrderSearchType,
  searchQueryType,
  SendType,
  DenyRefundOrExchangeRequestType,
} from "@constants/sale";
import { skipQuantityType } from "@constants/index";
import { changeRefundOrderStatusByForceType } from "@constants/sale/refundManagement/index";

import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";

import { SEND_ORDER_ITEMS } from "@graphql/mutations/sendOrderItems";
import { GET_REFUND_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";

import questionMarkSrc from "@icons/questionmark.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import ControllerContainer from "@components/sale/ControllerContainer";
import Button from "@components/common/Button";
import { SelectInput, OptionInput } from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import {
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale/order";
import HandleRefusalRefundOrExchangeRequestModal from "@components/sale/HandleRefusalRefundOrExchangeRequestModal";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } = useReactiveVar(
    commonSaleFilterOptionVar
  );

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
        query: GET_REFUND_ORDERS_BY_SELLER,
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

  const [showNotice, setShowNotice] = useState<boolean>(false);
  const [temporaryQuery, setTemporaryQuery] = useState<string>("");

  const refundOrderItems = useReactiveVar(refundOrderItemsVar);
  const checkedOrderItems = useReactiveVar(commonCheckedOrderItemsVar);
  const reconstructCheckedOrderItems =
    getReconstructCheckedOrderItems(checkedOrderItems);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  const changeOrderStatusHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    return "";
  };

  const handleRefusalRefundButtonClick = () => {
    modalVar({
      isVisible: true,
      component: (
        <HandleRefusalRefundOrExchangeRequestModal
          status={DenyRefundOrExchangeRequestType.REFUND}
        />
      ),
    });
  };

  const changeSearchTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as OrderSearchType;

    commonSaleFilterOptionVar({
      ...commonSaleFilterOptionVar(),
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

    // showHasAnyProblemModal(
    //   <>
    //     해당 버튼은 선택하신
    //     <br />
    //     주문건을 처리할 수 없습니다.
    //     <br />
    //     주문 상태를 다시 확인해주세요.
    //   </>
    // );

    const { isShipmentCompanyFullFilled, isShipmentNumberFullFilled } =
      reconstructCheckedOrderItems.reduce(
        (
          result,
          { temporaryRefundShipmentCompany, temporaryRefundShipmentNumber }
        ) => {
          if (!temporaryRefundShipmentCompany)
            result.isShipmentCompanyFullFilled = false;
          if (!temporaryRefundShipmentNumber)
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
          해당 반품건을 <br />
          수거 처리 하시겠습니까?
        </>
      ),
      cancelButtonVisibility: true,
      confirmButtonVisibility: true,
      confirmButtonClickHandler: () => {
        try {
          void (async () => {
            loadingSpinnerVisibilityVar(true);

            const components = reconstructCheckedOrderItems.map(
              ({
                id,
                temporaryRefundShipmentCompany,
                temporaryRefundShipmentNumber,
              }) => ({
                orderItemId: id,
                shipmentCompany: temporaryRefundShipmentCompany,
                shipmentNumber: Number(temporaryRefundShipmentNumber),
              })
            );

            const {
              data: {
                sendOrderItems: { ok, error },
              },
            } = await sendOrderItems({
              variables: {
                input: {
                  components: components,
                  type: SendType.REFUND_PICK_UP,
                },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: <>수거 처리되었습니다.</>,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,
                confirmButtonClickHandler: () => {
                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });

                  commonCheckedOrderItemsVar([]);
                  checkAllBoxStatusVar(false);
                },
              });
            }
            if (error) {
              loadingSpinnerVisibilityVar(false);
              showHasServerErrorModal(error, "수거 처리");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "수거 처리");
        }
      },
    });
  };

  return (
    <ControllerContainer>
      <ActiveButtonContainer>
        <ControlButton size="small" onClick={handleSendButtonClick}>
          수거
        </ControlButton>
        <ControlButton size="small" onClick={handleRefusalRefundButtonClick}>
          반품 거절
        </ControlButton>
        <ControlButton size="small">반품 완료 처리</ControlButton>
        <ChangeOrderStatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={type}
          onChange={changeOrderStatusHandler}
        >
          <Option value={"default"}>강제 상태 변경</Option>
          {changeRefundOrderStatusByForceType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </ChangeOrderStatusDropDown>

        <QuestionMarkIconContainer>
          <QuestionMarkIcon
            src={questionMarkSrc}
            onMouseOver={() => setShowNotice(true)}
            onMouseLeave={() => setShowNotice(false)}
          />
          {showNotice && (
            <NoticeCOntainer>
              <NoticeIcon src={questionMarkSrc} />
              <NoticeText>
                강제 상태 변경은 선택한 주문상틔 이후 상태로만 변경 가능합니다.
                <br /> 이전 상태로 변경은 불가합니다.
              </NoticeText>
            </NoticeCOntainer>
          )}
        </QuestionMarkIconContainer>
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
  justify-content: center;
  align-items: center;
`;

const ControlButton = styled(Button)`
  margin-right: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
`;

const ChangeOrderStatusDropDown = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 7px;
`;

const Select = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 12px;
`;

const Option = styled(OptionInput)``;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

const QuestionMarkIconContainer = styled.div`
  position: relative;
`;

const QuestionMarkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const NoticeCOntainer = styled.div`
  position: absolute;
  top: -100%;
  transform: translateY(-50%);

  z-index: 10;

  display: flex;
  width: 397px;
  padding: 8px 16px 8px 8px;
  border-radius: 7px;
  background: ${({ theme: { palette } }) => palette.grey400};
`;

const NoticeText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;

  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
  white-space: nowrap;
`;

const NoticeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;

  user-select: none;
`;

export default Controller;
