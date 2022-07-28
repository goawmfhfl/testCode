import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import TextInput from "@components/common/input/TextInput";

const ProductStock = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <TextInput register={register("productStock")} /> 개
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export default ProductStock;
