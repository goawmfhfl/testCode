import React from "react";
import * as xlsx from "xlsx";

import { ResetOrderItemType } from "@models/sale";

import Button from "@components/common/Button";
import { OrderStatusGroup, shipmentCompanyCode } from "@constants/sale";

interface ExportToExcelButtonType {
  children: React.ReactNode;
  tableData: Array<{
    id: number;
    label: string;
    width: number;
    value: string;
  }>;
  exportData: Array<ResetOrderItemType>;
  status: OrderStatusGroup;
}

const ExportToExcelButton = ({
  children,
  tableData,
  exportData,
  status,
}: ExportToExcelButtonType) => {
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

  const ws = xlsx.utils.aoa_to_sheet([tableHead]);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

  if (status === OrderStatusGroup.ORDER) {
    exportData.map(
      ({
        merchantUid,
        merchantItemUid,
        productName,
        userName,
        orderStatus,
        claimStatus,
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
              shipmentCompanyCode[shipmentCompany],
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
            ],
          ],
          { origin: -1 }
        );

        ws["!cols"] = tableWidth;
      }
    );
  }

  if (status === OrderStatusGroup.CANCEL) {
    exportData.map(
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
        completedAt,
        option,
        quantity,
        price,
        optionPrice,
        discountPrice,
        totalPrice,
        shipmentPrice,
        shipmentDistantPrice,
        totalPaymentAmount,
        totalRefundAmout,
        userEmail,
        userPhoneNumber,
        recipientName,
        recipientPhoneNumber,
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
              completedAt,
              option,
              quantity,
              price,
              optionPrice,
              discountPrice,
              totalPrice,
              shipmentPrice,
              shipmentDistantPrice,
              totalPaymentAmount,
              totalRefundAmout,
              userEmail,
              userPhoneNumber,
              recipientName,
              recipientPhoneNumber,
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
  }

  if (status === OrderStatusGroup.REFUND) {
    exportData.map(
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
        price,
        optionPrice,
        discountPrice,
        totalPrice,
        shipmentPrice,
        shipmentDistantPrice,
        totalPaymentAmount,
        totalRefundAmout,
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
              price,
              optionPrice,
              discountPrice,
              totalPrice,
              shipmentPrice,
              shipmentDistantPrice,
              totalPaymentAmount,
              totalRefundAmout,
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
  }

  if (status === OrderStatusGroup.EXCHANGE) {
    exportData.map(
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
        price,
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
              price,
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
  }

  const handleCreateXlsxHandler = () => {
    xlsx.writeFile(wb, "주문리스트.xlsx");
  };

  const hasUser = !!exportData && !!exportData.length;

  return (
    <Button
      size="small"
      width="77px"
      onClick={handleCreateXlsxHandler}
      disabled={!hasUser}
    >
      {children}
    </Button>
  );
};

export default ExportToExcelButton;
