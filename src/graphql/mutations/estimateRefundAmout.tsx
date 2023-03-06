import { gql } from "@apollo/client";

export const ESTIMATE_REFUND_AMOUNT = gql`
  mutation EstimateRefundAmount($input: EstimateRefundAmountInput!) {
    estimateRefundAmount(input: $input) {
      ok
      error
      totalProductAmount
      initialShipmentAmount
      initialShipmentDistantAmount
      shipmentRefundAmount
      shipmentRefundDistantAmount
      finalRefundAmount
    }
  }
`;
