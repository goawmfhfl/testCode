import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components/macro";
import { useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  contentsContainerReferenceVar,
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
  serversideProductVar,
} from "@cache/productForm";
import { shipmentTemplatesVar } from "@cache/productForm/shipmentTemplate";
import { Pathnames, productRegistrationSectionMapper } from "@constants/index";

import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import { ProductInput, TemporarySaveProductInput } from "@models/product/index";

import compareProduct from "@utils/product/form/compareProduct";
import validateInputFulfillment from "@utils/product/form/validateInputFulfillment";
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
        input: TemporarySaveProductInput & {
          productId: number;
        };
      }
    >(TEMPORARY_SAVE_PRODUCT, {
      onCompleted() {
        loadingSpinnerVisibilityVar(false);
      },
    });

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
        input: ProductInput & {
          productId: number;
        };
      }
    >(CREATE_PRODUCT);

  const handleTemporarySaveButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    loadingSpinnerVisibilityVar(true);

    try {
      const input: ProductInput = await constructProductInput(formContext);

      const result = await temporarySaveProduct({
        variables: {
          input: {
            ...input,
            productId: Number(productId),
          },
        },
      });

      if (result.data.temporarySaveProduct.error) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              ??????????????? ?????????????????????. <br /> ?????? ??????????????????. <br />
              ???????????????: {result.data.temporarySaveProduct.error}
            </>
          ),
          confirmButtonText: "??????",
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
              ????????? {input.name}??? <br />
              ?????? ???????????? ???????????????.
            </>
          ),
          confirmButtonText: "??????",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });

            navigate(`/product/${result.data.temporarySaveProduct.productId}`);
          },
          cancelButtonVisibility: false,
        });

        return;
      }

      if (result.data.temporarySaveProduct.ok) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: <>???????????? ???????????????.</>,
          confirmButtonText: "??????",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });

            location.reload();
          },
          cancelButtonVisibility: false,
        });
      }
    } catch (error) {
      console.log("???????????? ??? ????????????", error);

      loadingSpinnerVisibilityVar(false);

      showHasServerErrorModal("?????? ??????", "????????????");
    }
  };

  const handleSubmitButtonClick =
    (type: SubmissionType) =>
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        e.preventDefault();

        const input = await constructProductInput(formContext);

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

        const nullableFields = [
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
        ];

        const { isFulfilled, unfulfilledInputList } = validateInputFulfillment(
          input,
          nullableFields,
          [
            !isDiscounted && "discountAmount",
            "quantity",
            isShipmentPriceFree && "shipmentPrice",
          ]
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

          const targetSection = unfulfilledSectionList[0];
          const sectionReferenceList = sectionReferenceVar();

          const targetSectionReference =
            sectionReferenceList[targetSection.name];

          const SECTION_TOP_MARGIN = 44;

          const scrollTo =
            targetSectionReference.offsetTop - SECTION_TOP_MARGIN;

          contentsContainerReferenceVar().scrollTo(0, scrollTo);

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
                  ????????? ???????????? ??? <br />
                  ????????? ?????????????????????.
                </>
              ),
              confirmButtonVisibility: true,
              confirmButtonText: "??????",
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
            description: <>?????????????????????.</>,
            confirmButtonVisibility: true,
            confirmButtonText: "??????",
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
            description: <>?????? ????????? ?????????????????????.</>,
          });

          console.log(error);

          return;
        }

        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              ????????? ?????????????????????. <br />
              ?????????????????? ????????? ????????? <br />
              ??????????????????.
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
          confirmButtonText: "??????",
          cancelButtonVisibility: false,
        });
      } catch (error) {
        console.log(error);

        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              ???????????? ????????? <br />
              ?????? ????????? ?????????????????????. <br />
              ?????? ?????????????????? <br />
              ??????????????? ??????????????????!
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
            ?????? ??????
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
          {hasProductRegistered ? "??????" : "??????"}
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};

export default SaveBar;
