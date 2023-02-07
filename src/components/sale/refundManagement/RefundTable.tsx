import { useEffect, useState } from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import { cloneDeep } from "lodash";
import styled from "styled-components";

import {
  fixTableType,
  scrollTableType,
} from "@constants/sale/refundManagement/table";
import { tableWidth } from "@constants/sale/refundManagement/table";
import {
  commonFilterOptionVar,
  pageNumberListVar,
  totalPageLengthVar,
  checkAllBoxStatusVar,
  paginationVisibilityVar,
  systemModalVar,
} from "@cache/index";

import { TableType } from "@models/index";

import useLazyRefundOrders from "@hooks/order/useLazyRefundOrders";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import {
  FixedTable,
  TableContainer,
  TdContainer,
  Th,
  ThContainer,
  Tr,
  Td,
  ScrollTable,
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
  checkedOrderItemsVar,
  filterOptionVar,
  refundOrderItemsVar,
} from "@cache/sale/refund";
import { NormalizedType, OrderItems, ResetOrderItemType } from "@models/sale";
import constructOrderItem from "@utils/sale/constructOrderItem";
import getResetOrderItems from "@utils/sale/cancel/getResetOrderItems";

const RefundTable = () => {
  const { getOrders, error, loading, data } = useLazyRefundOrders();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const refundOrderItems = useReactiveVar(refundOrderItemsVar);
  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrderItems = cloneDeep(refundOrderItems);
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      const checkAllOrderItem = newOrderItems.map((orderItem) => ({
        ...orderItem,
        isChecked: true,
      }));
      refundOrderItemsVar(checkAllOrderItem);
      checkedOrderItemsVar(checkAllOrderItem);
    }

    if (!e.target.checked) {
      const checkAllOrderItem = newOrderItems.map((orderItem) => ({
        ...orderItem,
        isChecked: false,
      }));

      refundOrderItemsVar(checkAllOrderItem);
      checkedOrderItemsVar([]);
    }
  };

  const changeSingleCheckBoxHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOrderItems = cloneDeep(refundOrderItems);
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
      refundOrderItemsVar(newOrderItems);
    };

  useEffect(() => {
    void (async () => {
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
      totalOrderItems: Array<OrderItems>;
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

    const reconstructOrderItems: NormalizedType =
      constructOrderItem(totalOrderItems);

    const resetOrderItems: Array<ResetOrderItemType> = getResetOrderItems(
      reconstructOrderItems
    );

    refundOrderItemsVar(resetOrderItems);

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

  const hasRefundOrderItems =
    !!refundOrderItems && !!refundOrderItems.length && !loading;
  const isFetchingOrderItemsFailed = !loading && !error && hasRefundOrderItems;

  return (
    <TableContainer
      type={TableType.SCROLL}
      hasData={isFetchingOrderItemsFailed}
    >
      <FixedTable>
        <ThContainer>
          <Th width={fixTableType[0].width} type={TableType.SCROLL}>
            <Checkbox
              onChange={changeAllCheckBoxHandler}
              checked={checkAllBoxStatus}
            />
          </Th>
          <Th width={fixTableType[1].width} type={TableType.SCROLL}>
            {fixTableType[1].label}
          </Th>
          <Th width={fixTableType[2].width} type={TableType.SCROLL}>
            {fixTableType[2].label}
          </Th>
          <Th width={fixTableType[3].width} type={TableType.SCROLL}>
            {fixTableType[3].label}
          </Th>
          <Th width={fixTableType[4].width} type={TableType.SCROLL}>
            {fixTableType[4].label}
          </Th>
          <Th width={fixTableType[5].width} type={TableType.SCROLL}>
            {fixTableType[5].label}
          </Th>
          <Th width={fixTableType[6].width} type={TableType.SCROLL}>
            {fixTableType[6].label}
          </Th>
        </ThContainer>
        <TdContainer>
          {hasRefundOrderItems &&
            refundOrderItems.map(
              (
                {
                  id,
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
                  <Td
                    type={TableType.SCROLL}
                    width={fixTableType[1].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={fixTableType[2].width}
                  ></Td>
                  <ProductNameTd
                    type={TableType.SCROLL}
                    width={fixTableType[3].width}
                  >
                    <ProductThumbNailWrapper>
                      <ProductThumbNail src={encodeURI(thumbnail)} />
                    </ProductThumbNailWrapper>
                    <ProductName>{productName}</ProductName>
                  </ProductNameTd>
                  <Td
                    type={TableType.SCROLL}
                    width={fixTableType[4].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={fixTableType[5].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={fixTableType[6].width}
                  ></Td>
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
          <Th type={TableType.SCROLL} width={scrollTableType[22].width}>
            {scrollTableType[22].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[23].width}>
            {scrollTableType[23].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[24].width}>
            {scrollTableType[24].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[25].width}>
            {scrollTableType[25].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[26].width}>
            {scrollTableType[26].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[27].width}>
            {scrollTableType[27].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[28].width}>
            {scrollTableType[28].label}
          </Th>
        </ThContainer>
        <TdContainer>
          {hasRefundOrderItems &&
            refundOrderItems.map(
              ({
                id,
                paidAt,
                requestAt,
                mainReason,
                detailedReason,
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
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[0].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[1].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[2].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[3].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[4].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[5].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[6].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[7].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[8].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[9].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[10].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[11].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[12].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[13].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[14].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[15].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[16].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[17].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[18].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[19].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[20].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[21].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[22].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[23].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[24].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[25].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[26].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[27].width}
                  ></Td>
                  <Td
                    type={TableType.SCROLL}
                    width={scrollTableType[28].width}
                  ></Td>
                </Tr>
              )
            )}
        </TdContainer>
      </ScrollTable>

      {loading && <Loading type={TableType.SCROLL} />}

      {!hasRefundOrderItems && (
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

  padding: 0 6px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;

export default RefundTable;
