import React from "react";
import { OrderStatusName, orderStatusNameType } from "@constants/sale";

interface GetDescriptionProps {
  isExchangeRequestChecked: boolean;
  exchangeRequestCount: number;
  isPickupInProgressChecked: boolean;
  pickupInProgressCount: number;
  isPickupCompletedChecked: boolean;
  pickupCompletedCount: number;
  isShippingAgainChecked: boolean;
  shippingAgainCount: number;
}

const getDescription = (
  getIsCheckedStatus: GetDescriptionProps,
  status: OrderStatusName
) => {
  const array: Array<string> = [];
  let result: React.ReactNode;

  if (getIsCheckedStatus.isExchangeRequestChecked) {
    array.push(`교환요청 ${getIsCheckedStatus.exchangeRequestCount}건`);
  }

  if (getIsCheckedStatus.isPickupInProgressChecked) {
    array.push(`수거중 ${getIsCheckedStatus.pickupInProgressCount}건`);
  }

  if (getIsCheckedStatus.isPickupCompletedChecked) {
    array.push(`수거완료 ${getIsCheckedStatus.pickupCompletedCount}건`);
  }

  if (getIsCheckedStatus.isShippingAgainChecked) {
    array.push(`재배송 ${getIsCheckedStatus.shippingAgainCount}건`);
  }

  if (array.length === 1) {
    result = `${array[0]}을
        ${orderStatusNameType[status] as string}(으)로 변경 처리하시겠습니까?
      `;
  }
  if (array.length === 2) {
    result = `${array[0]}, ${array[1]}을
        ${orderStatusNameType[status] as string}(으)로 변경 처리하시겠습니까?
      `;
  }
  if (array.length === 3) {
    result = `${array[0]}, ${array[1]}
    ${array[2]}을 ${
      orderStatusNameType[status] as string
    }(으)로 변경 처리하시겠습니까?
    `;
  }
  if (array.length === 4) {
    result = `${array[0]}, ${array[1]}
    ${array[2]}, ${array[3]}을
    ${orderStatusNameType[status] as string}(으)로 변경 처리하시겠습니까?
    `;
  }

  return result;
};
export default getDescription;
