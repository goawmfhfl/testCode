import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import TextInput from "@components/common/input/TextInput";

const ProductPrice = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <TextInput width={"112px"} register={register("productPrice")} /> 원
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export default ProductPrice;
