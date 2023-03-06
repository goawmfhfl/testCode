import React from "react";
import * as xlsx from "xlsx";
import {
  fixTableType,
  scrollTableType,
} from "@constants/sale/exchangeManagement/table";
import Button from "@components/common/Button";
import { showHasAnyProblemModal } from "@cache/index";
import { showHasServerErrorModal } from "@cache/productManagement";

import useLazyExchangeOrders from "@hooks/order/useLazyExchangeOrders";
import { NormalizedListType, ResetOrderItemType } from "@models/sale";

import constructOrderItem from "@utils/sale/constructOrderItem";
import getResetOrderItems from "@utils/sale/exchange/getResetOrderItems";
import { OrderStatusGroup, shipmentCompanyCode } from "@constants/sale";

interface ExportToExcelButtonType {
  children: React.ReactNode;
}
const ExportAllExcelButton = ({ children }: ExportToExcelButtonType) => {
  const { getOrderItems } = useLazyExchangeOrders();
  const tableData = [...fixTableType, ...scrollTableType];

  const tableHeadInitialValue: Array<string> = [];
  const tableWidthInitialValue: Array<{ wpx: number }> = [];

  const tableHead = tableData.reduce((result, { label }) => {
    if (label !== "checkBox") result.push(label);
    return result;
  }, tableHeadInitialValue);

  const tableWidth = tableData.reduce((result, { label, width }) => {
    if (label !== "checkBox") result.push({ wpx: width });
    return result;
  }, tableWidthInitialValue);

  const handleCreateXlsxHandler = () => {
    void (async () => {
      try {
        const {
          data: {
            getOrdersBySeller: { ok, error, totalOrderItems },
          },
        } = await getOrderItems({
          variables: {
            input: {
              page: 1,
              statusGroup: OrderStatusGroup.EXCHANGE,
            },
          },
        });

        if (ok) {
          const hasOrderItems = !!totalOrderItems && !!totalOrderItems.length;
          if (!hasOrderItems) {
            showHasAnyProblemModal(<>주문건이 존재하지 않습니다.</>);
            return;
          }

          const nomalizedOrderItem: NormalizedListType =
            constructOrderItem(totalOrderItems);

          const resetOrderItems: Array<ResetOrderItemType> =
            getResetOrderItems(nomalizedOrderItem);

          const ws = xlsx.utils.aoa_to_sheet([tableHead]);
          const wb = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

          resetOrderItems.map(
            ({
              merchantUid,
              merchantItemUid,
              productName,
              userName,
              orderStatus,
              claimStatus,
              paidAt,
              requestAt,
              mainReason,
              detailedReason,
              attachedImages,
              completedAt,
              shipmentCompany,
              shipmentNumber,
              pickupShipmentCompany,
              pickupShipmentNumber,
              pickupAgainShipmentCompany,
              pickupAgainShipmentNumber,
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
              // 재배송지
              // 재배송 우편번호
              refusalAt,
              refusalReason,
              refusalDetailedReason,
            }) => {
              xlsx.utils.sheet_add_aoa(
                ws,
                [
                  [
                    merchantUid,
                    merchantItemUid,
                    productName,
                    userName,
                    orderStatus,
                    claimStatus,
                    paidAt,
                    requestAt,
                    mainReason,
                    detailedReason,
                    attachedImages,
                    completedAt,
                    shipmentCompanyCode[shipmentCompany],
                    shipmentNumber,
                    shipmentCompanyCode[pickupShipmentCompany],
                    pickupShipmentNumber,
                    shipmentCompanyCode[pickupAgainShipmentCompany],
                    pickupAgainShipmentNumber,
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
                    "-", // 재배송지
                    "-", // 재배송 우편번호
                    refusalAt,
                    refusalReason,
                    refusalDetailedReason,
                  ],
                ],
                { origin: -1 }
              );

              ws["!cols"] = tableWidth;
            }
          );

          xlsx.writeFile(wb, "전체 주문 리스트.xlsx");
        }
        if (error) {
          showHasServerErrorModal(error, "전체 내보내기");
        }
      } catch (error) {
        showHasServerErrorModal(error as string, "전체 내보내기");
      }
    })();
  };

  return (
    <Button
      size="small"
      width="127px"
      onClick={handleCreateXlsxHandler}
      backgroundColor={"#fff"}
    >
      {children}
    </Button>
  );
};

export default ExportAllExcelButton;
