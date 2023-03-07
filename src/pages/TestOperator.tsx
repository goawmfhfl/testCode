import React from "react";
import selectBundleOrderItems from "test/orderTable/selectBundleOrderItems";

const TestOperator = () => {
  const result = selectBundleOrderItems();
  console.log(result);

  return <div>TestOperator</div>;
};

export default TestOperator;
