import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import InputWrapper from "@components/common/InputWrapper";
import NoticeContainer from "@components/common/NoticeContainer";
import TextInput from "@components/common/input/TextInput";

import ProductCategory from "@components/ProductRegistration/ProductCategory";
import ProductImage from "@components/ProductRegistration/ProductImage";

import exclamationMarkSrc from "@icons/exclamationmark.svg";

const ProductRegistration = () => {
  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName={"상품 등록"}>
          <NoticeContainer icon={exclamationMarkSrc}>
            '●'는 필수 항목입니다.
          </NoticeContainer>
        </ContentsHeader>
        <ContentsMain>
          <ContentsSection>
            <InputWrapper label={"상품명"} isRequired={true}>
              <TextInput width={"540px"} />
            </InputWrapper>
            <InputWrapper label={"카테고리"} isRequired={true}>
              <ProductCategory />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"대표사진"} isRequired={true}>
              <ProductImage />
            </InputWrapper>
            <InputWrapper label={"상품설명"} isRequired={true}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"상품 상세페이지"} isRequired={true}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"상품 스토리"} isRequired={true}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"상품 컬러"} isRequired={true}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"판매가"} isRequired={true}>
              <input type="text" name="" id="" />
            </InputWrapper>
            <InputWrapper label={"할인"}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>

          <ContentsSection>
            <InputWrapper label={"재고"} isRequired={true}>
              <TextInput /> 개
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
            <InputWrapper label={"작품정보제공고시"} isRequired={true}>
              <input type="text" name="" id="" />
            </InputWrapper>
          </ContentsSection>
        </ContentsMain>
      </ContentsContainer>
    </Layout>
  );
};

export default ProductRegistration;
