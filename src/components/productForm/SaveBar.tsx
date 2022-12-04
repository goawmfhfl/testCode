import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components/macro";
import { useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@components/common/Button";

import {
  systemModalVar,
  contentsContainerReferenceVar,
  GNBReferenceVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
  loadingSpinnerVisibilityVar,
} from "@cache/index";
import { SHIPMENT_PRICE_TYPE } from "@cache/shopSettings";
import {
  HAS_REQUIRED_OPTION,
  HAS_MANUFACTURING_LEAD_TIME,
  SHIPMENT_TEMPLATE,
  IS_DISCOUNTED,
  HAS_SELECTIVE_OPTION,
  HAS_TAG_INFOS,
  TITLE,
} from "@cache/productForm";
import { shipmentTemplatesVar } from "@cache/productForm/shipmentTemplate";
import { productRegistrationSectionMapper } from "@constants/index";

import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import {
  CreateProductInputType,
  TemporarySaveProductInputType,
} from "@models/product/index";

import { hasEveryInputFulfilled } from "@utils/index";
import { restructureProductRegistrationStates } from "@utils/product/form/index";
import {
  TEMPORARY_SAVE_PRODUCT,
  CREATE_PRODUCT,
} from "@graphql/mutations/shop";

import Container from "@components/common/saveBar/Container";
import ButtonContainer from "@components/common/saveBar/ButtonContainer";
import TemporarySaveButton from "@components/common/saveBar/TemporarySaveButton";
import SubmitButton from "@components/common/saveBar/SubmitButton";
import useProduct from "@hooks/product/useProduct";
import { ProductStatus, RegistrationStatus } from "@constants/product";
import { compareAsc } from "date-fns";
import { QueryResponse } from "@models/index";
import { showHasServerErrorModal } from "@cache/productManagement";

const SaveBar = () => {
  const navigate = useNavigate();

  const { productId } = useParams();
  const theme = useTheme();

  const formContext = useFormContext();
  const { watch } = formContext;

  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus>(RegistrationStatus.Initial);

  const { data: productData, loading: isLoadingProduct } =
    useProduct(productId);

  const [temporarySaveProduct, { loading: isLoadingTemporarySave }] =
    useMutation<
      {
        temporarySaveProduct: QueryResponse<{
          productId: number;
        }>;
      },
      {
        input: TemporarySaveProductInputType;
      }
    >(TEMPORARY_SAVE_PRODUCT);

  const [createProduct] =
    useMutation<
      {
        createProduct: {
          ok: boolean;
          error: string;
        };
      },
      {
        input: CreateProductInputType;
      }
    >(CREATE_PRODUCT);

  const handleTemporarySaveButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    loadingSpinnerVisibilityVar(true);

    try {
      const input = restructureProductRegistrationStates(formContext);

      console.log("임시저장 인풋", input);

      const result = await temporarySaveProduct({
        variables: {
          input: {
            ...input,
            productId: Number(productId) || null,
          },
        },
      });

      console.log("임시저장 결과", result);
    } catch (error) {
      console.log("임시저장 중 에러발생", error);

      loadingSpinnerVisibilityVar(false);

      showHasServerErrorModal("통신 에러", "임시저장");
    }

    loadingSpinnerVisibilityVar(false);
  };

  const handleSubmitButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    loadingSpinnerVisibilityVar(true);

    const input = restructureProductRegistrationStates(formContext);

    const isDiscounted = watch(IS_DISCOUNTED) as boolean;
    const hasTemplateSelected = shipmentTemplatesVar().find(
      (template) => template.name === watch(SHIPMENT_TEMPLATE)
    );
    const hasRequiredOption = watch(HAS_REQUIRED_OPTION) as boolean;
    const hasSelectiveOption = watch(HAS_SELECTIVE_OPTION) as boolean;
    const hasLeadtime = watch(HAS_MANUFACTURING_LEAD_TIME) as boolean;
    const isShipmentPriceFree =
      watch(SHIPMENT_PRICE_TYPE) === ShipmentChargeType.Free;
    const hasTagInfo = watch(HAS_TAG_INFOS) as boolean;

    const { isFulfilled, unfulfilledInputNames } = hasEveryInputFulfilled(
      input,
      [
        !isDiscounted && "discountAmount",
        !isDiscounted && "discountMethod",
        !isDiscounted && "startDiscountDate",
        !isDiscounted && "endDiscountDate",
        !hasRequiredOption && !hasSelectiveOption && "optionCombinations",
        !hasRequiredOption && "requiredOptions",
        !hasSelectiveOption && "selectiveOptions",
        !hasLeadtime && "manufacturingLeadTime",
        "shipmentId",
        hasTemplateSelected && "isBundleShipment",
        hasTemplateSelected && "shipmentType",
        hasTemplateSelected && "shipmentPrice",
        hasTemplateSelected && "shipmentDistantPrice",
        hasTemplateSelected && "shipmentReturnPrice",
        hasTemplateSelected && "shipmentExchangePrice",
        "authorization",
        !hasTagInfo && "tagInfos",
      ],
      [
        !isDiscounted && "discountAmount",
        hasRequiredOption && "quantity",
        isShipmentPriceFree && "shipmentPrice",
      ]
    );

    if (!isFulfilled) {
      const unfulfilledSectionNames = [
        ...new Set(
          unfulfilledInputNames.map((inputName: string): string => {
            return productRegistrationSectionMapper[inputName];
          })
        ),
      ];

      unfulfilledSectionNames.forEach((sectionName) => {
        sectionFulfillmentVar({
          ...sectionFulfillmentVar(),
          [sectionName]: false,
        });
      });

      const targetSection = unfulfilledSectionNames[0];
      const sectionReferenceList = sectionReferenceVar();
      const targetSectionReference = sectionReferenceList[targetSection];

      const GNBReference: HTMLElement = GNBReferenceVar();
      const SECTION_TOP_MARGIN = 88;

      const scrollTo =
        targetSectionReference.offsetTop -
        GNBReference.offsetHeight -
        SECTION_TOP_MARGIN;

      contentsContainerReferenceVar().scrollTo(0, scrollTo);

      loadingSpinnerVisibilityVar(false);

      return;
    }

    const result = await createProduct({
      variables: {
        input,
      },
    });

    console.log("상품등록 결과", result);

    loadingSpinnerVisibilityVar(false);
  };

  const handleCancelButtonClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (isLoadingProduct) {
      loadingSpinnerVisibilityVar(true);
    } else {
      loadingSpinnerVisibilityVar(false);
    }
  }, [isLoadingProduct]);

  useEffect(() => {
    if (!productData) return;

    const { status, createdAt, updatedAt } = productData.getProductById.product;

    const isCreating =
      compareAsc(new Date(createdAt), new Date(updatedAt)) === 0;
    const hasTemporarilySaved = status === ProductStatus.TEMPORARY;
    const hasProductRegistered = status !== ProductStatus.TEMPORARY;

    if (isCreating) {
      return;
    }

    if (hasTemporarilySaved) {
      setRegistrationStatus(RegistrationStatus.TemporarilySaved);
    }

    if (hasProductRegistered) {
      setRegistrationStatus(RegistrationStatus.Registered);
    }
  }, [productData]);

  const hasRegistered = registrationStatus === RegistrationStatus.Registered;

  return (
    <Container>
      <ButtonContainer>
        {!hasRegistered && (
          <TemporarySaveButton
            size="big"
            width="126px"
            color={theme.palette.white}
            backgroundColor={theme.palette.grey700}
            // eslint-disable-next-line
            onClick={handleTemporarySaveButtonClick}
            disabled={!watch(TITLE) || isLoadingTemporarySave}
          >
            임시 저장
          </TemporarySaveButton>
        )}

        <SubmitButton
          size="big"
          width="126px"
          color={theme.palette.white}
          backgroundColor={theme.palette.red900}
          form="hook-form"
          // eslint-disable-next-line
          onClick={handleSubmitButtonClick}
        >
          {hasRegistered ? "저장" : "등록"}
        </SubmitButton>

        <Button size="big" width="126px" onClick={handleCancelButtonClick}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default SaveBar;
