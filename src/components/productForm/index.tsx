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
import DescriptionImageSection from "@components/productForm/descriptionImageSection/index";
import DescriptionGuide from "@components/productForm/DescriptionGuide";

import exclamationMarkSrc from "@icons/exclamationmark.svg";

import SearchTagSection from "@components/productForm/searchTagSection";
import { HeaderNames, PRODUCT_REGISTRATION_SECTIONS } from "@constants/index";
import { useEffect } from "react";
import { unfulfilledInputListVar } from "@cache/shopSettings";
import {
  sectionFulfillmentVar,
  sectionFulfillmentInitialValue,
} from "@cache/index";

const ProductForm = () => {
  useEffect(() => {
    initializeFormStatus();
  }, []);

  const initializeFormStatus = () => {
    unfulfilledInputListVar([]);
    sectionFulfillmentVar(sectionFulfillmentInitialValue);
  };

  return (
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
              referenceKey={PRODUCT_REGISTRATION_SECTIONS.DESCRIPTION_IMAGE}
              label={"상품 상세이미지"}
              isRequired={true}
            >
              <DescriptionImageSection />
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
              label={"상품정보제공고시"}
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
  );
};

export default ProductForm;
