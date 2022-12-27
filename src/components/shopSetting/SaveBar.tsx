import React, { useEffect } from "react";
import { useTheme } from "styled-components/macro";
import { useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@components/common/Button";

import {
  systemModalVar,
  contentsContainerReferenceVar,
  GNBReferenceVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
  loadingSpinnerVisibilityVar,
  showHasAnyProblemModal,
} from "@cache/index";
import {
  HAS_SET_CONDITIONAL_FREE_SHIPMENT,
  SHIPMENT_PRICE_TYPE,
  unfulfilledInputListVar,
} from "@cache/shopSettings";
import { Pathnames, shopSettingsSectionMapper } from "@constants/index";
import { ConditionalFreeShipmentPolicy } from "@constants/shop";
import {
  TemporarySaveShopSettingsInputType,
  SaveShopSettingsInputType,
} from "@models/shopSettings";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import { hasEveryInputFulfilled } from "@utils/index";
import restructureShopSettingStates from "@utils/shopSettings/restructureShopSettingStates";
import useShopInfo from "@hooks/useShopInfo";
import { GET_SHOP_INFO, ShopInfo } from "@graphql/queries/getShopInfo";
import {
  TEMPORARY_SAVE_SHOP_SETTINGS,
  SAVE_SHOP_SETTINGS,
} from "@graphql/mutations/shop";

import Container from "@components/common/saveBar/Container";
import ButtonContainer from "@components/common/saveBar/ButtonContainer";
import TemporarySaveButton from "@components/common/saveBar/TemporarySaveButton";
import SubmitButton from "@components/common/saveBar/SubmitButton";
import { showHasServerErrorModal } from "@cache/productManagement";
import { SubmissionType } from "@constants/index";
import { EDIT_SHOP } from "@graphql/mutations/editShop";

const SaveBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const formContext = useFormContext();
  const { watch } = formContext;

  const [
    temporarySaveShopSettings,
    { loading: isTemporarySaveShopLoading, error: isTemporarySaveShopError },
  ] = useMutation<
    {
      temporarySaveShop: {
        ok: boolean;
        error: string;
        __typename;
      };
    },
    {
      input: TemporarySaveShopSettingsInputType;
    }
  >(TEMPORARY_SAVE_SHOP_SETTINGS, {
    update(cache) {
      const shopInfo = cache.readQuery<{ getShopInfo: ShopInfo }>({
        query: GET_SHOP_INFO,
      });

      if (!shopInfo) return;

      const update = {
        ...shopInfo.getShopInfo,
        ...restructureShopSettingStates(watch),
      };

      cache.writeQuery({
        query: GET_SHOP_INFO,
        data: {
          getShopInfo: update,
        },
      });
    },
  });

  const [
    submitShopSettings,
    { loading: isLoadingSubmission, error: isSubmissionError },
  ] = useMutation<
    {
      registerShop: {
        ok: boolean;
        error: string;
      };
    },
    {
      input: SaveShopSettingsInputType;
    }
  >(SAVE_SHOP_SETTINGS, {
    refetchQueries: [
      {
        query: GET_SHOP_INFO,
      },
      "GetShopInfo",
    ],
  });

  const [editShopSettings, { loading: isShopEditing, error: isEditingError }] =
    useMutation<{
      editShop: {
        ok: boolean;
        error: string | null;
      };
    }>(EDIT_SHOP, {
      refetchQueries: [
        {
          query: GET_SHOP_INFO,
        },
        "GetShopInfo",
      ],
    });

  const {
    data: shopData,
    loading: isShopLoading,
    error: isShopError,
  } = useShopInfo();

  useEffect(() => {
    const isLoading =
      isShopLoading ||
      isTemporarySaveShopLoading ||
      isShopEditing ||
      isLoadingSubmission;

    loadingSpinnerVisibilityVar(isLoading);
  }, [
    isShopLoading,
    isTemporarySaveShopLoading,
    isShopEditing,
    isLoadingSubmission,
  ]);

  useEffect(() => {
    if (isShopError) {
      showHasServerErrorModal("", "샵 정보 가져오기");
    }

    if (isTemporarySaveShopError) {
      showHasServerErrorModal("", "샵 정보 임시저장");
    }

    if (isSubmissionError) {
      showHasServerErrorModal("", "샵 정보 설정");
    }

    if (isEditingError) {
      showHasServerErrorModal("", "샵 정보 설정");
    }
  }, [
    isShopError,
    isTemporarySaveShopError,
    isSubmissionError,
    isEditingError,
  ]);

  const handleTemporarySaveButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const temporarySaveShopInput = restructureShopSettingStates(watch);

    const result = await temporarySaveShopSettings({
      variables: {
        input: temporarySaveShopInput,
      },
    });

    const {
      data: {
        temporarySaveShop: { ok, error },
      },
    } = result;

    if (!ok) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>임시 저장 중 통신 에러</>,
        cancelButtonVisibility: false,
      });

      console.log(error);

      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>임시저장 되었습니다.</>,
      cancelButtonVisibility: false,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
    });
  };

  const handleSubmitButtonClick =
    (type: SubmissionType) =>
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        e.preventDefault();
        loadingSpinnerVisibilityVar(true);

        const input = restructureShopSettingStates(watch);

        const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
        const isShipmentPriceFree = shipmentType === ShipmentChargeType.Free;
        const hasIdentificationCardAuthenticated =
          Boolean(
            input.identificationCardNumber &&
              input.identificationCardNumber.length > 10
          ) && Boolean(input.identificationCardCopyPhoto);
        const isConditionalFreeShipmentUnset =
          watch(HAS_SET_CONDITIONAL_FREE_SHIPMENT) ===
          ConditionalFreeShipmentPolicy.Unset;

        const { isFulfilled, unfulfilledInputList } = hasEveryInputFulfilled(
          input,
          [
            "safetyAuthentication",
            "safetyAuthenticationExpiredDate",
            "identificationCardNumber",
            "identificationCardCopyPhoto",
            hasIdentificationCardAuthenticated && "representativeName",
            hasIdentificationCardAuthenticated && "businessRegistrationNumber",
            hasIdentificationCardAuthenticated && "corporateRegistrationNumber",
            hasIdentificationCardAuthenticated && "isSimpleTaxpayers",
            hasIdentificationCardAuthenticated && "companyLocation",
            hasIdentificationCardAuthenticated && "onlineSalesLicense",
            isConditionalFreeShipmentUnset && "shipmentConditionalPrice",
          ],
          [isShipmentPriceFree && "shipmentPrice"].filter(Boolean),
          Pathnames.Shop
        );

        if (!isFulfilled) {
          unfulfilledInputListVar(unfulfilledInputList);

          const unfulfilledSectionNames = unfulfilledInputList.map(
            ({ name, status }) => ({
              name: shopSettingsSectionMapper[name],
              status,
            })
          );

          // const targetSection =
          //   shopSettingsSectionMapper[unfulfilledInputList[0]];
          // const sectionReferenceList = sectionReferenceVar();
          // const targetSectionReference = sectionReferenceList[targetSection];

          unfulfilledSectionNames.forEach(({ name, status }) => {
            sectionFulfillmentVar({
              ...sectionFulfillmentVar(),
              [name]: status,
            });
          });

          // const GNBReference: HTMLElement = GNBReferenceVar();
          // const SECTION_TOP_MARGIN = 88;

          // const scrollTo =
          //   targetSectionReference.offsetTop -
          //   GNBReference.offsetHeight -
          //   SECTION_TOP_MARGIN;

          // contentsContainerReferenceVar().scrollTo(0, scrollTo);

          loadingSpinnerVisibilityVar(false);

          return;
        }

        if (type === SubmissionType.Update) {
          const {
            data: {
              editShop: { ok, error },
            },
          } = await editShopSettings({
            variables: {
              input,
            },
          });

          if (!ok && error) {
            systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: <>샵 정보 저장에 실패하였습니다.</>,
              confirmButtonVisibility: true,
              cancelButtonVisibility: false,
              confirmButtonClickHandler: () => {
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: false,
                });
              },
            });

            console.log(error);

            return;
          }

          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>저장되었습니다.</>,
            confirmButtonVisibility: true,
            cancelButtonVisibility: false,
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });
            },
          });

          return;
        }

        const result = await submitShopSettings({
          variables: {
            input,
          },
        });

        const {
          data: {
            registerShop: { ok, error },
          },
        } = result;

        if (!ok) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>샵 설정 등록 중 통신 에러</>,
            cancelButtonVisibility: false,
          });

          console.log(error);

          loadingSpinnerVisibilityVar(false);

          return;
        }

        if (!shopData.getShopInfo.shop.registered) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: (
              <>
                샵 설정 등록이 완료되었습니다. <br />
                지금부터 상품 등록 및 판매가 가능합니다.
              </>
            ),
            cancelButtonVisibility: false,
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });
            },
          });

          navigate("/product");
        } else {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>저장 되었습니다.</>,
            cancelButtonVisibility: false,
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });
            },
          });
        }

        loadingSpinnerVisibilityVar(false);
      } catch (error) {
        loadingSpinnerVisibilityVar(false);
      }
    };

  const hasShopRegistered = shopData?.getShopInfo.shop.registered;
  const submissionType = hasShopRegistered
    ? SubmissionType.Update
    : SubmissionType.Create;

  return (
    <Container>
      <ButtonContainer>
        {!hasShopRegistered && (
          <TemporarySaveButton
            size="big"
            width="126px"
            color={theme.palette.white}
            backgroundColor={theme.palette.grey700}
            // eslint-disable-next-line
            onClick={handleTemporarySaveButtonClick}
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
          disabled={isLoadingSubmission}
        >
          {hasShopRegistered ? "저장" : "등록"}
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};

export default SaveBar;
