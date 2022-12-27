import { compareAsc } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components/macro";
import { useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@components/common/Button";

import {
  contentsContainerReferenceVar,
  GNBReferenceVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
  loadingSpinnerVisibilityVar,
  systemModalVar,
} from "@cache/index";
import { SHIPMENT_PRICE_TYPE } from "@cache/shopSettings";
import {
  HAS_REQUIRED_OPTION,
  HAS_MANUFACTURING_LEAD_TIME,
  SHIPMENT_TEMPLATE_NAME,
  IS_DISCOUNTED,
  HAS_SELECTIVE_OPTION,
  HAS_TAG_INFOS,
  TITLE,
} from "@cache/productForm";
import { shipmentTemplatesVar } from "@cache/productForm/shipmentTemplate";
import { Pathnames, productRegistrationSectionMapper } from "@constants/index";

import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import {
  CreateProductInputType,
  TemporarySaveProductInputType,
} from "@models/product/index";

import { hasEveryInputFulfilled } from "@utils/index";
import constructProductInput from "@utils/product/form/constructProductInput";
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
import { QueryResponse } from "@models/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import { SubmissionType } from "@constants/index";
import { EDIT_PRODUCT } from "@graphql/mutations/editProduct";

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

  const [
    editProduct,
    { loading: isEditingProduct, error: isEditingProductError },
  ] =
    useMutation<{
      editProduct: QueryResponse<Record<string, unknown>>;
    }>(EDIT_PRODUCT);

  const [createProduct, { loading: isLoadingCreateProduct }] =
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
      const input = constructProductInput(formContext);

      const result = await temporarySaveProduct({
        variables: {
          input: {
            ...input,
            productId: Number(productId) || null,
          },
        },
      });

      if (result.data.temporarySaveProduct.error) {
        loadingSpinnerVisibilityVar(false);

        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              임시저장에 실패하였습니다. <br /> 다시 시도해주세요. <br />
              에러메시지: {result.data.temporarySaveProduct.error}
            </>
          ),
          confirmButtonText: "확인",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
          cancelButtonVisibility: false,
        });

        return;
      }

      const isRegistration = !productId;

      if (isRegistration) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              상품명 {input.name}이 <br />
              새로 임시저장 되었습니다.
            </>
          ),
          confirmButtonText: "확인",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });

            navigate(`/product/${result.data.temporarySaveProduct.productId}`);
          },
          cancelButtonVisibility: false,
        });

        loadingSpinnerVisibilityVar(false);

        return;
      }

      loadingSpinnerVisibilityVar(false);

      if (result.data.temporarySaveProduct.ok) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: <>임시저장 되었습니다.</>,
          confirmButtonText: "확인",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
          cancelButtonVisibility: false,
        });
      }
    } catch (error) {
      console.log("임시저장 중 에러발생", error);

      loadingSpinnerVisibilityVar(false);

      showHasServerErrorModal("통신 에러", "임시저장");
    }
  };

  const handleSubmitButtonClick =
    (type: SubmissionType) =>
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        e.preventDefault();
        const input = constructProductInput(formContext);

        const isDiscounted = watch(IS_DISCOUNTED) as boolean;
        const hasTemplateSelected = shipmentTemplatesVar().find(
          (template) => template.name === watch(SHIPMENT_TEMPLATE_NAME)
        );
        const hasRequiredOption = watch(HAS_REQUIRED_OPTION) as boolean;
        const hasSelectiveOption = watch(HAS_SELECTIVE_OPTION) as boolean;
        const hasLeadtime = watch(HAS_MANUFACTURING_LEAD_TIME) as boolean;
        const isShipmentPriceFree =
          watch(SHIPMENT_PRICE_TYPE) === ShipmentChargeType.Free;
        const hasTagInfo = watch(HAS_TAG_INFOS) as boolean;

        const { isFulfilled, unfulfilledInputList } = hasEveryInputFulfilled(
          input,
          [
            !isDiscounted && "discountAmount",
            !isDiscounted && "discountMethod",
            "startDiscountDate",
            "endDiscountDate",
            hasRequiredOption && "quantity",
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
          ],
          Pathnames.ProductRegistration
        );

        if (!isFulfilled) {
          const unfulfilledSectionList = unfulfilledInputList.map(
            ({ name, status }) => {
              return {
                name: productRegistrationSectionMapper[name],
                status,
              };
            }
          );

          unfulfilledSectionList.forEach(({ name, status }) => {
            sectionFulfillmentVar({
              ...sectionFulfillmentVar(),
              [name]: status,
            });
          });

          // const targetSection = unfulfilledSectionNames[0];
          // const sectionReferenceList = sectionReferenceVar();
          // const targetSectionReference = sectionReferenceList[targetSection];

          // const GNBReference: HTMLElement = GNBReferenceVar();
          // const SECTION_TOP_MARGIN = 88;

          // const scrollTo =
          //   targetSectionReference.offsetTop -
          //   GNBReference.offsetHeight -
          //   SECTION_TOP_MARGIN;

          // contentsContainerReferenceVar().scrollTo(0, scrollTo);

          return;
        }

        // when is update
        if (type === SubmissionType.Update) {
          const result = await editProduct({
            variables: {
              input: {
                ...input,
                productId: Number(productId),
              },
            },
          });

          if (result.data.editProduct.error) {
            systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: (
                <>
                  상품을 수정하던 중 <br />
                  에러가 발생하였습니다.
                </>
              ),
              confirmButtonVisibility: true,
              confirmButtonText: "확인",
              confirmButtonClickHandler: () => {
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: false,
                });
              },
              cancelButtonVisibility: false,
            });
          }

          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>저장되었습니다.</>,
            confirmButtonVisibility: true,
            confirmButtonText: "확인",
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });

              navigate(Pathnames.Product);
            },
            cancelButtonVisibility: false,
          });

          return;
        }

        const {
          data: {
            createProduct: { ok, error },
          },
        } = await createProduct({
          variables: {
            input: {
              ...input,
              productId: Number(productId) || null,
            },
          },
        });

        if (!ok && error) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>상품 생성에 실패하였습니다.</>,
          });

          console.log(error);

          return;
        }

        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              상품이 등록되었습니다. <br />
              상품관리에서 판매중 처리로 <br />
              변경해주세요.
            </>
          ),
          confirmButtonVisibility: true,
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });

            navigate(Pathnames.Product);
          },
          confirmButtonText: "확인",
          cancelButtonVisibility: false,
        });
      } catch (error) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              네트워크 에러로 <br />
              상품 생성에 실패하였습니다. <br />
              다시 시도해보시고 <br />
              찹스틱스에 문의해주세요!
            </>
          ),
        });

        return;
      }
    };

  useEffect(() => {
    const isLoading =
      isLoadingProduct || isLoadingCreateProduct || isEditingProduct;

    loadingSpinnerVisibilityVar(isLoading);
  }, [isLoadingProduct, isLoadingCreateProduct, isEditingProduct]);

  useEffect(() => {
    if (isEditingProductError) {
      // showHasServerErrorModal
    }
  }, [isEditingProductError]);

  useEffect(() => {
    if (!productData || productData.getProductById.error) return;

    const { status } = productData.getProductById.product;

    const hasTemporarilySaved = status === ProductStatus.TEMPORARY;
    const hasProductRegistered = status !== ProductStatus.TEMPORARY;

    if (hasTemporarilySaved) {
      setRegistrationStatus(RegistrationStatus.TemporarilySaved);
    }

    if (hasProductRegistered) {
      setRegistrationStatus(RegistrationStatus.Registered);
    }
  }, [productData]);

  const hasProductRegistered =
    registrationStatus === RegistrationStatus.Registered;
  const submissionType = hasProductRegistered
    ? SubmissionType.Update
    : SubmissionType.Create;

  return (
    <Container>
      <ButtonContainer>
        {!hasProductRegistered && (
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
          onClick={handleSubmitButtonClick(submissionType)}
          disabled={isLoadingTemporarySave}
        >
          {hasProductRegistered ? "저장" : "등록"}
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};

export default SaveBar;
