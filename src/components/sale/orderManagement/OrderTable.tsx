import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components/macro";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { cloneDeep } from "lodash";

import { decryptSaleTypeId, decryptSaleNameId } from "@constants/index";
import {
  fixTableType,
  scrollTableType,
  tableWidth,
} from "@constants/sale/orderManagement/table";

import {
  ShipmentStatus,
  shipmentCompanyCode,
  SendType,
  OrderStatusGroup,
  OrderStatusType,
  OrderStatusName,
} from "@constants/sale";

import {
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  systemModalVar,
  totalPageLengthVar,
  checkAllBoxStatusVar,
  pageNumberListVar,
  paginationVisibilityVar,
  showHasAnyProblemModal,
} from "@cache/index";

import { checkedOrderItemsVar, resetOrderItemsVar } from "@cache/sale";
import { showHasServerErrorModal } from "@cache/productManagement/index";

import { TableType } from "@models/index";
import {
  EditShipmentNumberInputType,
  EditShipmentNumberType,
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale/order";
import { ResetOrderItemType, NormalizedListType } from "@models/sale";

import { preventNaNValues } from "@utils/index";
import getResetOrderItems from "@utils/sale/order/getResetOrderItems";
import constructOrderItem from "@utils/sale/constructOrderItem";

import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { SEND_ORDER_ITEMS } from "@graphql/mutations/sendOrderItems";
import { EDIT_SHIPMENT_NUMBER } from "@graphql/mutations/editShipmentNumber";

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
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

  const { loading, error, data } = useQuery<
    GetOrdersBySellerType,
    { input: GetOrdersBySellerInputType }
  >(GET_ORDERS_BY_SELLER, {
    variables: {
      input: {
        page,
        skip,
        query,
        type: orderSearchType,
        statusName: decryptSaleNameId[nameId] as OrderStatusName,
        statusType: decryptSaleTypeId[typeId] as OrderStatusType,
        statusGroup: OrderStatusGroup.ORDER,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const [sendOrderItems] = useMutation<
    SendOrderItemsType,
    {
      input: SendOrderItemsInputType;
    }
  >(SEND_ORDER_ITEMS, {
    fetchPolicy: "network-only",
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
            statusGroup: OrderStatusGroup.ORDER,
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
    fetchPolicy: "network-only",
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
            statusGroup: OrderStatusGroup.ORDER,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const resetOrderItems =
    useReactiveVar<Array<ResetOrderItemType>>(resetOrderItemsVar);

  const [shipmentCompanys, setShipmentCompanys] = useState<
    Array<{
      Code: string;
      International: boolean;
      Name: string;
    }>
  >([]);

  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOrderItems = cloneDeep(resetOrderItems);
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
      const newOrderItems = cloneDeep(resetOrderItems);
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

  const changeShipmentNumberHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOrderItems = cloneDeep(resetOrderItems);
      const newCheckedOrderItems = cloneDeep(checkedOrderItems);

      newOrderItems[index].temporaryShipmentNumber = Number(e.target.value);
      resetOrderItemsVar(newOrderItems);

      if (newCheckedOrderItems.length > 0) {
        const findCheckedOrderItemsIndex = newCheckedOrderItems.findIndex(
          (list) => list.id === newOrderItems[index].id
        );

        if (findCheckedOrderItemsIndex !== -1) {
          newCheckedOrderItems[
            findCheckedOrderItemsIndex
          ].temporaryShipmentNumber = Number(e.target.value);
        }

        checkedOrderItemsVar(newCheckedOrderItems);
      }
    };

  const changeShipmentCompanyHandler =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newOrderItems = cloneDeep(resetOrderItems);
      const newCheckedOrderItems = cloneDeep(checkedOrderItems);

      newOrderItems[index].temporaryShipmentCompany = e.target.value;
      resetOrderItemsVar(newOrderItems);

      if (newCheckedOrderItems.length > 0) {
        const findCheckedOrderItemsIndex = newCheckedOrderItems.findIndex(
          (list) => list.id === newOrderItems[index].id
        );

        if (findCheckedOrderItemsIndex !== -1) {
          newCheckedOrderItems[
            findCheckedOrderItemsIndex
          ].temporaryShipmentCompany = e.target.value;
        }

        checkedOrderItemsVar(newCheckedOrderItems);
      }
    };

  const handleSendButtonClick =
    (id: number, shipmentCompany: string, shipmentNumber: number) => () => {
      if (!shipmentCompany || !shipmentNumber) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: <>??????????????? ??????????????????</>,
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
            ?????? ????????? <br />
            ???????????? ???????????????????
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
                        shipmentNumber: String(shipmentNumber),
                      },
                    ],
                    type: SendType.SEND,
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
                      ????????? ?????????????????????
                      <br />
                      (??????????????? ?????? ??????)
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
                showHasServerErrorModal(error, "?????? ??????");
              }
            })();
          } catch (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error as string, "?????? ??????");
          }
        },
      });
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
          description: <>??????????????? ??????????????????</>,
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
        description: <>????????? ?????????????????????????</>,
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
                const newOrderItems = cloneDeep(resetOrderItems);

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
                      ?????? ?????????
                      <br />
                      ?????????????????????.
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
                showHasServerErrorModal(error, "?????? ??????");
              }
            })();
          } catch (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error as string, "?????? ??????");
          }
        },
      });
    };

  const handleEditButtonClick = (id: number) => () => {
    const newOrderItems = cloneDeep(resetOrderItems);

    const findOrderItmeIndex = newOrderItems.findIndex(
      (orderItem) => orderItem.id === id
    );
    newOrderItems[findOrderItmeIndex].isShipmentInfoEdit = true;
    resetOrderItemsVar(newOrderItems);
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

  useEffect(() => {
    paginationVisibilityVar(loading || error);
  }, [loading]);

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

          showHasServerErrorModal(msg, "????????? ????????? ??????");
        }
      }
    })();
  }, []);

  const hasOrderItems = !loading && !error && !!resetOrderItems?.length;

  return (
    <TableContainer type={TableType.SCROLL} hasData={hasOrderItems}>
      <FixedTable>
        <ThContainer>
          <Th width={fixTableType[0].width} type={TableType.SCROLL}>
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
          <Th type={TableType.SCROLL} width={fixTableType[5].width}>
            {fixTableType[6].label}
          </Th>
        </ThContainer>
        <TdContainer>
          {!loading &&
            resetOrderItems?.map(
              (
                {
                  rowIndex,
                  merchantUid,
                  merchantItemUid,
                  thumbnail,
                  productName,
                  userName,
                  orderStatus,
                  claimStatus,
                  isChecked,
                  colorIndex,
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
        </ThContainer>

        <TdContainer>
          {!loading &&
            resetOrderItems?.map(
              (
                {
                  id,
                  rowIndex,
                  colorIndex,
                  orderStatus,
                  shipmentOrderId,
                  shipmentCompany,
                  shipmentNumber,
                  paidAt,
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
                  discountPrice,
                  totalPrice,
                  shipmentPrice,
                  shipmentDistantPrice,
                  totalPaymentAmount,
                  isShipmentInfoEdit,
                  temporaryShipmentCompany,
                  temporaryShipmentNumber,
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
                  <ShipmentColumn
                    type={TableType.SCROLL}
                    width={scrollTableType[0].width + scrollTableType[1].width}
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
                    <ShipmentCompanyTd width={scrollTableType[0].width}>
                      {isFirstRow ? (
                        <>
                          {shipmentCompany ? (
                            isShipmentInfoEdit ? (
                              <Dropdown
                                onChange={changeShipmentCompanyHandler(index)}
                                arrowSrc={triangleArrowSvg}
                                value={temporaryShipmentCompany}
                                sizing={"medium"}
                                width={"104px"}
                                disabled={orderStatus === "?????????"}
                              >
                                <Option hidden value="default">
                                  ?????????
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
                              onChange={changeShipmentCompanyHandler(index)}
                              arrowSrc={triangleArrowSvg}
                              value={temporaryShipmentCompany}
                              sizing={"medium"}
                              width={"104px"}
                              disabled={orderStatus === "?????????"}
                            >
                              <Option hidden value="default">
                                ?????????
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
                    <ShipmnetNumberTd width={scrollTableType[1].width}>
                      {isFirstRow ? (
                        <>
                          {shipmentNumber ? (
                            isShipmentInfoEdit ? (
                              <ShipmnetNumberContainer>
                                <EditShipmentNumberInput
                                  type="text"
                                  onChange={changeShipmentNumberHandler(index)}
                                  disabled={orderStatus === "?????????"}
                                  width={"145px"}
                                  onKeyDown={preventNaNValues}
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
                                  ??????
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
                                    onClick={handleEditButtonClick(id)}
                                    backgroundColor={"#fff"}
                                    borderColor={"#BBC0C6"}
                                    type="button"
                                  >
                                    ??????
                                  </Button>
                                  <Button
                                    size="small"
                                    width="55px"
                                    backgroundColor={"#414A5B"}
                                    color={"#fff"}
                                    type="submit"
                                  >
                                    ??????
                                  </Button>
                                </ButtonContainer>
                              </ShipmnetNumberContainer>
                            )
                          ) : (
                            <ShipmnetNumberContainer>
                              <ShipmnetNumberInput
                                onChange={changeShipmentNumberHandler(index)}
                                disabled={orderStatus === "?????????"}
                                width={"145px"}
                                value={
                                  temporaryShipmentNumber === 0
                                    ? ""
                                    : temporaryShipmentNumber
                                }
                                onKeyDown={preventNaNValues}
                              />
                              <SubmitButton
                                size="small"
                                disabled={orderStatus === "?????????"}
                                width={"55px"}
                                onClick={handleSendButtonClick(
                                  id,
                                  temporaryShipmentCompany,
                                  temporaryShipmentNumber
                                )}
                                backgroundColor={"#fff"}
                                borderColor={"#BBC0C6"}
                                type="button"
                              >
                                ??????
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

                  <Td type={TableType.SCROLL} width={scrollTableType[2].width}>
                    {paidAt}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[3].width}>
                    {recipientName}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[4].width}>
                    {recipientPhoneNumber}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[5].width}>
                    <RecipientAddressWrapper>
                      {recipientAddress}
                    </RecipientAddressWrapper>
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[6].width}>
                    {postCode}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[7].width}>
                    {shipmentMemo}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[8].width}>
                    {userEmail}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[9].width}>
                    {userPhoneNumber}
                  </Td>
                  <OptionTd
                    type={TableType.SCROLL}
                    width={scrollTableType[10].width}
                  >
                    <OptionWrapper>{option}</OptionWrapper>
                  </OptionTd>
                  <Td type={TableType.SCROLL} width={scrollTableType[11].width}>
                    <Quantity quantity={quantity}>{quantity}</Quantity>
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[12].width}>
                    {price}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[13].width}>
                    {optionPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[14].width}>
                    {discountPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[15].width}>
                    {totalPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[16].width}>
                    {shipmentPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[17].width}>
                    {shipmentDistantPrice}
                  </Td>
                  <Td type={TableType.SCROLL} width={scrollTableType[18].width}>
                    {totalPaymentAmount}
                  </Td>
                </Tr>
              )
            )}
        </TdContainer>
      </ScrollTable>

      {!hasOrderItems && (
        <NoDataContainer type={TableType.SCROLL}>
          {query && (
            <>
              ???????????? ????????????
              <br />y ????????? ????????????.
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

  min-width: 56px;
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

const ShipmentColumn = styled(Td)`
  padding: 0px;
`;

const Dropdown = styled(SelectInput)`
  padding-right: 16px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

const OptionTd = styled(Td)`
  margin: 0 auto;
`;

const OptionWrapper = styled.span`
  text-align: center;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const RecipientAddressWrapper = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;

const Quantity = styled.span<{ quantity: number }>`
  color: ${({ theme: { palette }, quantity }) =>
    quantity > 1 ? palette.red900 : palette.black};
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const SubmitButton = styled(Button)`
  border-left: none;
`;

export default OrderTable;
