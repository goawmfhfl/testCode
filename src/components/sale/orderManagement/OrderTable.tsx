import { useEffect, useState } from "react";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import { useMutation, useReactiveVar } from "@apollo/client";
import { cloneDeep } from "lodash";
import { TableType } from "@models/index";

import {
  fixTableType,
  scrollTableType,
  tableWidth,
} from "@constants/sale/orderManagement/table";

import { filterOptionVar } from "@cache/sale/orderManagement";
import {
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  showHasAnyProblemModal,
  systemModalVar,
  totalPageLengthVar,
} from "@cache/index";
import { checkedOrderItemsVar } from "@cache/sale";
import { showHasServerErrorModal } from "@cache/productManagement/index";

import {
  NormalizedListType,
  ResetOrderItemType,
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale/order";

import resetOrderItems from "@utils/sale/resetOrderItems";
import contructOrderItem from "@utils/sale/contructOrderItem";
import { preventNaNValues } from "@utils/index";

import {
  checkAllBoxStatusVar,
  pageNumberListVar,
  paginationVisibilityVar,
} from "@cache/index";

import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { OrderItemsType } from "@models/sale/order";
import { SEND_ORDERITEMS } from "@graphql/mutations/sendOrderItems";

import useLazyOrders from "@hooks/order/useLazyOrders";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
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

const OrderTable = () => {
  const { getOrderItem, error, loading, data } = useLazyOrders();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

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

  const [orderItems, setOrderItems] = useState<Array<ResetOrderItemType>>([]);
  const [shipmentCompanys, setShipmentCompanys] = useState<
    Array<{
      Code: string;
      International: boolean;
      Name: string;
    }>
  >([]);

  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const checkedOrderItemIds = checkedOrderItems.map(({ id }) => id);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrderItems = cloneDeep(orderItems);
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      const checkAllOrderItem = newOrderItems.map((orderItem) => ({
        ...orderItem,
        isChecked: true,
      }));

      setOrderItems(checkAllOrderItem);
      checkedOrderItemsVar(checkAllOrderItem);
    }

    if (!e.target.checked) {
      const checkAllOrderItem = newOrderItems.map((orderItem) => ({
        ...orderItem,
        isChecked: false,
      }));

      setOrderItems(checkAllOrderItem);
      checkedOrderItemsVar([]);
    }
  };

  const changeSingleCheckBoxHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOrderItems = cloneDeep(orderItems);

      if (e.target.checked) {
        const checkedOrderItem = { ...newOrderItems[index], isChecked: true };
        checkedOrderItemsVar([...checkedOrderItems, checkedOrderItem]);

        newOrderItems[index].isChecked = true;
        setOrderItems(newOrderItems);
      }

      if (!e.target.checked) {
        const hasCheckedList = checkedOrderItems.filter(
          (orderItem) => orderItem.id === newOrderItems[index].id
        );

        if (hasCheckedList) {
          const checkedListIndex = checkedOrderItems.findIndex(
            (orderItem) => orderItem.id === newOrderItems[index].id
          );

          const deletedCheckedList = [
            ...checkedOrderItems.slice(0, checkedListIndex),
            ...checkedOrderItems.slice(checkedListIndex + 1),
          ];

          checkedOrderItemsVar(deletedCheckedList);

          newOrderItems[index].isChecked = false;

          setOrderItems(newOrderItems);
        }

        newOrderItems[index].isChecked = false;
        setOrderItems(newOrderItems);
      }
    };

  const changeShipmentNumberHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOrderItems = cloneDeep(orderItems);
      newOrderItems[index].temporaryShipmentNumber = e.target.value;
      setOrderItems(newOrderItems);
    };

  const changeShipmentCompanyHandler =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newOrderItems = cloneDeep(orderItems);
      newOrderItems[index].temporaryShipmentCompany = e.target.value;
      setOrderItems(newOrderItems);
    };

  const handleSendButtonClick =
    (id: number, shipmentCompany: string, shipmentNumber: string) => () => {
      if (!shipmentCompany || !shipmentNumber) {
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
                    shipmentCompany,
                    shipmentNumber: Number(shipmentNumber),
                    orderItemIds: [id],
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getOrderItem({
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
      totalOrderItems: Array<OrderItemsType>;
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

    const nomalizedOrderItem: NormalizedListType =
      contructOrderItem(totalOrderItems);

    const orderItems: Array<ResetOrderItemType> =
      resetOrderItems(nomalizedOrderItem);

    setOrderItems(orderItems);

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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        const parameter = {
          params: { t_key: process.env.REACT_APP_SWEETTRAKER_API_KEY },
        };

        const response = await axios.get(
          "https://info.sweettracker.co.kr/api/v1/companylist",
          parameter
        );

        const {
          data: { Company },
        } = response as {
          data: {
            Company: Array<{
              Code: string;
              International: boolean;
              Name: string;
            }>;
          };
        };

        setShipmentCompanys(Company);
      } catch (error) {
        const errors = error as Error | AxiosError;

        if (axios.isAxiosError(errors)) {
          const { msg } = errors.response.data as {
            status: boolean;
            msg: string;
            code: string;
          };

          showHasServerErrorModal(msg, "택배사 리스트 요청");
        }
      }
    })();
  }, []);

  const hasOrderItems = !loading && !error && !!orderItems?.length;

  return (
    <TableContainer type={TableType.SCROLL} hasData={hasOrderItems}>
      <FixedTable width={tableWidth.left}>
        <ThContainer>
          <Th width={fixTableType[0].width}>
            <Checkbox
              onChange={changeAllCheckBoxHandler}
              checked={checkAllBoxStatus}
            />
          </Th>
          <Th width={fixTableType[1].width}>{fixTableType[1].label}</Th>
          <Th width={fixTableType[2].width}>{fixTableType[2].label}</Th>
          <Th width={fixTableType[3].width}>{fixTableType[3].label}</Th>
          <Th width={fixTableType[4].width}>{fixTableType[4].label}</Th>
          <Th width={fixTableType[5].width}>{fixTableType[5].label}</Th>
        </ThContainer>
        <TdContainer>
          {hasOrderItems &&
            orderItems.map(
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
                  <Td width={fixTableType[0].width}>
                    <Checkbox
                      onChange={changeSingleCheckBoxHandler(index)}
                      checked={isChecked}
                    />
                  </Td>
                  <Td width={fixTableType[1].width}>{merchantItemUid}</Td>
                  <Td width={fixTableType[2].width}>{productCode}</Td>
                  <Td width={fixTableType[3].width}>{orderProduct}</Td>
                  <Td width={fixTableType[4].width}>{userName}</Td>
                  <Td width={fixTableType[5].width}>{orderStatus}</Td>
                </Tr>
              )
            )}
        </TdContainer>
      </FixedTable>
      <ScrollTable width={tableWidth.right}>
        <ThContainer>
          <Th width={scrollTableType[0].width}>{scrollTableType[0].label}</Th>
          <Th width={scrollTableType[1].width}>{scrollTableType[1].label}</Th>
          <Th width={scrollTableType[2].width}>{scrollTableType[2].label}</Th>
          <Th width={scrollTableType[3].width}>{scrollTableType[3].label}</Th>
          <Th width={scrollTableType[4].width}>{scrollTableType[4].label}</Th>
          <Th width={scrollTableType[5].width}>{scrollTableType[5].label}</Th>
          <Th width={scrollTableType[6].width}>{scrollTableType[6].label}</Th>
          <Th width={scrollTableType[7].width}>{scrollTableType[7].label}</Th>
          <Th width={scrollTableType[8].width}>{scrollTableType[8].label}</Th>
          <Th width={scrollTableType[9].width}>{scrollTableType[9].label}</Th>
          <Th width={scrollTableType[10].width}>{scrollTableType[10].label}</Th>
          <Th width={scrollTableType[11].width}>{scrollTableType[11].label}</Th>
          <Th width={scrollTableType[12].width}>{scrollTableType[12].label}</Th>
          <Th width={scrollTableType[13].width}>{scrollTableType[13].label}</Th>
          <Th width={scrollTableType[14].width}>{scrollTableType[14].label}</Th>
          <Th width={scrollTableType[15].width}>{scrollTableType[15].label}</Th>
          <Th width={scrollTableType[16].width}>{scrollTableType[16].label}</Th>
          <Th width={scrollTableType[17].width}>{scrollTableType[17].label}</Th>
        </ThContainer>

        <TdContainer>
          {hasOrderItems &&
            orderItems.map(
              (
                {
                  id,
                  claimStatus,
                  orderStatus,
                  shipmentCompany,
                  invoiceNumber,
                  payments,
                  recipientName,
                  recipientPhoneNumber,
                  recipientAddress,
                  postCode,
                  shipmentMemo,
                  userEmail,
                  userPhoneNumber,
                  option,
                  quantity,
                  price,
                  optionPrice,
                  totalPrice,
                  shipmentPrice,
                  shipmentDistantPrice,
                  temporaryShipmentCompany,
                  temporaryShipmentNumber,
                },
                index
              ) => (
                <Tr key={id}>
                  <Td width={scrollTableType[0].width}>{claimStatus}</Td>
                  <Td width={scrollTableType[1].width}>
                    <Dropdown
                      onChange={changeShipmentCompanyHandler(index)}
                      arrowSrc={triangleArrowSvg}
                      value={temporaryShipmentCompany}
                      sizing={"medium"}
                      width={"104px"}
                      disabled={orderStatus === "새주문"}
                    >
                      <Option hidden value="default">
                        택배사
                      </Option>
                      {shipmentCompanys.map(({ Code, Name }) => (
                        <Option key={Code} value={Code}>
                          {Name}
                        </Option>
                      ))}
                    </Dropdown>
                  </Td>
                  <Td width={scrollTableType[2].width}>
                    {invoiceNumber ? (
                      invoiceNumber
                    ) : (
                      <>
                        <InvoiceNumberInput
                          onChange={changeShipmentNumberHandler(index)}
                          disabled={orderStatus === "새주문"}
                          width={"145px"}
                          value={temporaryShipmentNumber}
                          onKeyDown={preventNaNValues}
                        />
                        <Button
                          size="small"
                          disabled={orderStatus === "새주문"}
                          width={"55px"}
                          onClick={handleSendButtonClick(
                            id,
                            temporaryShipmentCompany,
                            temporaryShipmentNumber
                          )}
                        >
                          발송
                        </Button>
                      </>
                    )}
                  </Td>
                  <Td width={scrollTableType[3].width}>{payments}</Td>
                  <Td width={scrollTableType[4].width}>{recipientName}</Td>
                  <Td width={scrollTableType[5].width}>
                    {recipientPhoneNumber}
                  </Td>
                  <Td width={scrollTableType[6].width}>{recipientAddress}</Td>
                  <Td width={scrollTableType[7].width}>{postCode}</Td>
                  <Td width={scrollTableType[8].width}>{shipmentMemo}</Td>
                  <Td width={scrollTableType[9].width}>{userEmail}</Td>
                  <Td width={scrollTableType[10].width}>{userPhoneNumber}</Td>
                  <Td width={scrollTableType[11].width}>{option}</Td>
                  <Td width={scrollTableType[12].width}>{quantity}</Td>
                  <Td width={scrollTableType[13].width}>{price}</Td>
                  <Td width={scrollTableType[14].width}>{optionPrice}</Td>
                  <Td width={scrollTableType[15].width}>{totalPrice}</Td>
                  <Td width={scrollTableType[16].width}>{shipmentPrice}</Td>
                  <Td width={scrollTableType[17].width}>
                    {shipmentDistantPrice}
                  </Td>
                </Tr>
              )
            )}
        </TdContainer>
      </ScrollTable>

      {orderItems?.length === 0 && !loading && (
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

const Dropdown = styled(SelectInput)`
  padding-right: 16px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const InvoiceNumberInput = styled(Input)`
  margin-right: 0px;
`;

export default OrderTable;
