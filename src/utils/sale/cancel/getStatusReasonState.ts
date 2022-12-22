import { OrderStatusName, MainReason } from "@constants/sale";
import { getHHMMSSdateFormat, getYYMMDDdateFormat } from "@utils/date";

const getStatusReasonState = (
  statusReasons: Array<{
    id: number;
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    status: OrderStatusName;
  }>
) => {
  if (!statusReasons || statusReasons.length === 0)
    return {
      mainReason: MainReason.DEFAULT,
      detaildReason: "-",
      refusalMainReason: MainReason.DEFAULT,
      refusalDetaildReason: "-",
      cancelRequestDay: "-",
      cancelRefusalDay: "-",
      cancelCompletedDay: "-",
      totalRefundPrice: 0,
    };

  return statusReasons.reduce(
    (result, { mainReason, detailedReason, status, createdAt, amount }) => {
      if (status === OrderStatusName.CANCEL_REQUEST) {
        result.mainReason = mainReason;
        result.detaildReason = detailedReason;
        result.cancelRequestDay = `${getYYMMDDdateFormat(
          createdAt
        )} / ${getHHMMSSdateFormat(createdAt)}`;
        result.totalRefundPrice = amount;
      }
      if (status === OrderStatusName.CANCEL_REFUSAL) {
        result.refusalMainReason = mainReason;
        result.refusalDetaildReason = detailedReason;
        result.cancelRefusalDay = `${getYYMMDDdateFormat(
          createdAt
        )} / ${getHHMMSSdateFormat(createdAt)}`;
      }
      if (status === OrderStatusName.CANCEL_COMPLETED) {
        result.cancelCompletedDay = `${getYYMMDDdateFormat(
          createdAt
        )} / ${getHHMMSSdateFormat(createdAt)}`;
      }

      return result;
    },
    {
      mainReason: MainReason.DEFAULT,
      detaildReason: "-",
      refusalMainReason: MainReason.DEFAULT,
      refusalDetaildReason: "-",
      cancelRequestDay: "-",
      cancelRefusalDay: "-",
      cancelCompletedDay: "-",
      totalRefundPrice: 0,
    }
  );
};

export default getStatusReasonState;
