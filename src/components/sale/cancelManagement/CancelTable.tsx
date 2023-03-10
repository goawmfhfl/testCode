import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components/macro";
import { useQuery, useReactiveVar } from "@apollo/client";
import { cloneDeep } from "lodash";
import { TableType } from "@models/index";

import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  modalVar,
  pageNumberListVar,
  paginationVisibilityVar,
  showHasAnyProblemModal,
  totalPageLengthVar,
} from "@cache/index";
import { checkedOrderItemsVar, resetOrderItemsVar } from "@cache/sale";
import {
  GetCancelOrdersBySellerInputType,
  GetCancelOrdersBySellerType,
} from "@models/sale/cancel";

import {
  tableWidth,
  fixTableType,
  scrollTableType,
} from "@constants/sale/cancelManagement/table";
import {
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";
import { decryptSaleNameId, decryptSaleTypeId } from "@constants/index";
import { NormalizedListType } from "@models/sale";
import { ResetOrderItemType } from "@models/sale";

import { GET_CANCEL_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import constructOrderItem from "@utils/sale/constructOrderItem";
import getResetOrderItems from "@utils/sale/cancel/getResetOrderItems";

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
import Button from "@components/common/Button";
import EditReasonModal from "@components/sale/cancelManagement/EditReasonModal";

const CancelTable = () => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

  const orderItems = useReactiveVar(resetOrderItemsVar);
  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  const { loading, error, data } = useQuery<
    GetCancelOrdersBySellerType,
    { input: GetCancelOrdersBySellerInputType }
  >(GET_CANCEL_ORDERS_BY_SELLER, {
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
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrderItems = cloneDeep(orderItems);
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      const checkAllOrderItem = newOrderItems.map((orderItem) => ({
        ...orderItem,
        isChecked: true,
      }));
      resetOrderItemsVar(checkAllOrderItem);
      checkedOrderItemsVar(checkAllOrderItem);
    }

    if (!e.target.checked) {
      const checkAllOrderItem = newOrderItems.map((orderItem) => ({
        ...orderItem,
        isChecked: false,
      }));

      resetOrderItemsVar(checkAllOrderItem);
      checkedOrderItemsVar([]);
    }
  };

  const changeSingleCheckBoxHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOrderItems = cloneDeep(orderItems);
      const targetOrderItemId = newOrderItems[index].id;

      if (e.target.checked) {
        const targetOrderItems = newOrderItems.filter(
          ({ id }) => id === targetOrderItemId
        );
        const checkTargetOrderItems = targetOrderItems.map((orderItem) => ({
          ...orderItem,
          isChecked: true,
        }));

        checkedOrderItemsVar([...checkedOrderItems, ...checkTargetOrderItems]);
        newOrderItems[index].isChecked = true;
      }

      if (!e.target.checked) {
        const filteredOrderItems = checkedOrderItems.filter(
          (orderItem) => orderItem.id !== targetOrderItemId
        );
        checkedOrderItemsVar(filteredOrderItems);
        newOrderItems[index].isChecked = false;
      }
      resetOrderItemsVar(newOrderItems);
    };

  const handleEditReasonModalClick =
    (
      statusReasonId: number,
      status: OrderStatusName,
      mainReason: string,
      detailedReason: string
    ) =>
    () => {
      modalVar({
        isVisible: true,
        component: (
          <EditReasonModal
            statusReasonId={statusReasonId}
            status={status}
            mainReason={mainReason}
            detailedReason={detailedReason}
          />
        ),
      });
    };

  useEffect(() => {
    const hasData = !!data && !!data.getOrdersBySeller;
    if (!hasData) return;

    const {
      getOrdersBySeller: { totalPages, totalResults, totalOrderItems },
    } = data;

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

    const nomalizedOrderItem: NormalizedListType =
      constructOrderItem(totalOrderItems);
    const resetOrderItems: Array<ResetOrderItemType> =
      getResetOrderItems(nomalizedOrderItem);

    resetOrderItemsVar(resetOrderItems);
    checkedOrderItemsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  useEffect(() => {
    paginationVisibilityVar(loading || error);
  }, [loading]);

  const hasCancelOrderItems = !!orderItems && !!orderItems.length;
  const isFetchingOrderItemsFailed = !loading && !error && hasCancelOrderItems;

  if (error) {
    showHasAnyProblemModal(
      <>
        ?????? ?????? ????????? ?????? ????????????
        <br />
        ????????? ???????????? ???????????????.
        <br />
        ?????? ??? ??? ?????? ??? ?????? ????????? ????????? ??????
        <br />
        ??????????????? ??????????????????.
        <br />
        <br />
        (?????? ?????? 070-4187-3848)
      </>
    );
  }

  return (
    <TableContainer
      type={TableType.SCROLL}
      hasData={isFetchingOrderItemsFailed}
    >
      <FixedTable>
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
          <Th type={TableType.SCROLL} width={fixTableType[6].width}>
            {fixTableType[6].label}
          </Th>
        </ThContainer>
        <TdContainer>
          {!loading &&
            orderItems?.map(
              (
                {
                  merchantUid,
                  merchantItemUid,
                  productName,
                  thumbnail,
                  userName,
                  orderStatus,
                  claimStatus,

                  colorIndex,
                  rowIndex,
                  isLastRow,
                  isFirstRow,
                  isChecked,
                },
                index
              ) => (
                <Tr
                  key={rowIndex}
                  colorIndex={colorIndex}
                  isLastRow={isLastRow}
                  height={80}
                >
                  <Td type={TableType.SCROLL} width={fixTableType[0].width}>
                    {isFirstRow && (
                      <Checkbox
                        onChange={changeSingleCheckBoxHandler(index)}
                        checked={isChecked}
                      />
                    )}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[1].width}>
                    {merchantUid}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[2].width}>
                    {merchantItemUid}
                  </Td>
                  <ProductNameTd
                    type={TableType.SCROLL}
                    width={fixTableType[3].width}
                  >
                    <ProductThumbNailWrapper>
                      <ProductThumbNail src={encodeURI(thumbnail)} />
                    </ProductThumbNailWrapper>
                    <ProductName>{productName}</ProductName>
                  </ProductNameTd>
                  <Td type={TableType.SCROLL} width={fixTableType[4].width}>
                    {userName}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[5].width}>
                    {orderStatus}
                  </Td>
                  <Td type={TableType.SCROLL} width={fixTableType[6].width}>
                    {claimStatus}
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
          <Th type={TableType.SCROLL} width={scrollTableType[21].width}>
            {scrollTableType[21].label}
          </Th>
        </ThContainer>

        <TdContainer>
          {!loading &&
            orderItems?.map(
              ({
                paidAt,
                requestAt,
                mainReason,
                detailedReason,
                reasonStatus,
                statusReasonId,
                completedAt,
                optionName,
                optionQuantity,
                originalPrice,
                optionPrice,
                discountPrice,
                totalPrice,
                shipmentPrice,
                shipmentDistantPrice,
                totalPaymentAmount,
                userEmail,
                userPhoneNumber,
                recipientName,
                recipientPhoneNumber,
                totalRefundAmout,
                refusalAt,
                refusalReason,
                refusalDetailedReason,
                refusalReasonStatus,
                refusalStatusReasonId,
                colorIndex,
                rowIndex,
                isLastRow,
                isFirstRow,
              }) => (
                <Tr
                  key={rowIndex}
                  colorIndex={colorIndex}
                  isLastRow={isLastRow}
                  height={80}
                >
                  <Td type={TableType.SCROLL} width={scrollTableType[0].width}>
                    {paidAt}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[1].width}>
                    {requestAt}
                  </Td>
                  <MainReasonTd
                    type={TableType.SCROLL}
                    width={scrollTableType[2].width}
                  >
                    {(!isFirstRow || !mainReason) && (
                      <Reason isCenterAligned={true}>-</Reason>
                    )}

                    {isFirstRow && mainReason && (
                      <>
                        <Reason isCenterAligned={false}>{mainReason}</Reason>
                        <Button
                          type={"button"}
                          size={"small"}
                          width={"55px"}
                          onClick={handleEditReasonModalClick(
                            statusReasonId,
                            reasonStatus,
                            mainReason,
                            detailedReason
                          )}
                          disabled={
                            decryptSaleNameId[nameId] ===
                            OrderStatusName.CANCEL_COMPLETED
                          }
                        >
                          ??????
                        </Button>
                      </>
                    )}
                  </MainReasonTd>
                  <Td type={TableType.SCROLL} width={scrollTableType[3].width}>
                    {(!isFirstRow || !detailedReason) && (
                      <Reason isCenterAligned={true}>-</Reason>
                    )}
                    {isFirstRow && detailedReason && (
                      <Reason isCenterAligned={true}>{detailedReason}</Reason>
                    )}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[4].width}>
                    {completedAt}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[5].width}>
                    {optionName}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[6].width}>
                    <Quantity quantity={optionQuantity}>
                      {optionQuantity}
                    </Quantity>
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[7].width}>
                    {originalPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[8].width}>
                    {optionPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[9].width}>
                    {discountPrice}
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
                    {totalPaymentAmount}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[14].width}>
                    {totalRefundAmout}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[15].width}>
                    {userEmail}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[16].width}>
                    {userPhoneNumber}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[17].width}>
                    {recipientName}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[18].width}>
                    {recipientPhoneNumber}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[19].width}>
                    {refusalAt}
                  </Td>
                  <MainReasonTd
                    type={TableType.SCROLL}
                    width={scrollTableType[20].width}
                  >
                    {(!isFirstRow || !refusalReason) && (
                      <Reason isCenterAligned={true}>-</Reason>
                    )}

                    {isFirstRow && refusalReason && (
                      <>
                        <Reason isCenterAligned={false}>{refusalReason}</Reason>
                        <Button
                          type={"button"}
                          size={"small"}
                          width={"55px"}
                          onClick={handleEditReasonModalClick(
                            refusalStatusReasonId,
                            refusalReasonStatus,
                            refusalReason,
                            refusalDetailedReason
                          )}
                          disabled={
                            decryptSaleNameId[nameId] ===
                            OrderStatusName.CANCEL_COMPLETED
                          }
                        >
                          ??????
                        </Button>
                      </>
                    )}
                  </MainReasonTd>
                  <Td type={TableType.SCROLL} width={scrollTableType[21].width}>
                    {(!isFirstRow || !refusalDetailedReason) && (
                      <Reason isCenterAligned={true}>-</Reason>
                    )}
                    {isFirstRow && refusalDetailedReason && (
                      <Reason isCenterAligned={true}>
                        {refusalDetailedReason}
                      </Reason>
                    )}
                  </Td>
                </Tr>
              )
            )}
        </TdContainer>
      </ScrollTable>

      {!hasCancelOrderItems && (
        <NoDataContainer type={TableType.SCROLL}>
          {query && (
            <>
              ???????????? ????????????
              <br />
              ????????? ????????????.
            </>
          )}

          {!query && (
            <>
              ?????? ?????????
              <br />
              ????????? ????????????.
            </>
          )}
        </NoDataContainer>
      )}

      {loading && <Loading type={TableType.SCROLL} />}
    </TableContainer>
  );
};

const ProductNameTd = styled(Td)`
  justify-content: flex-start;
  padding: 0px;
`;

const ProductThumbNailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 40px;
  height: 100%;
  border-right: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

const ProductThumbNail = styled.img`
  width: 24px;
  height: 24px;
`;

const ProductName = styled.span`
  display: block;

  padding: 0 8px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;

const MainReasonTd = styled(Td)`
  display: flex;
  justify-content: space-between;

  padding: 0px 8px;
`;

const Reason = styled.span<{ isCenterAligned: boolean }>`
  ${({ isCenterAligned }) =>
    isCenterAligned
      ? css`
          margin: 0 auto;
        `
      : css``}
`;

const Quantity = styled.span<{ quantity: number }>`
  color: ${({ theme: { palette }, quantity }) =>
    quantity > 1 ? palette.red900 : palette.black};
`;

export default CancelTable;
