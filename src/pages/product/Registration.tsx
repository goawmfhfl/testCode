import { useState } from "react";
import styled from "styled-components";
import { useForm, FormProvider } from "react-hook-form";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import SectionWrapper from "@components/common/SectionWrapper";
import NoticeContainer from "@components/common/NoticeContainer";

import NameSection from "@components/productForm/NameSection";
import CategorySection from "@components/productForm/CategorySection";
import ImageSection from "@components/productForm/imageSection/index";
import ColorSection from "@components/productForm/ColorSection";
import PriceSection from "@components/productForm/PriceSection";
import DiscountSection from "@components/productForm/DiscountSection";
import StockSection from "@components/productForm/StockSection";
import RequiredOptionSection from "@components/productForm/optionSection/RequiredOption";
import SelectiveOptionSection from "@components/productForm/optionSection/SelectiveOption";
import OrderProductionSection from "@components/productForm/OrderProductionSection";
import ShipmentChargeSection from "@components/productForm/ShipmentChargeSection";
import SpecificationSection from "@components/productForm/SpecificationSection";
import DescriptionSection from "@components/productForm/DescriptionSection";

import exclamationMarkSrc from "@icons/exclamationmark.svg";
import questionMarkSource from "@icons/questionmark.svg";
import SearchTagSection from "@components/productForm/searchTagSection";
import { HeaderNames, PRODUCT_REGISTRATION_SECTIONS } from "@constants/index";
import { ProductFormValues } from "@models/product";

const ProductRegistration = () => {
  const methods = useForm<ProductFormValues>();

  return (
    <FormProvider {...methods}>
      <Layout hasSaveBar={true}>
        <ContentsContainer isForm={true}>
          <ContentsHeader
            headerName={HeaderNames.ProductRegistration as HeaderNames}
          >
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
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.PRODUCT_NAME}
                label={"상품명"}
                isRequired={true}
              >
                <NameSection />
              </SectionWrapper>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.CATEGORY}
                label={"카테고리"}
                isRequired={true}
              >
                <CategorySection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.PRODUCT_IMAGE}
                label={"대표사진"}
                isRequired={true}
              >
                <ImageSection />
              </SectionWrapper>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.DESCRIPTION}
                label={<DescriptionGuide />}
                isRequired={true}
              >
                <DescriptionSection />
              </SectionWrapper>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.COLOR}
                label={"상품 컬러"}
                isRequired={true}
                labelMarginTop={false}
              >
                <ColorSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.PRICE}
                label={"판매가"}
                isRequired={true}
              >
                <PriceSection />
              </SectionWrapper>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.DISCOUNT}
                label={"할인"}
              >
                <DiscountSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.STOCK}
                label={"재고"}
                isRequired={true}
              >
                <StockSection />
              </SectionWrapper>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.REQUIRED_OPTION}
                label={"필수 옵션 설정"}
              >
                <RequiredOptionSection />
              </SectionWrapper>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.SELECTIVE_OPTION}
                label={"추가 상품 설정"}
              >
                <SelectiveOptionSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.ORDER_PRODUCTION}
                label={"주문 후 제작 여부"}
              >
                <OrderProductionSection />
              </SectionWrapper>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS}
                label={"배송 설정"}
              >
                <ShipmentChargeSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION}
                label={"작품정보제공고시"}
              >
                <SpecificationSection />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                referenceKey={PRODUCT_REGISTRATION_SECTIONS.SEARCH_TAG}
                label={"검색용 태그 설정"}
              >
                <SearchTagSection />
              </SectionWrapper>
            </ContentsSection>
          </ContentsMain>
        </ContentsContainer>
      </Layout>
    </FormProvider>
  );
};

const DescriptionGuide = () => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  return (
    <DescriptionGuideContainer>
      상품설명
      <DescriptionGuideIcon
        src={questionMarkSource}
        onMouseEnter={() => {
          setIsMouseEntered(true);
        }}
        onMouseLeave={() => {
          setIsMouseEntered(false);
        }}
      />
      {isMouseEntered && (
        <DescriptionGuideModal>
          <InnerDescriptionGuideIcon src={questionMarkSource} />
          <InnerDescriptionGuide>
            하단의 내용을 참고하여 상품 설명을 작성해주시면 <br />
            소비자가 상품을 구매를 결정하는 데에 큰 도움이 됩니다. <br />
            <br />
            <DescriptionGuideList>
              <li>
                브랜드가 이 상품에 담고자 했던 스토리나 제작 계기를 간단하게
                작성해 주세요.
              </li>
              <li>
                이 상품은 무엇이며 어떤 강점이 있고 누구에게 왜 필요한지를
                설명해 주세요.
              </li>
              <li>상품의 비주얼과 디테일을 설명해 주세요.</li>
              <li>사용방법 및 주의사항을 알기 쉽게 전달해 주세요.</li>
            </DescriptionGuideList>
          </InnerDescriptionGuide>
        </DescriptionGuideModal>
      )}
    </DescriptionGuideContainer>
  );
};

const DescriptionGuideContainer = styled.div`
  position: relative;
`;

const DescriptionGuideIcon = styled.img`
  position: absolute;
  left: 75px;
  bottom: -2px;
  width: 24px;
  height: 24px;
`;

const InnerDescriptionGuideIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const InnerDescriptionGuide = styled.div`
  margin-top: 4px;
  margin-left: 12px;
`;

const DescriptionGuideModal = styled.div`
  width: 465px;
  height: 200px;
  background-color: ${({ theme: { palette } }) => palette.grey400};

  position: absolute;
  bottom: 30px;
  left: 75px;

  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  padding: 8px;

  display: flex;
`;

const DescriptionGuideList = styled.ul`
  list-style: disc;

  & > li {
    margin-bottom: 17px;
  }
`;

export default ProductRegistration;
