import React from "react";

import { ORDER_MANAGEMENT } from "@constants/order/orderManagement";

import ContentsHeader from "@components/common/ContentsHeader";
import ContentsContainer from "@components/common/ContentsContainer";
import FilterBar from "@components/order/OrderManagement/FilterBar";
import Controller from "@components/order/OrderManagement/Controller";

const OrderManagement = () => {
  return (
    <ContentsContainer>
      <ContentsHeader headerName={ORDER_MANAGEMENT} />
      <FilterBar />
      <Controller />
    </ContentsContainer>
  );
};

export default OrderManagement;
