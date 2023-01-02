import React from "react";
import * as xlsx from "xlsx";

import { CaculatedProductsType } from "@models/product/management";
import Button from "@components/common/Button";
import { productType } from "@constants/product";

interface ExportToExcelButtonType {
  children: React.ReactNode;
  tableData: Array<{
    id: number;
    label: string;
    width: number;
    value: string;
  }>;
  exportData: Array<CaculatedProductsType>;
}

const ExportToExcelButton = ({
  children,
  tableData,
  exportData,
}: ExportToExcelButtonType) => {
  const tableHeadInitialValue: Array<string> = [];
  const tableWidthInitialValue: Array<{ wpx: number }> = [];

  const tableHead = tableData.reduce((result, { label }) => {
    if (label !== "checkBox") result.push(label);
    return result;
  }, tableHeadInitialValue);

  const tableWidth = tableData.reduce((result, { label, width }) => {
    if (label !== "checkBox") result.push({ wpx: width * 10 });
    return result;
  }, tableWidthInitialValue);

  const ws = xlsx.utils.aoa_to_sheet([tableHead]);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

  exportData.map(
    ({
      productId,
      productName,
      firstCategory,
      secondCategory,
      thirdCategory,
      originalPriceToWonSign,
      discountedRate,
      finalSellngPrice,
      quantity,
      status,
    }) => {
      xlsx.utils.sheet_add_aoa(
        ws,
        [
          [
            productId,
            productName,
            firstCategory,
            secondCategory,
            thirdCategory,
            originalPriceToWonSign,
            discountedRate,
            finalSellngPrice,
            quantity,
            productType[status],
          ],
        ],
        { origin: -1 }
      );

      ws["!cols"] = tableWidth;
    }
  );

  const handleCreateXlsxHandler = () => {
    xlsx.writeFile(wb, "상품리스트.xlsx");
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
