import styled from "styled-components";

import Layout from "@components/common/Layout";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import InputWrapper from "@components/common/InputWrapper";

const ProductRegistration = () => {
  return (
    <Layout>
      <Container>
        <ContentsHeader headerName={"상품 등록"} />
        <ContentsMain>
          <ContentsSection>
            <InputWrapper label={"상품명"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"카테고리"}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"대표사진"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"상품설명"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"상품 상세페이지"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"상품 스토리"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"상품 컬러"}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"판매가"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"할인"}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"재고"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"옵션 설정"}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"주문 후 제작 여부"}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"배송 설정"}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"작품정보제공고시"}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>
        </ContentsMain>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  background-color: orange;
`;

export default ProductRegistration;
