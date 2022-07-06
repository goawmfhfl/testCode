import { useForm, FormProvider } from "react-hook-form";
import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import InputWrapper from "@components/common/InputWrapper";
import NoticeContainer from "@components/common/NoticeContainer";
import TextInput from "@components/common/input/TextInput";
import Textarea from "@components/common/input/Textarea";

import ProductCategory from "@components/ProductRegistration/ProductCategory";
import ProductImage from "@components/ProductRegistration/ProductImage";
import ProductColor from "@components/ProductRegistration/ProductColor";
import ProductPrice from "@components/ProductRegistration/ProductPrice";
import ProductDiscount from "@components/ProductRegistration/ProductDiscount";
import ProductStock from "@components/ProductRegistration/ProductStock";
import PurchaseOption from "@components/ProductRegistration/PurchaseOption";
import OrderProduction from "@components/ProductRegistration/OrderProduction";
import ProductDeliveryFee from "@components/ProductRegistration/ProductDeliveryFee";
import ProductSpecification from "@components/ProductRegistration/ProductSpecification";

import exclamationMarkSrc from "@icons/exclamationmark.svg";

const ProductRegistration = () => {
  const methods = useForm();

  const onSubmit = () => {
    console.log("form is submitted!");
  };

  return (
    <FormProvider {...methods}>
      <Layout hasSaveBar={true}>
        <ContentsContainer
          isForm={true}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
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
                <Textarea width={"716px"} height={"126px"} />
              </InputWrapper>
              <InputWrapper label={"상품 상세페이지"} isRequired={true}>
                <input type="text" name="" id="" />
              </InputWrapper>
              <InputWrapper label={"상품 스토리"} isRequired={true}>
                <input type="text" name="" id="" />
              </InputWrapper>
              <InputWrapper
                label={"상품 컬러"}
                isRequired={true}
                labelMarginTop={false}
              >
                <ProductColor />
              </InputWrapper>
            </ContentsSection>

            <ContentsSection>
              <InputWrapper label={"판매가"} isRequired={true}>
                <ProductPrice />
              </InputWrapper>
              <InputWrapper label={"할인"}>
                <ProductDiscount />
              </InputWrapper>
            </ContentsSection>

            <ContentsSection>
              <InputWrapper label={"재고"} isRequired={true}>
                <ProductStock />
              </InputWrapper>
              <InputWrapper label={"옵션 설정"}>
                <PurchaseOption />
              </InputWrapper>
            </ContentsSection>

            <ContentsSection>
              <InputWrapper label={"주문 후 제작 여부"}>
                <OrderProduction />
              </InputWrapper>
              <InputWrapper label={"배송 설정"}>
                <ProductDeliveryFee />
              </InputWrapper>
            </ContentsSection>

            <ContentsSection>
              <InputWrapper label={"작품정보제공고시"} isRequired={true}>
                <ProductSpecification />
              </InputWrapper>
            </ContentsSection>
          </ContentsMain>
        </ContentsContainer>
      </Layout>
    </FormProvider>
  );
};

export default ProductRegistration;
