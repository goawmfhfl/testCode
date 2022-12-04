import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import TextInput from "@components/common/input/TextInput";
import { PRODUCT_PRICE } from "@cache/productForm/index";

const ProductPrice = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <TextInput
        width={"112px"}
        register={register(PRODUCT_PRICE)}
        numbersOnly={true}
        placeholder={"숫자만 입력"}
      />{" "}
      원
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export default ProductPrice;
