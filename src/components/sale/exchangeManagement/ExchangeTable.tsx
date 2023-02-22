import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useReactiveVar } from "@apollo/client";
import axios, { AxiosError } from "axios";
import { cloneDeep } from "lodash";
import styled, { css } from "styled-components";

import {
  decryptSaleNameId,
  decryptSaleTypeId,
  Pathnames,
} from "@constants/index";
import {
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  SendType,
  shipmentCompanyCode,
  ShipmentStatus,
} from "@constants/sale";
import {
  fixTableType,
  scrollTableType,
  tableWidth,
} from "@constants/sale/exchangeManagement/table";
import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  pageNumberListVar,
  showHasAnyProblemModal,
  systemModalVar,
  totalPageLengthVar,
} from "@cache/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import { checkedOrderItemsVar, resetOrderItemsVar } from "@cache/sale";

import { SEND_ORDER_ITEMS } from "@graphql/mutations/sendOrderItems";
import { GET_EXCHANGE_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { EDIT_SHIPMENT_NUMBER } from "@graphql/mutations/editShipmentNumber";

import {
  EditShipmentNumberInputType,
  EditShipmentNumberType,
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale/order";
import { NormalizedType, ResetOrderItemType } from "@models/sale";

import { TableType } from "@models/index";

import useLazyExchangeOrders from "@hooks/order/useLazyExchangeOrders";

import constructOrderItem from "@utils/sale/constructOrderItem";
import getResetOrderItems from "@utils/sale/exchange/getResetOrderItems";

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
import {
  SelectInput,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import NoDataContainer from "@components/common/table/NoDataContainer";
import Button from "@components/common/Button";
import EditReasonModal from "@components/sale/exchangeManagement/EditReasonModal";
import { Input } from "@components/common/input/TextInput";

const ExchangeTable = () => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);

  const { getOrderItems, loading, error } = useLazyExchangeOrders();
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
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
        query: GET_EXCHANGE_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type: orderSearchType,

            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.EXCHANGE,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const [editShipmentNumber] = useMutation<
    EditShipmentNumberType,
    {
      input: EditShipmentNumberInputType;
    }
  >(EDIT_SHIPMENT_NUMBER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_EXCHANGE_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.EXCHANGE,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const orderItems = useReactiveVar(resetOrderItemsVar);
  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

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

  const [shipmentCompanys, setShipmentCompanys] = useState<
    Array<{
      Code: string;
      International: boolean;
      Name: string;
    }>
  >([]);

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

  const changeShipmentCompanyHandler =
    (index: number, shipmentStatus: ShipmentStatus) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newOrderItems = cloneDeep(orderItems);
      const newCheckedOrderItems = cloneDeep(checkedOrderItems);

      if (shipmentStatus === ShipmentStatus.SHIPPING) {
        newOrderItems[index].temporaryShipmentCompany = e.target.value;
      }
      if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP) {
        newOrderItems[index].temporaryPickupShipmentCompany = e.target.value;
      }

      if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP_AGAIN) {
        newOrderItems[index].temporaryPickupAgainShipmentCompany =
          e.target.value;
      }

      resetOrderItemsVar(newOrderItems);

      if (newCheckedOrderItems.length > 0) {
        const findCheckedOrderItemsIndex = newCheckedOrderItems.findIndex(
          (list) => list.id === newOrderItems[index].id
        );

        if (findCheckedOrderItemsIndex !== -1) {
          if (shipmentStatus === ShipmentStatus.SHIPPING) {
            newCheckedOrderItems[
              findCheckedOrderItemsIndex
            ].temporaryShipmentCompany = e.target.value;
          }
          if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP) {
            newCheckedOrderItems[
              findCheckedOrderItemsIndex
            ].temporaryPickupShipmentCompany = e.target.value;
          }
          if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP_AGAIN) {
            newCheckedOrderItems[
              findCheckedOrderItemsIndex
            ].temporaryPickupAgainShipmentCompany = e.target.value;
          }
        }

        checkedOrderItemsVar(newCheckedOrderItems);
      }
    };

  const changeShipmentNumberHandler =
    (index: number, shipmentStatus: ShipmentStatus) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOrderItems = cloneDeep(orderItems);
      const newCheckedOrderItems = cloneDeep(checkedOrderItems);

      if (shipmentStatus === ShipmentStatus.SHIPPING) {
        newOrderItems[index].temporaryShipmentNumber = Number(e.target.value);
      }
      if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP) {
        newOrderItems[index].temporaryPickupShipmentNumber = Number(
          e.target.value
        );
      }
      if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP_AGAIN) {
        newOrderItems[index].temporaryPickupAgainShipmentNumber = Number(
          e.target.value
        );
      }

      resetOrderItemsVar(newOrderItems);

      if (newCheckedOrderItems.length > 0) {
        const findCheckedOrderItemsIndex = newCheckedOrderItems.findIndex(
          (list) => list.id === newOrderItems[index].id
        );

        if (findCheckedOrderItemsIndex !== -1) {
          newCheckedOrderItems[
            findCheckedOrderItemsIndex
          ].temporaryShipmentNumber = Number(e.target.value);

          if (shipmentStatus === ShipmentStatus.SHIPPING) {
            newCheckedOrderItems[
              findCheckedOrderItemsIndex
            ].temporaryShipmentNumber = Number(e.target.value);
          }

          if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP) {
            newCheckedOrderItems[
              findCheckedOrderItemsIndex
            ].temporaryPickupShipmentNumber = Number(e.target.value);
          }

          if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP_AGAIN) {
            newCheckedOrderItems[
              findCheckedOrderItemsIndex
            ].temporaryPickupAgainShipmentNumber = Number(e.target.value);
          }
        }

        checkedOrderItemsVar(newCheckedOrderItems);
      }
    };

  const handleSaveButtonClick =
    (
      orderItemId: number,
      orderShipmentInfoId: number,
      shipmentCompany: string,
      shipmentNumber: number,
      status: ShipmentStatus
    ) =>
    () => {
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
        description: <>송장을 수정하시겠습니까?</>,
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        confirmButtonClickHandler: () => {
          try {
            void (async () => {
              loadingSpinnerVisibilityVar(true);
              const {
                data: {
                  editShipmentNumber: { ok, error },
                },
              } = await editShipmentNumber({
                variables: {
                  input: {
                    orderItemId,
                    orderShipmentInfoId,
                    shipmentCompany,
                    shipmentNumber,
                    status,
                  },
                },
              });

              if (ok) {
                loadingSpinnerVisibilityVar(false);
                const newOrderItems = cloneDeep(orderItems);

                const findOrderItmeIndex = newOrderItems.findIndex(
                  ({ id }) => id === orderItemId
                );
                const filterdOrderItems = newOrderItems.filter(
                  (orderItem) => orderItem.id === orderItemId
                );

                newOrderItems[findOrderItmeIndex].isShipmentInfoEdit = false;

                filterdOrderItems.forEach((_, index) => {
                  newOrderItems[findOrderItmeIndex + index].shipmentCompany =
                    shipmentCompany;
                  newOrderItems[findOrderItmeIndex + index].shipmentNumber =
                    shipmentNumber;
                });

                resetOrderItemsVar(newOrderItems);

                systemModalVar({
                  ...systemModalVar(),
                  isVisible: true,
                  description: (
                    <>
                      송장 수정이
                      <br />
                      완료되었습니다.
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
                showHasServerErrorModal(error, "송장 수정");
              }
            })();
          } catch (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error as string, "송장 수정");
          }
        },
      });
    };

  const handleEditButtonClick =
    (id: number, shipmentStatus: ShipmentStatus) => () => {
      const newOrderItems = cloneDeep(orderItems);

      const findOrderItmeIndex = newOrderItems.findIndex(
        (orderItem) => orderItem.id === id
      );

      if (shipmentStatus === ShipmentStatus.SHIPPING) {
        newOrderItems[findOrderItmeIndex].isShipmentInfoEdit = true;
      }

      if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP) {
        newOrderItems[findOrderItmeIndex].isPickupShipmentInfoEdit = true;
      }

      if (shipmentStatus === ShipmentStatus.EXCHANGE_PICK_UP_AGAIN) {
        newOrderItems[findOrderItmeIndex].isPickupAgainShipmentInfoEdit = true;
      }

      resetOrderItemsVar(newOrderItems);
    };

  const handleSendButtonClick =
    (
      id: number,
      shipmentCompany: string,
      shipmentNumber: number,
      sendType: ShipmentStatus
    ) =>
    () => {
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
              const {
                data: {
                  sendOrderItems: { ok, error },
                },
              } = await sendOrderItems({
                variables: {
                  input: {
                    components: [
                      {
                        orderItemId: id,
                        shipmentCompany,
                        shipmentNumber,
                      },
                    ],
                    type:
                      ShipmentStatus.EXCHANGE_PICK_UP === sendType
                        ? SendType.EXCHANGE_PICK_UP
                        : SendType.EXCHANGE_RESEND,
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

                    checkedOrderItemsVar([]);
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
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    };

  useEffect(() => {
    void (async () => {
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
        } = await getOrderItems({
          variables: {
            input: {
              page,
              skip,
              query,
              type: orderSearchType,
              statusName: decryptSaleNameId[nameId] as OrderStatusName,
              statusType: decryptSaleTypeId[typeId] as OrderStatusType,
              statusGroup: OrderStatusGroup.EXCHANGE,
            },
          },
          fetchPolicy: "no-cache",
          notifyOnNetworkStatusChange: true,
        });

        if (ok) {
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

          resetOrderItemsVar(resetOrderItems);
          checkedOrderItemsVar([]);
          checkAllBoxStatusVar(false);
        }

        if (error) {
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
  }, [page, skip, query, orderSearchType, nameId, typeId]);

  useEffect(() => {
    void (async () => {
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

  const hasExchangeOrderItems = !!orderItems && !!orderItems.length && !loading;
  const isFetchingOrderItemsFailed =
    !loading && !error && hasExchangeOrderItems;

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
          {hasExchangeOrderItems &&
            orderItems.map(
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
          {hasExchangeOrderItems &&
            orderItems.map(
              (
                {
                  id,
                  paidAt,
                  requestAt,
                  mainReason,
                  detailedReason,
                  statusReasonId,
                  reasonStatus,
                  claimStatus,
                  attachedImages,
                  completedAt,

                  shipmentOrderId,
                  shipmentCompany,
                  shipmentNumber,

                  isShipmentInfoEdit,
                  temporaryShipmentCompany,
                  temporaryShipmentNumber,

                  pickupOrderId,
                  pickupShipmentCompany,
                  pickupShipmentNumber,

                  isPickupShipmentInfoEdit,
                  temporaryPickupShipmentCompany,
                  temporaryPickupShipmentNumber,

                  pickupAgainOrderId,
                  pickupAgainShipmentCompany,
                  pickupAgainShipmentNumber,

                  isPickupAgainShipmentInfoEdit,
                  temporaryPickupAgainShipmentCompany,
                  temporaryPickupAgainShipmentNumber,

                  option,
                  quantity,
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
                  recipientAddress,
                  postCode,

                  refusalAt,
                  refusalReason,
                  refusalDetailedReason,
                  refusalReasonStatus,
                  refusalStatusReasonId,

                  colorIndex,
                  rowIndex,
                  isLastRow,
                  isFirstRow,
                },
                index
              ) => (
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
                        >
                          수정
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

                  <AttachedImageTd
                    type={TableType.SCROLL}
                    width={scrollTableType[4].width}
                  >
                    {!!attachedImages && !!attachedImages.length
                      ? attachedImages.map(({ url }) => (
                          <AttachedImage src={encodeURI(url)} />
                        ))
                      : "-"}
                  </AttachedImageTd>

                  <Td type={TableType.SCROLL} width={scrollTableType[5].width}>
                    {completedAt}
                  </Td>

                  <ShipmentColumn
                    type={TableType.SCROLL}
                    width={scrollTableType[6].width + scrollTableType[7].width}
                    as={"form"}
                    action="http://info.sweettracker.co.kr/tracking/5"
                    method="post"
                    target="_black"
                  >
                    <ShipmentTemplateInput
                      type="text"
                      id="t_key"
                      name="t_key"
                      value={process.env.REACT_APP_SWEETTRAKER_API_KEY}
                      readOnly={true}
                    />
                    <ShipmentCompanyTd width={scrollTableType[6].width}>
                      {isFirstRow ? (
                        <>
                          {shipmentCompany ? (
                            isShipmentInfoEdit ? (
                              <Dropdown
                                onChange={changeShipmentCompanyHandler(
                                  index,
                                  ShipmentStatus.SHIPPING
                                )}
                                arrowSrc={triangleArrowSvg}
                                value={temporaryShipmentCompany}
                                sizing={"medium"}
                                width={"104px"}
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
                            ) : (
                              <>
                                <ShipmentTemplateInput
                                  type="text"
                                  id="t_code"
                                  name="t_code"
                                  value={shipmentCompany}
                                  readOnly={true}
                                />
                                {shipmentCompanyCode[shipmentCompany]}
                              </>
                            )
                          ) : (
                            <Dropdown
                              onChange={changeShipmentCompanyHandler(
                                index,
                                ShipmentStatus.SHIPPING
                              )}
                              arrowSrc={triangleArrowSvg}
                              value={temporaryShipmentCompany}
                              sizing={"medium"}
                              width={"104px"}
                              disabled={claimStatus === "환불 완료"}
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
                          )}
                        </>
                      ) : shipmentCompany ? (
                        shipmentCompanyCode[shipmentCompany]
                      ) : (
                        "-"
                      )}
                    </ShipmentCompanyTd>
                    <ShipmnetNumberTd width={scrollTableType[7].width}>
                      {isFirstRow ? (
                        <>
                          {shipmentNumber ? (
                            isShipmentInfoEdit ? (
                              <ShipmnetNumberContainer>
                                <EditShipmentNumberInput
                                  type="text"
                                  onChange={changeShipmentNumberHandler(
                                    index,
                                    ShipmentStatus.SHIPPING
                                  )}
                                  disabled={claimStatus === "환불 완료"}
                                  width={"145px"}
                                  value={
                                    temporaryShipmentNumber === 0
                                      ? ""
                                      : temporaryShipmentNumber
                                  }
                                />
                                <Button
                                  type="button"
                                  size="small"
                                  width="55px"
                                  onClick={handleSaveButtonClick(
                                    id,
                                    shipmentOrderId,
                                    temporaryShipmentCompany,
                                    temporaryShipmentNumber,
                                    ShipmentStatus.SHIPPING
                                  )}
                                >
                                  저장
                                </Button>
                              </ShipmnetNumberContainer>
                            ) : (
                              <ShipmnetNumberContainer>
                                <ShipmnetNumber>
                                  {shipmentNumber}
                                </ShipmnetNumber>
                                <ShipmentTemplateInput
                                  type="text"
                                  id="t_invoice"
                                  name="t_invoice"
                                  value={shipmentNumber}
                                  readOnly={true}
                                />
                                <ButtonContainer>
                                  <Button
                                    size="small"
                                    width="55px"
                                    onClick={handleEditButtonClick(
                                      id,
                                      ShipmentStatus.SHIPPING
                                    )}
                                    disabled={claimStatus === "환불 완료"}
                                    backgroundColor={"#fff"}
                                    borderColor={"#BBC0C6"}
                                    type="button"
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    size="small"
                                    width="55px"
                                    backgroundColor={"#414A5B"}
                                    color={"#fff"}
                                    type="submit"
                                  >
                                    조회
                                  </Button>
                                </ButtonContainer>
                              </ShipmnetNumberContainer>
                            )
                          ) : (
                            <ShipmnetNumberContainer>
                              <ShipmnetNumberInput
                                onChange={changeShipmentNumberHandler(
                                  index,
                                  ShipmentStatus.SHIPPING
                                )}
                                disabled={claimStatus === "환불 완료"}
                                width={"145px"}
                                value={
                                  temporaryShipmentNumber === 0
                                    ? ""
                                    : temporaryShipmentNumber
                                }
                              />
                              <SubmitButton
                                size="small"
                                disabled={claimStatus === "환불 완료"}
                                width={"55px"}
                                backgroundColor={"#fff"}
                                borderColor={"#BBC0C6"}
                                type="button"
                              >
                                발송
                              </SubmitButton>
                            </ShipmnetNumberContainer>
                          )}
                        </>
                      ) : shipmentNumber ? (
                        shipmentNumber
                      ) : (
                        "-"
                      )}
                    </ShipmnetNumberTd>
                  </ShipmentColumn>
                  <ShipmentColumn
                    type={TableType.SCROLL}
                    width={scrollTableType[8].width + scrollTableType[9].width}
                    as={"form"}
                    action="http://info.sweettracker.co.kr/tracking/5"
                    method="post"
                    target="_black"
                  >
                    <ShipmentTemplateInput
                      type="text"
                      id="t_key"
                      name="t_key"
                      value={process.env.REACT_APP_SWEETTRAKER_API_KEY}
                      readOnly={true}
                    />
                    <ShipmentCompanyTd width={scrollTableType[8].width}>
                      {isFirstRow ? (
                        <>
                          {pickupShipmentCompany ? (
                            isPickupShipmentInfoEdit ? (
                              <Dropdown
                                onChange={changeShipmentCompanyHandler(
                                  index,
                                  ShipmentStatus.EXCHANGE_PICK_UP
                                )}
                                arrowSrc={triangleArrowSvg}
                                value={temporaryPickupShipmentCompany}
                                sizing={"medium"}
                                width={"104px"}
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
                            ) : (
                              <>
                                <ShipmentTemplateInput
                                  type="text"
                                  id="t_code"
                                  name="t_code"
                                  value={pickupShipmentCompany}
                                  readOnly={true}
                                />
                                {shipmentCompanyCode[pickupShipmentCompany]}
                              </>
                            )
                          ) : (
                            <Dropdown
                              onChange={changeShipmentCompanyHandler(
                                index,
                                ShipmentStatus.EXCHANGE_PICK_UP
                              )}
                              arrowSrc={triangleArrowSvg}
                              value={temporaryPickupShipmentCompany}
                              sizing={"medium"}
                              width={"104px"}
                              disabled={claimStatus === "환불 완료"}
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
                          )}
                        </>
                      ) : pickupShipmentCompany ? (
                        shipmentCompanyCode[pickupShipmentCompany]
                      ) : (
                        "-"
                      )}
                    </ShipmentCompanyTd>
                    <ShipmnetNumberTd width={scrollTableType[9].width}>
                      {isFirstRow ? (
                        <>
                          {pickupShipmentNumber ? (
                            isPickupShipmentInfoEdit ? (
                              <ShipmnetNumberContainer>
                                <EditShipmentNumberInput
                                  type="text"
                                  onChange={changeShipmentNumberHandler(
                                    index,
                                    ShipmentStatus.EXCHANGE_PICK_UP
                                  )}
                                  width={"145px"}
                                  value={
                                    temporaryPickupShipmentNumber === 0
                                      ? ""
                                      : temporaryPickupShipmentNumber
                                  }
                                />
                                <Button
                                  type="button"
                                  size="small"
                                  width="55px"
                                  onClick={handleSaveButtonClick(
                                    id,
                                    pickupOrderId,
                                    temporaryPickupShipmentCompany,
                                    temporaryPickupShipmentNumber,
                                    ShipmentStatus.EXCHANGE_PICK_UP
                                  )}
                                >
                                  저장
                                </Button>
                              </ShipmnetNumberContainer>
                            ) : (
                              <ShipmnetNumberContainer>
                                <ShipmnetNumber>
                                  {pickupShipmentNumber}
                                </ShipmnetNumber>
                                <ShipmentTemplateInput
                                  type="text"
                                  id="t_invoice"
                                  name="t_invoice"
                                  value={pickupShipmentNumber}
                                  readOnly={true}
                                />
                                <ButtonContainer>
                                  <Button
                                    size="small"
                                    width="55px"
                                    onClick={handleEditButtonClick(
                                      id,
                                      ShipmentStatus.EXCHANGE_PICK_UP
                                    )}
                                    backgroundColor={"#fff"}
                                    borderColor={"#BBC0C6"}
                                    type="button"
                                    disabled={claimStatus === "환불 완료"}
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    size="small"
                                    width="55px"
                                    backgroundColor={"#414A5B"}
                                    color={"#fff"}
                                    type="submit"
                                  >
                                    조회
                                  </Button>
                                </ButtonContainer>
                              </ShipmnetNumberContainer>
                            )
                          ) : (
                            <ShipmnetNumberContainer>
                              <ShipmnetNumberInput
                                onChange={changeShipmentNumberHandler(
                                  index,
                                  ShipmentStatus.EXCHANGE_PICK_UP
                                )}
                                width={"145px"}
                                value={
                                  temporaryPickupShipmentNumber === 0
                                    ? ""
                                    : temporaryPickupShipmentNumber
                                }
                              />
                              <SubmitButton
                                size="small"
                                disabled={claimStatus === "환불 완료"}
                                width={"55px"}
                                backgroundColor={"#414A5B"}
                                color={"#fff"}
                                type="button"
                                onClick={handleSendButtonClick(
                                  id,
                                  temporaryPickupShipmentCompany,
                                  temporaryPickupShipmentNumber,
                                  ShipmentStatus.EXCHANGE_PICK_UP
                                )}
                              >
                                수거
                              </SubmitButton>
                            </ShipmnetNumberContainer>
                          )}
                        </>
                      ) : pickupShipmentNumber ? (
                        pickupShipmentNumber
                      ) : (
                        "-"
                      )}
                    </ShipmnetNumberTd>
                  </ShipmentColumn>
                  <ShipmentColumn
                    type={TableType.SCROLL}
                    width={
                      scrollTableType[10].width + scrollTableType[11].width
                    }
                    as={"form"}
                    action="http://info.sweettracker.co.kr/tracking/5"
                    method="post"
                    target="_black"
                  >
                    <ShipmentTemplateInput
                      type="text"
                      id="t_key"
                      name="t_key"
                      value={process.env.REACT_APP_SWEETTRAKER_API_KEY}
                      readOnly={true}
                    />
                    <ShipmentCompanyTd width={scrollTableType[10].width}>
                      {isFirstRow ? (
                        <>
                          {pickupAgainShipmentCompany ? (
                            isPickupAgainShipmentInfoEdit ? (
                              <Dropdown
                                onChange={changeShipmentCompanyHandler(
                                  index,
                                  ShipmentStatus.EXCHANGE_PICK_UP_AGAIN
                                )}
                                arrowSrc={triangleArrowSvg}
                                value={temporaryPickupAgainShipmentCompany}
                                sizing={"medium"}
                                width={"104px"}
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
                            ) : (
                              <>
                                <ShipmentTemplateInput
                                  type="text"
                                  id="t_code"
                                  name="t_code"
                                  value={pickupAgainShipmentCompany}
                                  readOnly={true}
                                />
                                {
                                  shipmentCompanyCode[
                                    pickupAgainShipmentCompany
                                  ]
                                }
                              </>
                            )
                          ) : (
                            <Dropdown
                              onChange={changeShipmentCompanyHandler(
                                index,
                                ShipmentStatus.EXCHANGE_PICK_UP_AGAIN
                              )}
                              arrowSrc={triangleArrowSvg}
                              value={temporaryPickupAgainShipmentCompany}
                              sizing={"medium"}
                              width={"104px"}
                              disabled={claimStatus === "환불 완료"}
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
                          )}
                        </>
                      ) : pickupAgainShipmentCompany ? (
                        shipmentCompanyCode[pickupAgainShipmentCompany]
                      ) : (
                        "-"
                      )}
                    </ShipmentCompanyTd>
                    <ShipmnetNumberTd width={scrollTableType[11].width}>
                      {isFirstRow ? (
                        <>
                          {pickupAgainShipmentNumber ? (
                            isPickupAgainShipmentInfoEdit ? (
                              <ShipmnetNumberContainer>
                                <EditShipmentNumberInput
                                  type="text"
                                  onChange={changeShipmentNumberHandler(
                                    index,
                                    ShipmentStatus.EXCHANGE_PICK_UP_AGAIN
                                  )}
                                  width={"145px"}
                                  value={
                                    temporaryPickupAgainShipmentNumber === 0
                                      ? ""
                                      : temporaryPickupAgainShipmentNumber
                                  }
                                />
                                <Button
                                  type="button"
                                  size="small"
                                  width="55px"
                                  onClick={handleSaveButtonClick(
                                    id,
                                    pickupAgainOrderId,
                                    temporaryPickupAgainShipmentCompany,
                                    temporaryPickupAgainShipmentNumber,
                                    ShipmentStatus.EXCHANGE_PICK_UP_AGAIN
                                  )}
                                >
                                  저장
                                </Button>
                              </ShipmnetNumberContainer>
                            ) : (
                              <ShipmnetNumberContainer>
                                <ShipmnetNumber>
                                  {pickupAgainShipmentNumber}
                                </ShipmnetNumber>
                                <ShipmentTemplateInput
                                  type="text"
                                  id="t_invoice"
                                  name="t_invoice"
                                  value={pickupAgainShipmentNumber}
                                  readOnly={true}
                                />
                                <ButtonContainer>
                                  <Button
                                    size="small"
                                    width="55px"
                                    onClick={handleEditButtonClick(
                                      id,
                                      ShipmentStatus.EXCHANGE_PICK_UP_AGAIN
                                    )}
                                    backgroundColor={"#fff"}
                                    borderColor={"#BBC0C6"}
                                    type="button"
                                    disabled={claimStatus === "환불 완료"}
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    size="small"
                                    width="55px"
                                    backgroundColor={"#414A5B"}
                                    color={"#fff"}
                                    type="submit"
                                  >
                                    조회
                                  </Button>
                                </ButtonContainer>
                              </ShipmnetNumberContainer>
                            )
                          ) : (
                            <ShipmnetNumberContainer>
                              <ShipmnetNumberInput
                                onChange={changeShipmentNumberHandler(
                                  index,
                                  ShipmentStatus.EXCHANGE_PICK_UP_AGAIN
                                )}
                                width={"145px"}
                                value={
                                  temporaryPickupAgainShipmentNumber === 0
                                    ? ""
                                    : temporaryPickupAgainShipmentNumber
                                }
                              />
                              <SubmitButton
                                size="small"
                                width={"55px"}
                                backgroundColor={"#414A5B"}
                                color={"#fff"}
                                type="button"
                                onClick={handleSendButtonClick(
                                  id,
                                  temporaryPickupAgainShipmentCompany,
                                  temporaryPickupAgainShipmentNumber,
                                  ShipmentStatus.EXCHANGE_PICK_UP_AGAIN
                                )}
                              >
                                재발송
                              </SubmitButton>
                            </ShipmnetNumberContainer>
                          )}
                        </>
                      ) : pickupAgainShipmentNumber ? (
                        pickupAgainShipmentNumber
                      ) : (
                        "-"
                      )}
                    </ShipmnetNumberTd>
                  </ShipmentColumn>
                  <Td type={TableType.SCROLL} width={scrollTableType[12].width}>
                    {option}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[13].width}>
                    <Quantity quantity={quantity}>{quantity}</Quantity>
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[14].width}>
                    {originalPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[15].width}>
                    {optionPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[16].width}>
                    {discountPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[17].width}>
                    {totalPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[18].width}>
                    {shipmentPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[19].width}>
                    {shipmentDistantPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[20].width}>
                    {totalPaymentAmount}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[21].width}>
                    {userEmail}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[22].width}>
                    {userPhoneNumber}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[23].width}>
                    {recipientName}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[24].width}>
                    {recipientPhoneNumber}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[25].width}>
                    {recipientAddress}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[26].width}>
                    {postCode}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[27].width}>
                    {/* 재배송지 */}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[28].width}>
                    {/* 재배송지 우편번호*/}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[29].width}>
                    {refusalAt}
                  </Td>
                  <MainReasonTd
                    type={TableType.SCROLL}
                    width={scrollTableType[30].width}
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
                          disabled={
                            decryptSaleNameId[nameId] ===
                              OrderStatusName.REFUND_COMPLETED ||
                            claimStatus === "환불 오류"
                          }
                          onClick={handleEditReasonModalClick(
                            refusalStatusReasonId,
                            refusalReasonStatus,
                            refusalReason,
                            refusalDetailedReason
                          )}
                        >
                          수정
                        </Button>
                      </>
                    )}
                  </MainReasonTd>
                  <Td type={TableType.SCROLL} width={scrollTableType[31].width}>
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

      {!hasExchangeOrderItems && (
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

const AttachedImageTd = styled(Td)`
  gap: 6px;
`;

const AttachedImage = styled.img`
  height: 24px;
  width: 24px;
`;
const ShipmentColumn = styled(Td)`
  padding: 0px;
`;

const ShipmnetNumberInput = styled(Input)`
  margin-right: 0px;
`;

const EditShipmentNumberInput = styled(Input)`
  margin-right: 4px;
`;

const ShipmentCompanyTd = styled.div<{ width: number }>`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: ${({ width }) => `${width}px`};
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.palette.grey500};
`;

const ShipmnetNumberTd = styled.div<{ width: number }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => `${width}px`};
  overflow: hidden;
`;

const ShipmnetNumberContainer = styled.div`
  width: 100%;
  padding: 0px 8px 0px 8px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ShipmnetNumber = styled.span`
  width: 100%;
  margin-right: 8px;

  text-align: center;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ShipmentTemplateInput = styled.input`
  display: none;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const SubmitButton = styled(Button)`
  border-left: none;
`;

const Dropdown = styled(SelectInput)`
  padding-right: 16px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Quantity = styled.span<{ quantity: number }>`
  color: ${({ theme: { palette }, quantity }) =>
    quantity > 1 ? palette.red900 : palette.black};
`;

export default ExchangeTable;
