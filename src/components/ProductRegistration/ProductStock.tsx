import styled from "styled-components";
import TextInput from "@components/common/input/TextInput";

const ProductStock = () => {
  return (
    <Container>
      <TextInput /> 개
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export default ProductStock;
