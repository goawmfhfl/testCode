import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import SectionWrapper from "@components/common/SectionWrapper";
import NoticeContainer from "@components/common/NoticeContainer";

import NameSection from "@components/ProductRegistration/NameSection";
import CategorySection from "@components/ProductRegistration/CategorySection";
import ImageSection from "@components/ProductRegistration/ImageSection/index";
import ColorSection from "@components/ProductRegistration/ColorSection";
import PriceSection from "@components/ProductRegistration/PriceSection";
import DiscountSection from "@components/ProductRegistration/DiscountSection";
import StockSection from "@components/ProductRegistration/StockSection";
import RequiredOptionSection from "@components/ProductRegistration/OptionSection/RequiredOption";
import SelectiveOptionSection from "@components/ProductRegistration/OptionSection/SelectiveOption";
import OrderProductionSection from "@components/ProductRegistration/OrderProductionSection";
import ShipmentChargeSection from "@components/ProductRegistration/ShipmentChargeSection";
import SpecificationSection from "@components/ProductRegistration/SpecificationSection";
import DescriptionSection from "@components/ProductRegistration/DescriptionSection";

import exclamationMarkSrc from "@icons/exclamationmark.svg";
import SearchTagSection from "@components/ProductRegistration/SearchTagSection";

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
  countrysideAdditionalShipmentCharge: string;
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
            <NoticeContainer
              width={"175px"}
              icon={exclamationMarkSrc}
              isOneLiner={true}
            >
              '●'는 필수 항목입니다.
            </NoticeContainer>
          </ContentsHeader>
          <ContentsMain>
            <ContentsSection>
              <SectionWrapper label={"상품명"} isRequired={true}>
                <NameSection />
              </SectionWrapper>
              <SectionWrapper label={"카테고리"} isRequired={true}>
                <CategorySection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"대표사진"} isRequired={true}>
                <ImageSection />
              </SectionWrapper>
              <SectionWrapper label={"상품설명"} isRequired={true}>
                <DescriptionSection />
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
                <ColorSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"판매가"} isRequired={true}>
                <PriceSection />
              </SectionWrapper>
              <SectionWrapper label={"할인"}>
                <DiscountSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"재고"} isRequired={true}>
                <StockSection />
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
                <ShipmentChargeSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"작품정보제공고시"} isRequired={true}>
                <SpecificationSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label={"검색용 태그 설정"}>
                <SearchTagSection />
              </SectionWrapper>
            </ContentsSection>
          </ContentsMain>
        </ContentsContainer>
      </Layout>
    </FormProvider>
  );
};

export default ProductRegistration;
