import React from "react";
import * as xlsx from "xlsx";
import {
  fixTableType,
  scrollTableType,
} from "@constants/sale/refundManagement/table";
import Button from "@components/common/Button";
import { showHasAnyProblemModal } from "@cache/index";

import useLazyRefundOrders from "@hooks/order/useLazyRefundOrders";
import { NormalizedListType, ResetOrderItemType } from "@models/sale";

import constructOrderItem from "@utils/sale/constructOrderItem";
import getResetOrderItems from "@utils/sale/refund/getResetOrderItems";
import { OrderStatusGroup, shipmentCompanyCode } from "@constants/sale";
import { showHasServerErrorModal } from "@cache/productManagement";

interface ExportToExcelButtonType {
  children: React.ReactNode;
}
const ExportAllExcelButton = ({ children }: ExportToExcelButtonType) => {
  const { getOrderItem } = useLazyRefundOrders();

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
        } = await getOrderItem({
          variables: {
            input: {
              page: 1,
              statusGroup: OrderStatusGroup.REFUND,
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
              option,
              quantity,
              originalPrice,
              optionPrice,
              discountPrice,
              totalPrice,
              shipmentPrice,
              shipmentDistantPrice,
              totalPaymentAmount,
              amount,
              userEmail,
              userPhoneNumber,
              recipientName,
              recipientPhoneNumber,
              recipientAddress,
              postCode,
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
                    option,
                    quantity,
                    originalPrice,
                    optionPrice,
                    discountPrice,
                    totalPrice,
                    shipmentPrice,
                    shipmentDistantPrice,
                    totalPaymentAmount,
                    amount,
                    userEmail,
                    userPhoneNumber,
                    recipientName,
                    recipientPhoneNumber,
                    recipientAddress,
                    postCode,
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
