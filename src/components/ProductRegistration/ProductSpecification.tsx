import styled from "styled-components";

import TextInput from "@components/common/input/TextInput";

const ProductSpecification = () => {
  return (
    <Container>
      <InputContainer>
        <Label>작품명</Label>
        <TextInput width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>소재</Label>
        <TextInput width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>크기</Label>
        <TextInput width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>제조자/제조국</Label>
        <TextInput width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>취급시 주의사항</Label>
        <TextInput width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>인증/허가 사항</Label>
        <TextInput width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>AS책임자와 전화번호</Label>
        <TextInput width="100%" />
      </InputContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 572px;
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Label = styled.label`
  min-width: 136px;
  font-family: "SpoqaHanSansNeo";
  font-weight: 400;
  font-size: 13px;

  display: flex;
  align-items: center;
`;

export default ProductSpecification;
