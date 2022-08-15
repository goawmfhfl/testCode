import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import TextInput from "@components/common/input/TextInput";

const ProductSpecification = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <InputContainer>
        <Label>작품명</Label>
        <TextInput register={register("productName")} width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>소재</Label>
        <TextInput register={register("material")} width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>크기</Label>
        <TextInput register={register("size")} width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>제조자/제조국</Label>
        <TextInput register={register("manufacturer")} width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>취급시 주의사항</Label>
        <TextInput register={register("precaution")} width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>인증/허가 사항</Label>
        <TextInput register={register("authorization")} width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>AS책임자와 전화번호</Label>
        <TextInput register={register("personInCharge")} width="100%" />
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
  font-family: "Spoqa Han Sans Neo";
  font-weight: 400;
  font-size: 13px;

  display: flex;
  align-items: center;
`;

export default ProductSpecification;
