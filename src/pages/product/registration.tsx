import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import SectionWrapper from "@components/common/SectionWrapper";
import NoticeContainer from "@components/common/NoticeContainer";

import NameSection from "@components/productRegistration/NameSection";
import CategorySection from "@components/productRegistration/CategorySection";
import ImageSection from "@components/productRegistration/ImageSection/index";
import ColorSection from "@components/productRegistration/ColorSection";
import PriceSection from "@components/productRegistration/PriceSection";
import DiscountSection from "@components/productRegistration/DiscountSection";
import StockSection from "@components/productRegistration/StockSection";
import RequiredOptionSection from "@components/productRegistration/OptionSection/RequiredOption";
import SelectiveOptionSection from "@components/productRegistration/OptionSection/SelectiveOption";
import OrderProductionSection from "@components/productRegistration/OrderProductionSection";
import ShipmentChargeSection from "@components/productRegistration/ShipmentChargeSection";
import SpecificationSection from "@components/productRegistration/SpecificationSection";
import DescriptionSection from "@components/productRegistration/DescriptionSection";

import exclamationMarkSrc from "@icons/exclamationmark.svg";
import questionMarkSource from "@icons/questionmark.svg";
import SearchTagSection from "@components/ProductRegistration/SearchTagSection";
import { PRODUCT_REGISTRATION_SECTIONS } from "@constants/index";

export interface ProductRegistrationFormValues {
  TITLE: string;

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
  CATEGORY_FIRST: string;
  CATEGORY_SECOND: string;
  CATEGORY_THIRD: string;
}

import {
  GET_PRODUCTS_BY_ID,
  GetProductsByIdType,
  GetProductsByIdInputType,
} from "@graphql/queries/getProductsById";

import { CreateProductInputType } from "@models/productRegistration/index";

interface LocationType {
  state: { productId: number | null };
}

const ProductRegistration = () => {
  const [updateData, setUpdateData] = useState<CreateProductInputType>();

  const { state } = useLocation() as LocationType;

  const productId: number | undefined = state?.productId;

  const methods = useForm<ProductRegistrationFormValues>();

  const [getData] = useLazyQuery<GetProductsByIdType, GetProductsByIdInputType>(
    GET_PRODUCTS_BY_ID,
    {
      variables: {
        input: {
          productId: productId,
        },
      },
    }
  );

  const onSubmit: SubmitHandler<ProductRegistrationFormValues> = (data) => {
    console.log("form is submitted!");
    console.log(data);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    productId &&
      (async () => {
        const {
          data: {
            getProductById: { product, ok, error },
          },
          loading,
        } = await getData();

        if (ok) {
          setUpdateData(product);
        }

        if (error) {
          // TODO: 에러 핸들링 로직 추가 예정
          console.log(error);
        }
      })();
  }, [productId]);

  const watchAllField = methods.watch();

  useEffect(() => {
    methods.reset({
      ...watchAllField,
      TITLE: updateData?.name,
    });
  }, [updateData]);

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
