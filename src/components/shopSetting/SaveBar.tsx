import React, { useEffect } from "react";
import { useTheme } from "styled-components/macro";
import { useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  systemModalVar,
  contentsContainerReferenceVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
  loadingSpinnerVisibilityVar,
  saveShopButtonRefVar,
} from "@cache/index";
import {
  HAS_SET_CONDITIONAL_FREE_SHIPMENT,
  SHIPMENT_PRICE_TYPE,
  unfulfilledInputListVar,
} from "@cache/shopSettings";
import { shopSettingsSectionMapper } from "@constants/index";
import {
  BusinessInformations,
  ConditionalFreeShipmentPolicy,
} from "@constants/shop";
import {
  TemporarySaveShopSettingsInputType,
  SaveShopSettingsInputType,
} from "@models/shopSettings";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import restructureShopSettingStates from "@utils/shopSettings/restructureShopSettingStates";
import useShopInfo from "@hooks/useShopInfo";
import { GET_SHOP_INFO, ShopInfo } from "@graphql/queries/getShopInfo";
import {
  TEMPORARY_SAVE_SHOP_SETTINGS,
  SAVE_SHOP_SETTINGS,
} from "@graphql/mutations/shop";
import { EDIT_SHOP } from "@graphql/mutations/editShop";
import validateInputFulfillment from "@utils/shopSettings/validateInputFulfillment";

import Container from "@components/common/saveBar/Container";
import ButtonContainer from "@components/common/saveBar/ButtonContainer";
import TemporarySaveButton from "@components/common/saveBar/TemporarySaveButton";
import SubmitButton from "@components/common/saveBar/SubmitButton";
import { showHasServerErrorModal } from "@cache/productManagement";
import { SubmissionType } from "@constants/index";

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
      void (async () => {
        const shopInfo = cache.readQuery<{ getShopInfo: ShopInfo }>({
          query: GET_SHOP_INFO,
        });

        if (!shopInfo) return;

        const update = {
          ...shopInfo.getShopInfo,
          ...(await restructureShopSettingStates(watch)),
        };

        cache.writeQuery({
          query: GET_SHOP_INFO,
          data: {
            getShopInfo: update,
          },
        });
      })();
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
      showHasServerErrorModal("", "??? ?????? ????????????");
    }

    if (isTemporarySaveShopError) {
      showHasServerErrorModal("", "??? ?????? ????????????");
    }

    if (isSubmissionError) {
      showHasServerErrorModal("", "??? ?????? ??????");
    }

    if (isEditingError) {
      showHasServerErrorModal("", "??? ?????? ??????");
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

    const temporarySaveShopInput = await restructureShopSettingStates(watch);

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
        description: <>?????? ?????? ??? ?????? ??????</>,
        cancelButtonVisibility: false,
      });

      console.log(error);

      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>???????????? ???????????????.</>,
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
        unfulfilledInputListVar([]);

        const input = await restructureShopSettingStates(watch);

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

        // const nullableFields = [
        //   "safetyAuthentication",
        //   "safetyAuthenticationExpiredDate",
        //   "identificationCardNumber",
        //   "identificationCardCopyPhoto",
        //   hasIdentificationCardAuthenticated && "representativeName",
        //   hasIdentificationCardAuthenticated && "businessRegistrationNumber",
        //   hasIdentificationCardAuthenticated && "corporateRegistrationNumber",
        //   hasIdentificationCardAuthenticated && "isSimpleTaxpayers",
        //   hasIdentificationCardAuthenticated && "companyLocation",
        //   hasIdentificationCardAuthenticated && "onlineSalesLicense",
        //   isConditionalFreeShipmentUnset && "shipmentConditionalPrice",
        // ];

        const nullableFields = [
          "safetyAuthentication",
          "safetyAuthenticationExpiredDate",
          "identificationCardNumber",
          "identificationCardCopyPhoto",
          hasIdentificationCardAuthenticated &&
            BusinessInformations.BusinessName,
          hasIdentificationCardAuthenticated &&
            BusinessInformations.RepresentativeName,
          hasIdentificationCardAuthenticated &&
            BusinessInformations.BusinessRegistrationNumber,
          hasIdentificationCardAuthenticated &&
            BusinessInformations.CorporateRegistrationNumber,
          hasIdentificationCardAuthenticated &&
            BusinessInformations.IsSimpleTaxpayers,
          hasIdentificationCardAuthenticated &&
            BusinessInformations.CompanyLocation,
          hasIdentificationCardAuthenticated &&
            BusinessInformations.OnlineSalesLicense,
          "shipmentType",
          "shipmentPrice",
          "shipmentDistantPrice",
          "shipmentReturnPrice",
          "shipmentExchangePrice",
          "isBundleShipment",
          "shipmentConditionalPrice",
        ];

        const { isFulfilled, unfulfilledInputList } = validateInputFulfillment(
          input,
          nullableFields,
          [isShipmentPriceFree && "shipmentPrice"].filter(Boolean)
        );

        if (!isFulfilled) {
          unfulfilledInputListVar(unfulfilledInputList);

          const unfulfilledSectionNames = unfulfilledInputList.map(
            ({ name, status }) => ({
              name: shopSettingsSectionMapper[name],
              status,
            })
          );

          const targetSection =
            shopSettingsSectionMapper[unfulfilledInputList[0].name];
          const sectionReferenceList = sectionReferenceVar();
          const targetSectionReference = sectionReferenceList[targetSection];

          unfulfilledSectionNames.forEach(({ name, status }) => {
            sectionFulfillmentVar({
              ...sectionFulfillmentVar(),
              [name]: status,
            });
          });

          const SECTION_TOP_MARGIN = 44;

          const scrollTo =
            targetSectionReference.offsetTop - SECTION_TOP_MARGIN;

          contentsContainerReferenceVar().scrollTo(0, scrollTo);

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
              description: <>??? ?????? ????????? ?????????????????????.</>,
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
            description: <>?????????????????????.</>,
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
            description: <>??? ?????? ?????? ??? ?????? ??????</>,
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
                ??? ?????? ????????? ?????????????????????. <br />
                ???????????? ?????? ?????? ??? ????????? ???????????????.
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
            description: <>?????? ???????????????.</>,
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
          disabled={isLoadingSubmission}
          ref={(newRef: HTMLElement) => saveShopButtonRefVar(newRef)}
        >
          {hasShopRegistered ? "??????" : "??????"}
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};

export default SaveBar;
