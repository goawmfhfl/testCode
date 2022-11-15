import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import SectionWrapper from "@components/common/SectionWrapper";
import NoticeContainer from "@components/common/NoticeContainer";

import NameSection from "@components/productRegistration/NameSection";
import CategorySection from "@components/productRegistration/CategorySection";
import ImageSection from "@components/productRegistration/imageSection/index";
import ColorSection from "@components/productRegistration/ColorSection";
import PriceSection from "@components/productRegistration/PriceSection";
import DiscountSection from "@components/productRegistration/DiscountSection";
import StockSection from "@components/productRegistration/StockSection";
import RequiredOptionSection from "@components/productRegistration/optionSection/RequiredOption";
import SelectiveOptionSection from "@components/productRegistration/optionSection/SelectiveOption";
import OrderProductionSection from "@components/productRegistration/OrderProductionSection";
import ShipmentChargeSection from "@components/productRegistration/ShipmentChargeSection";
import SpecificationSection from "@components/productRegistration/SpecificationSection";
import DescriptionSection from "@components/productRegistration/DescriptionSection";

import exclamationMarkSrc from "@icons/exclamationmark.svg";
import questionMarkSource from "@icons/questionmark.svg";
import SearchTagSection from "@components/productRegistration/searchTagSection";
import { HeaderNames, PRODUCT_REGISTRATION_SECTIONS } from "@constants/index";

export interface ProductRegistrationFormValues {
  TITLE: string;
  PRODUCT_DESCRIPTION: string;
  PRODUCT_COLOR: Array<string>;
  PRODUCT_PRICE: number;
  IS_DISCOUNTED: boolean;
  DISCOUNT_AMOUNT: number;
  DISCOUNT_OPTION: string;
  DISCOUNT_STARTS_AT: string;
  DISCOUNT_ENDS_AT: string;
  HAS_DISCOUNT_SPAN: boolean;
  PRODUCT_STOCK: number;
  HAS_REQUIRED_OPTION: boolean;
  HAS_MANUFACTURING_LEAD_TIME: boolean;
  LEAD_TIME_MAX: number;
  LEAD_TIME_MIN: number;
  SPEC_NAME: string;
  MATERIAL: string;
  SIZE: string;
  WEIGHT: string;
  MANUFACTURER: string;
  PRECAUTION: string;
  AUTHORIZATION: string;
  PERSON_IN_CHARGE: string;
  HAS_TAG_INFOS: boolean;
  CATEGORY_FIRST: string;
  CATEGORY_SECOND: string;
  CATEGORY_THIRD: string;

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
}

import {
  GET_PRODUCTS_BY_ID,
  GetProductsByIdType,
  GetProductsByIdInputType,
} from "@graphql/queries/getProductsById";

import { updatedProductRegistrationStatesVar } from "@cache/productRegistration";
import { CreateProductInputType } from "@models/productRegistration/index";

interface LocationType {
  state: { productId: number | null };
}

const ProductRegistration = () => {
  const updatedProductRegistrationStates = useReactiveVar(
    updatedProductRegistrationStatesVar
  );

  const { state } = useLocation() as LocationType;

  const productId: number | undefined = state?.productId;

  const methods = useForm<ProductRegistrationFormValues>();

  const watchAllField = methods.watch();

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
          updatedProductRegistrationStatesVar(product);
        }

        if (error) {
          // TODO: 에러 핸들링 로직 추가
          console.log(error);
        }
      })();
  }, [productId]);

  useEffect(() => {
    methods.reset({
      ...watchAllField,

      // 상품명
      TITLE: updatedProductRegistrationStates?.name
        ? updatedProductRegistrationStates?.name
        : "",
      // 카테고리
      CATEGORY_FIRST: updatedProductRegistrationStates?.category?.parent.name
        ? updatedProductRegistrationStates?.category?.parent.name
        : "",

      CATEGORY_SECOND: updatedProductRegistrationStates?.category?.name
        ? updatedProductRegistrationStates?.category?.name
        : "",

      CATEGORY_THIRD: updatedProductRegistrationStates?.category?.children.name
        ? updatedProductRegistrationStates?.category?.children.name
        : "",

      // 상품설명
      PRODUCT_DESCRIPTION: updatedProductRegistrationStates?.description,

      // 상품 컬러
      PRODUCT_COLOR: updatedProductRegistrationStates?.colors?.map(
        (color) => color?.name
      ),

      // 판매가
      PRODUCT_PRICE: updatedProductRegistrationStates?.originalPrice,

      // 할인
      IS_DISCOUNTED: updatedProductRegistrationStates?.discountAmount
        ? true
        : false,

      // 할인 금액
      DISCOUNT_AMOUNT: updatedProductRegistrationStates?.discountAmount,

      // 할인 옵션
      DISCOUNT_OPTION:
        updatedProductRegistrationStates?.discountMethod === "PERCENT"
          ? "PERCENT"
          : "WON",

      //  기간할인 설정
      HAS_DISCOUNT_SPAN:
        updatedProductRegistrationStates?.startDiscountDate &&
        updatedProductRegistrationStates?.endDiscountDate
          ? true
          : false,

      //  재고
      PRODUCT_STOCK: updatedProductRegistrationStates?.quantity
        ? updatedProductRegistrationStates?.quantity
        : 0,

      // 주문 후 제작 여부
      HAS_MANUFACTURING_LEAD_TIME:
        updatedProductRegistrationStates?.manufacturingLeadTime?.max &&
        updatedProductRegistrationStates?.manufacturingLeadTime?.min
          ? true
          : false,
      LEAD_TIME_MAX: updatedProductRegistrationStates?.manufacturingLeadTime
        ?.max
        ? updatedProductRegistrationStates?.manufacturingLeadTime?.max
        : 0,
      LEAD_TIME_MIN: updatedProductRegistrationStates?.manufacturingLeadTime
        ?.min
        ? updatedProductRegistrationStates?.manufacturingLeadTime?.min
        : 0,

      // 작품정보제공고시
      SPEC_NAME: updatedProductRegistrationStates?.specName
        ? updatedProductRegistrationStates?.specName
        : "",
      MATERIAL: updatedProductRegistrationStates?.material
        ? updatedProductRegistrationStates?.material
        : "",
      SIZE: updatedProductRegistrationStates?.size
        ? updatedProductRegistrationStates?.size
        : "",
      WEIGHT: updatedProductRegistrationStates?.weight
        ? updatedProductRegistrationStates?.weight
        : "",
      PRECAUTION: updatedProductRegistrationStates?.precaution
        ? updatedProductRegistrationStates?.precaution
        : "",
      AUTHORIZATION: updatedProductRegistrationStates?.authorization
        ? updatedProductRegistrationStates?.authorization
        : "",
      PERSON_IN_CHARGE: updatedProductRegistrationStates?.personInCharge
        ? updatedProductRegistrationStates?.personInCharge
        : "",
    });
  }, [updatedProductRegistrationStates]);

  return (
    <FormProvider {...methods}>
      <Layout hasSaveBar={true}>
        <ContentsContainer
          isForm={true}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
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
