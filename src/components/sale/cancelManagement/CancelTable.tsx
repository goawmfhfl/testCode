import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";
import { cloneDeep } from "lodash";
import { TableType } from "@models/index";

import { checkedOrdersVar, filterOptionVar } from "@cache/sale/cancel";
import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  pageNumberListVar,
  paginationVisibilityVar,
  showHasAnyProblemModal,
  systemModalVar,
  totalPageLengthVar,
} from "@cache/index";

import {
  tableWidth,
  fixTableType,
  scrollTableType,
} from "@constants/sale/cancelManagement/table";
import {
  MainReason,
  mainReasonType,
  optionListType,
  OrderStatusName,
} from "@constants/sale";

import { checkedOrderItemsVar } from "@cache/sale";
import useLazyCancelOrders from "@hooks/order/useLazyCancelOrders";
import contructCancelOrders from "@utils/sale/cancel/contructCancelOrders";
import resetCancelOrders from "@utils/sale/cancel/resetCancelOrders";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import {
  FixedTable,
  ScrollTable,
  TableContainer,
  TdContainer,
  Td,
  Th,
  ThContainer,
  Tr,
} from "@components/common/table/Table";
import Checkbox from "@components/common/input/Checkbox";
import Loading from "@components/common/table/Loading";
import NoDataContainer from "@components/common/table/NoDataContainer";
import {
  SelectInput,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import Button from "@components/common/Button";
import { Input } from "@components/common/input/TextInput";
import {
  CancelOrdersType,
  NormalizedType,
  ResetCancelOrders,
} from "@models/sale/cancel";
import AskReasonModal from "@components/common/AskReasonModal";

const CancelTable = () => {
  const { getOrders, error, loading, data } = useLazyCancelOrders();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const [orders, setOrders] = useState<Array<ResetCancelOrders>>([]);

  const checkedOrders = useReactiveVar(checkedOrdersVar);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrders = cloneDeep(orders);
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      const checkOrders = newOrders.map((orderItem) => ({
        ...orderItem,
        isChecked: true,
      }));

      setOrders(checkOrders);
      checkedOrdersVar(checkOrders);
    }

    if (!e.target.checked) {
      const checkAllOrderItem = newOrders.map((orderItem) => ({
        ...orderItem,
        isChecked: false,
      }));

      setOrders(checkAllOrderItem);
      checkedOrdersVar([]);
    }
  };

  const changeSingleCheckBoxHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOrders = cloneDeep(orders);

      if (e.target.checked) {
        const checkedOrderItem = { ...newOrders[index], isChecked: true };
        checkedOrdersVar([...checkedOrders, checkedOrderItem]);

        newOrders[index].isChecked = true;
        setOrders(newOrders);
      }

      if (!e.target.checked) {
        const hasCheckedList = checkedOrders.filter(
          (orderItem) => orderItem.id === newOrders[index].id
        );

        if (hasCheckedList) {
          const checkedListIndex = checkedOrders.findIndex(
            (orderItem) => orderItem.id === newOrders[index].id
          );

          const deletedCheckedList = [
            ...checkedOrders.slice(0, checkedListIndex),
            ...checkedOrders.slice(checkedListIndex + 1),
          ];

          checkedOrdersVar(deletedCheckedList);

          newOrders[index].isChecked = false;
          setOrders(newOrders);
        }

        newOrders[index].isChecked = false;
        setOrders(newOrders);
      }
    };

  const handleEditReasonButtonClick = () => () => {
    modalVar({
      isVisible: true,
      component: <AskReasonModal option={optionListType} />,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getOrders({
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
      });
    })();
  }, [page, skip, query, type, statusName, statusType, statusGroup]);

  useEffect(() => {
    if (!data || !data.getOrdersBySeller) return;

    const {
      totalPages,
      totalResults,
      totalOrderItems,
    }: {
      totalPages: number;
      totalResults: number;
      totalOrderItems: Array<CancelOrdersType>;
    } = data.getOrdersBySeller;

    const isLastPageChanged = totalPages < page;

    if (isLastPageChanged && totalPages !== 0) {
      commonFilterOptionVar({
        ...commonFilterOptionVar(),
        page: totalPages,
      });

      return;
    }

    pageNumberListVar(
      Array(totalPages)
        .fill(null)
        .map((_, index) => index + 1)
    );

    totalPageLengthVar(totalResults);

    const recontructCancelOrders: NormalizedType =
      contructCancelOrders(totalOrderItems);

    const cancelOrders: Array<ResetCancelOrders> = resetCancelOrders(
      recontructCancelOrders
    );

    setOrders(cancelOrders);

    checkedOrderItemsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  useEffect(() => {
    paginationVisibilityVar(loading || error);
  }, [loading]);

  useEffect(() => {
    if (error) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            내부 서버 오류로 인해 요청하신
            <br />
            작업을 완료하지 못했습니다.
            <br />
            다시 한 번 시도 후 같은 문제가 발생할 경우
            <br />
            찹스틱스로 문의해주세요.
            <br />
            <br />
            (전화 문의 070-4187-3848)
            <br />
            <br />
            Code:
            {error.message}
          </>
        ),
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
  }, [error]);

  const hasOrders = !loading && !error && !!orders?.length;

  return (
    <TableContainer type={TableType.SCROLL} hasData={false}>
      <FixedTable width={tableWidth.left}>
        <ThContainer>
          <Th type={TableType.SCROLL} width={fixTableType[0].width}>
            <Checkbox
              onChange={changeAllCheckBoxHandler}
              checked={checkAllBoxStatus}
            />
          </Th>
          <Th type={TableType.SCROLL} width={fixTableType[1].width}>
            {fixTableType[1].label}
          </Th>
          <Th type={TableType.SCROLL} width={fixTableType[2].width}>
            {fixTableType[2].label}
          </Th>
          <Th type={TableType.SCROLL} width={fixTableType[3].width}>
            {fixTableType[3].label}
          </Th>
          <Th type={TableType.SCROLL} width={fixTableType[4].width}>
            {fixTableType[4].label}
          </Th>
          <Th type={TableType.SCROLL} width={fixTableType[5].width}>
            {fixTableType[5].label}
          </Th>
        </ThContainer>
        <TdContainer>
          {hasOrders &&
            orders.map(
              (
                {
                  id,
                  merchantItemUid,
                  productCode,
                  orderProduct,
                  userName,
                  orderStatus,
                  isChecked,
                },
                index
              ) => (
                <Tr key={id}>
                  <Td type={TableType.SCROLL} width={fixTableType[0].width}>
                    <Checkbox
                      onChange={changeSingleCheckBoxHandler(index)}
                      checked={isChecked}
                    />
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[1].width}>
                    {merchantItemUid}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[2].width}>
                    {productCode}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[3].width}>
                    {orderProduct}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[4].width}>
                    {userName}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[5].width}>
                    {orderStatus}
                  </Td>
                </Tr>
              )
            )}
        </TdContainer>
      </FixedTable>
      <ScrollTable width={tableWidth.right}>
        <ThContainer>
          <Th type={TableType.SCROLL} width={scrollTableType[0].width}>
            {scrollTableType[0].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[1].width}>
            {scrollTableType[1].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[2].width}>
            {scrollTableType[2].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[3].width}>
            {scrollTableType[3].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[4].width}>
            {scrollTableType[4].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[5].width}>
            {scrollTableType[5].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[6].width}>
            {scrollTableType[6].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[7].width}>
            {scrollTableType[7].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[8].width}>
            {scrollTableType[8].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[9].width}>
            {scrollTableType[9].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[10].width}>
            {scrollTableType[10].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[11].width}>
            {scrollTableType[11].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[12].width}>
            {scrollTableType[12].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[13].width}>
            {scrollTableType[13].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[14].width}>
            {scrollTableType[14].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[15].width}>
            {scrollTableType[15].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[16].width}>
            {scrollTableType[16].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[17].width}>
            {scrollTableType[17].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[18].width}>
            {scrollTableType[18].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[19].width}>
            {scrollTableType[19].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[20].width}>
            {scrollTableType[20].label}
          </Th>
        </ThContainer>

        <TdContainer>
          {hasOrders &&
            orders.map(
              (
                {
                  id,
                  claimStatus,
                  payments,
                  recipientName,
                  recipientPhoneNumber,
                  userEmail,
                  userPhoneNumber,
                  option,
                  quantity,
                  price,
                  optionPrice,
                  totalPrice,
                  shipmentPrice,
                  shipmentDistantPrice,
                  mainReason,
                  detaildReason,
                  refusalDetaildReason,
                  refusalMainReason,
                  cancelRequestDay,
                  cancelRefusalDay,
                  cancelCompletedDay,
                  totalRefundPrice,
                },
                index
              ) => (
                <Tr key={id}>
                  <Td type={TableType.SCROLL} width={scrollTableType[0].width}>
                    {claimStatus}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[1].width}>
                    {payments}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[2].width}>
                    {cancelRequestDay}
                  </Td>
                  <ReasonTd
                    type={TableType.SCROLL}
                    width={scrollTableType[3].width}
                  >
                    <Reason>{mainReasonType[mainReason as string]}</Reason>
                    <Button
                      type={"button"}
                      size={"small"}
                      width={"55px"}
                      disabled={statusName === OrderStatusName.CANCEL_COMPLETED}
                    >
                      수정
                    </Button>
                  </ReasonTd>
                  <Td type={TableType.SCROLL} width={scrollTableType[4].width}>
                    {detaildReason}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[5].width}>
                    {cancelCompletedDay}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[6].width}>
                    {"컬러: 레드/크기:s"}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[7].width}>
                    <Quantity quantity={quantity}>{quantity}</Quantity>
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[8].width}>
                    {price}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[9].width}>
                    {optionPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[10].width}>
                    {totalPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[11].width}>
                    {shipmentPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[12].width}>
                    {shipmentDistantPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[13].width}>
                    {totalRefundPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[14].width}>
                    {userEmail}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[15].width}>
                    {userPhoneNumber}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[16].width}>
                    {recipientName}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[17].width}>
                    {recipientPhoneNumber}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[18].width}>
                    {cancelRefusalDay}
                  </Td>
                  <ReasonTd
                    type={TableType.SCROLL}
                    width={scrollTableType[19].width}
                  >
                    <Reason>
                      {mainReasonType[refusalMainReason as string]}
                    </Reason>
                    <Button
                      type={"button"}
                      size={"small"}
                      width={"55px"}
                      disabled={statusName === OrderStatusName.CANCEL_COMPLETED}
                    >
                      수정
                    </Button>
                  </ReasonTd>
                  <Td type={TableType.SCROLL} width={scrollTableType[20].width}>
                    {refusalDetaildReason}
                  </Td>
                </Tr>
              )
            )}
        </TdContainer>
      </ScrollTable>

      {orders.length === 0 && !loading && (
        <NoDataContainer type={TableType.SCROLL}>
          {query && (
            <>
              검색어와 일치하는
              <br />
              주문이 없습니다.
            </>
          )}

          {!query && (
            <>
              아직 등록된
              <br />
              주문이 없습니다.
            </>
          )}
        </NoDataContainer>
      )}

      {loading && <Loading type={TableType.SCROLL} />}
    </TableContainer>
  );
};

const ReasonTd = styled(Td)`
  display: flex;
  justify-content: space-between;

  padding: 0px 8px;
`;
const Reason = styled.span``;

const Quantity = styled.span<{ quantity: number }>`
  color: ${({ theme: { palette }, quantity }) =>
    quantity > 1 ? palette.red900 : palette.black};
`;

export default CancelTable;
