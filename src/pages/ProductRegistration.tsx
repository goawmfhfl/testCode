import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import SectionWrapper from "@components/common/SectionWrapper";
import NoticeContainer from "@components/common/NoticeContainer";
import Textarea from "@components/common/input/Textarea";

import ProductNameSection from "@components/ProductRegistration/ProductNameSection";
import ProductCategorySection from "@components/ProductRegistration/ProductCategorySection";
import ProductImageSection from "@components/ProductRegistration/ProductImageSection";
import ProductColorSection from "@components/ProductRegistration/ProductColorSection";
import ProductPriceSection from "@components/ProductRegistration/ProductPriceSection";
import ProductDiscountSection from "@components/ProductRegistration/ProductDiscountSection";
import ProductStockSection from "@components/ProductRegistration/ProductStockSection";
import RequiredOptionSection from "@components/ProductRegistration/OptionSection/RequiredOption";
import SelectiveOptionSection from "@components/ProductRegistration/OptionSection/SelectiveOption";
import OrderProductionSection from "@components/ProductRegistration/OrderProductionSection";
import ShippingChargeSection from "@components/ProductRegistration/ProductShippingChargeSection";
import ProductSpecificationSection from "@components/ProductRegistration/ProductSpecificationSection";

import exclamationMarkSrc from "@icons/exclamationmark.svg";

export interface ProductRegistrationFormValues {
  productName: string;
  productPrice: string;
  productDescription: string;
  productStock: string;
  productNameSpec: string;
  productTextileSpec: string;
  discountValue: string;
  minLeadTime: string;
  maxLeadTime: string;
  optionValues: string;
  cautionsSpec: string;
  certifiedMattersSpec: string;
  countrysideAdditionalShippingCharge: string;
  contactInformationSpec: string;
  deliveryFee: string;
  categoryDepthFirst: string;
  categoryDepthSecond: string;
  categoryDepthThird: string;
}

const ProductRegistration = () => {
  const methods = useForm<ProductRegistrationFormValues>();
  const { register } = methods;

  const onSubmit: SubmitHandler<ProductRegistrationFormValues> = (data) => {
    console.log("form is submitted!");
    console.log(data);
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
              <SectionWrapper label={"상품명"} isRequired={true}>
                <ProductNameSection />
              </SectionWrapper>
              <SectionWrapper label={"카테고리"} isRequired={true}>
                <ProductCategorySection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"대표사진"} isRequired={true}>
                <ProductImageSection />
              </SectionWrapper>
              <SectionWrapper label={"상품설명"} isRequired={true}>
                <Textarea
                  size="small"
                  width={"716px"}
                  height={"126px"}
                  register={register("productDescription")}
                />
              </SectionWrapper>
              <SectionWrapper label={"상품 상세페이지"} isRequired={true}>
                <input type="text" name="" id="" />
              </SectionWrapper>
              <SectionWrapper label={"상품 스토리"} isRequired={true}>
                <input type="text" name="" id="" />
              </SectionWrapper>
              <SectionWrapper
                label={"상품 컬러"}
                isRequired={true}
                labelMarginTop={false}
              >
                <ProductColorSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"판매가"} isRequired={true}>
                <ProductPriceSection />
              </SectionWrapper>
              <SectionWrapper label={"할인"}>
                <ProductDiscountSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"재고"} isRequired={true}>
                <ProductStockSection />
              </SectionWrapper>
              <SectionWrapper label={"필수 옵션 설정"}>
                <RequiredOptionSection />
              </SectionWrapper>
              <SectionWrapper label={"추가 상품 설정"}>
                <SelectiveOptionSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"주문 후 제작 여부"}>
                <OrderProductionSection />
              </SectionWrapper>
              <SectionWrapper label={"배송 설정"}>
                <ShippingChargeSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"작품정보제공고시"} isRequired={true}>
                <ProductSpecificationSection />
              </SectionWrapper>
            </ContentsSection>
          </ContentsMain>
        </ContentsContainer>
      </Layout>
    </FormProvider>
  );
};

export default ProductRegistration;
