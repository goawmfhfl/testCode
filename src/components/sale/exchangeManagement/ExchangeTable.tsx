import React, { useEffect } from "react";
import { useReactiveVar } from "@apollo/client";

import styled, { css } from "styled-components";
import { OrderStatusGroup } from "@constants/sale";
import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  pageNumberListVar,
  showHasAnyProblemModal,
  totalPageLengthVar,
} from "@cache/index";
import {
  commonCheckedOrderItemsVar,
  commonSaleFilterOptionVar,
} from "@cache/sale";
import { exchangeOrderItemsVar } from "@cache/sale/exchange";
import {
  fixTableType,
  scrollTableType,
  tableWidth,
} from "@constants/sale/exchangeManagement/table";

import { NormalizedType } from "@models/sale";
import { TableType } from "@models/index";
import useLazyExchangeOrders from "@hooks/order/useLazyExchangeOrders";
import constructOrderItem from "@utils/sale/constructOrderItem";

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

const ExchangeTable = () => {
  const { getOrders } = useLazyExchangeOrders();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } = useReactiveVar(
    commonSaleFilterOptionVar
  );

  const exchangerOrderItems = useReactiveVar(exchangeOrderItemsVar);
  const checkedOrderItems = useReactiveVar(commonCheckedOrderItemsVar);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  useEffect(() => {
    void (async () => {
      loadingSpinnerVisibilityVar(true);
      try {
        const {
          data: {
            getOrdersBySeller: {
              ok,
              error,
              totalPages,
              totalResults,
              totalOrderItems,
            },
          },
        } = await getOrders({
          variables: {
            input: {
              page,
              skip,
              query,
              type,
              statusName,
              statusType,
              statusGroup: OrderStatusGroup.REFUND,
            },
          },
          fetchPolicy: "no-cache",
        });

        if (ok) {
          loadingSpinnerVisibilityVar(false);
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

          exchangeOrderItemsVar([]);
          commonCheckedOrderItemsVar([]);
          checkAllBoxStatusVar(false);
        }

        if (error) {
          loadingSpinnerVisibilityVar(false);
          showHasAnyProblemModal(
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
              {error}
            </>
          );
        }
      } catch (error) {
        loadingSpinnerVisibilityVar(false);
        showHasAnyProblemModal(
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
            {error}
          </>
        );
      }
    })();
  }, [page, skip, query, type, statusName, statusType, statusGroup]);

  return (
    <TableContainer type={TableType.SCROLL} hasData={true}>
      <FixedTable>
        <ThContainer>
          <Th type={TableType.SCROLL} width={fixTableType[0].width}>
            <Checkbox
            // onChange={changeAllCheckBoxHandler}
            // checked={checkAllBoxStatus}
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
          <Tr height={80}>
            <Td type={TableType.SCROLL} width={fixTableType[0].width}>
              <Checkbox
              // onChange={changeSingleCheckBoxHandler(index)}
              // checked={isChecked}
              />
            </Td>
            <Td type={TableType.SCROLL} width={fixTableType[1].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[2].width}></Td>
            <ProductNameTd
              type={TableType.SCROLL}
              width={fixTableType[3].width}
            >
              <ProductThumbNailWrapper>
                {/* <ProductThumbNail src={encodeURI(thumbnail)} /> */}
              </ProductThumbNailWrapper>
              <ProductName></ProductName>
            </ProductNameTd>
            <Td type={TableType.SCROLL} width={fixTableType[4].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[5].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[6].width}></Td>
          </Tr>
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
          <Th type={TableType.SCROLL} width={scrollTableType[29].width}>
            {scrollTableType[29].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[30].width}>
            {scrollTableType[30].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[31].width}>
            {scrollTableType[31].label}
          </Th>
        </ThContainer>

        <TdContainer>
          <Tr height={80}>
            <Td type={TableType.SCROLL} width={scrollTableType[0].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[1].width}></Td>
            <MainReasonTd
              type={TableType.SCROLL}
              width={scrollTableType[2].width}
            ></MainReasonTd>
            <Td type={TableType.SCROLL} width={scrollTableType[3].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[4].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[5].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[6].width}>
              <Quantity quantity={0}></Quantity>
            </Td>
            <Td type={TableType.SCROLL} width={scrollTableType[7].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[8].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[9].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[10].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[11].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[12].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[13].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[14].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[15].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[16].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[17].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[18].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[19].width}></Td>
            <MainReasonTd
              type={TableType.SCROLL}
              width={scrollTableType[20].width}
            ></MainReasonTd>
            <Td type={TableType.SCROLL} width={scrollTableType[21].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[22].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[23].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[24].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[25].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[26].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[27].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[28].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[29].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[30].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[31].width}></Td>
          </Tr>
        </TdContainer>
      </ScrollTable>

      {/* {!hasCancelOrderItems && (
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
      )} */}

      {/* {loading && <Loading type={TableType.SCROLL} />} */}
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

export default ExchangeTable;
