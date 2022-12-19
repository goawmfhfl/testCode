import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import TextInput from "@components/common/input/TextInput";
import {
  SPEC_NAME,
  MATERIAL,
  SIZE,
  WEIGHT,
  MANUFACTURER,
  PRECAUTION,
  AUTHORIZATION,
  PERSON_IN_CHARGE,
} from "@cache/productForm/index";

const ProductSpecification = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <InputContainer>
        <Label>상품명 ●</Label>
        <TextInput register={register(SPEC_NAME)} width="100%" />
      </InputContainer>
      <InputContainer>
        <Label>소재 ●</Label>
        <TextInput
          register={register(MATERIAL)}
          width="100%"
          placeholder="상품의 소재(플라스틱, 세라믹 등)를 기입해주세요."
        />
      </InputContainer>
      <InputContainer>
        <Label>크기 ●</Label>
        <TextInput
          register={register(SIZE)}
          width="100%"
          placeholder="상품의 가로, 세로, 높이를 기입해주세요."
        />
      </InputContainer>
      <InputContainer>
        <Label>무게 ●</Label>
        <TextInput
          register={register(WEIGHT)}
          width="100%"
          placeholder="상품의 무게를 기입해주세요."
        />
      </InputContainer>
      <InputContainer>
        <Label>제조자/제조국 ●</Label>
        <TextInput
          register={register(MANUFACTURER)}
          width="100%"
          placeholder="찹스틱스/대한민국"
        />
      </InputContainer>
      <InputContainer>
        <Label>취급시 주의사항 ●</Label>
        <TextInput
          register={register(PRECAUTION)}
          width="100%"
          placeholder="소비자가 사용 중에 생길 수 있는 주의사항들을 입력해주세요."
        />
      </InputContainer>
      <InputContainer>
        <Label>인증/허가 사항</Label>
        <TextInput
          register={register(AUTHORIZATION)}
          width="100%"
          placeholder="상품 판매에 허가를 받으신 사항이 있으시다면 입력해주세요."
        />
      </InputContainer>
      <InputContainer>
        <Label>AS책임자와 전화번호 ●</Label>
        <TextInput register={register(PERSON_IN_CHARGE)} width="100%" />
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
