import styled from "styled-components";
import TextInput from "@components/common/input/TextInput";

const ProductPrice = () => {
  return (
    <Container>
      <TextInput width={"112px"} /> 원
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export default ProductPrice;
