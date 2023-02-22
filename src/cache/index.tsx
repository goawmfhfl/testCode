import React from "react";
import { ApolloError, makeVar } from "@apollo/client";
import { SkipQuantityType } from "@models/sale";
import { CommonFilterOptionType } from "@models/index";

import {
  SHOP_SETTING_SECTIONS,
  PRODUCT_REGISTRATION_SECTIONS,
  UnfulfilledStatus,
} from "@constants/index";
import { OrderSearchType } from "@constants/sale";

// Global Layout
export const loadingSpinnerVisibilityVar = makeVar<boolean>(false);
export const saleSubItemVisibilityVar = makeVar<boolean>(true);
export const sideNavigationBarStatusVar = makeVar<string>("");

// TABLE: 페이지네이션
export const paginationVisibilityVar = makeVar<boolean | ApolloError>(true);
export const commonFilterOptionVar = makeVar<CommonFilterOptionType>({
  page: 1,
  skip: 20,
  query: null,
  orderSearchType: OrderSearchType.RECIPIENT_NAME,
});
export const pageNumberListVar = makeVar<Array<number>>([]);
export const paginationSkipVar = makeVar<number>(0);
export const totalPageLengthVar = makeVar<number>(0);

// TABLE: 기타
export const temporaryQueryVar = makeVar<string>("");
export const checkAllBoxStatusVar = makeVar<boolean>(false);

export const modalVar = makeVar<{
  isVisible: boolean;
  component: React.ReactNode;
}>({
  isVisible: false,
  component: <></>,
});

export const overModalVar = makeVar<{
  isVisible: boolean;
  component: React.ReactNode;
}>({
  isVisible: false,
  component: <></>,
});

export const systemModalVar = makeVar<{
  isVisible: boolean;
  icon?: string;
  description: React.ReactNode;
  confirmButtonText: string;
  confirmButtonVisibility: boolean;
  confirmButtonClickHandler: () => void;
  cancelButtonText: string;
  cancelButtonVisibility: boolean;
  cancelButtonClickHandler: () => void;
}>({
  isVisible: false,
  icon: "",
  description: <></>,
  confirmButtonText: "확인",
  confirmButtonVisibility: true,
  confirmButtonClickHandler: () => closeSystemModal(),
  cancelButtonText: "취소",
  cancelButtonVisibility: false,
  cancelButtonClickHandler: () => closeSystemModal(),
});

export const DetailNoticeVar = makeVar<{
  isVisible: boolean;
  component: React.ReactNode;
}>({
  isVisible: false,
  component: <></>,
});

export const GNBReferenceVar = makeVar<HTMLElement | null>(null);
export const contentsContainerReferenceVar = makeVar<HTMLElement | null>(null);
export const saveShopButtonRefVar = makeVar<HTMLElement | null>(null);

function closeSystemModal() {
  systemModalVar({
    ...systemModalVar(),
    isVisible: false,
  });
}

export const sectionReferenceVar = makeVar<{
  [key: string]: null | HTMLElement;
}>({
  [SHOP_SETTING_SECTIONS.SHOP_INFO]: null,
  [SHOP_SETTING_SECTIONS.SHOP_POLICY]: null,
  [SHOP_SETTING_SECTIONS.SAFETY_CERTIFICATION]: null,
  [SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS]: null,
  [SHOP_SETTING_SECTIONS.BUSINESS_LICENSE]: null,
  [SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER]: null,
  [SHOP_SETTING_SECTIONS.PHONE_NUMBER]: null,
  [SHOP_SETTING_SECTIONS.SETTLEMENT_ACCOUNT]: null,
  [PRODUCT_REGISTRATION_SECTIONS.PRODUCT_NAME]: null,
  [PRODUCT_REGISTRATION_SECTIONS.CATEGORY]: null,
  [PRODUCT_REGISTRATION_SECTIONS.PRODUCT_IMAGE]: null,
  [PRODUCT_REGISTRATION_SECTIONS.DESCRIPTION]: null,
  [PRODUCT_REGISTRATION_SECTIONS.DESCRIPTION_IMAGE]: null,
  [PRODUCT_REGISTRATION_SECTIONS.COLOR]: null,
  [PRODUCT_REGISTRATION_SECTIONS.PRICE]: null,
  [PRODUCT_REGISTRATION_SECTIONS.DISCOUNT]: null,
  [PRODUCT_REGISTRATION_SECTIONS.STOCK]: null,
  [PRODUCT_REGISTRATION_SECTIONS.REQUIRED_OPTION]: null,
  [PRODUCT_REGISTRATION_SECTIONS.SELECTIVE_OPTION]: null,
  [PRODUCT_REGISTRATION_SECTIONS.ORDER_PRODUCTION]: null,
  [PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS]: null,
  [PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION]: null,
  [PRODUCT_REGISTRATION_SECTIONS.SEARCH_TAG]: null,
});

export const sectionFulfillmentInitialValue = {
  SHOP_INFO: UnfulfilledStatus.Fulfilled,
  SHOP_POLICY: UnfulfilledStatus.Fulfilled,
  SAFETY_CERTIFICATION: UnfulfilledStatus.Fulfilled,
  SHIPMENT_SETTINGS: UnfulfilledStatus.Fulfilled,
  BUSINESS_LICENSE: UnfulfilledStatus.Fulfilled,
  REGISTRATION_NUMBER: UnfulfilledStatus.Fulfilled,
  PHONE_NUMBER: UnfulfilledStatus.Fulfilled,
  SETTLEMENT_ACCOUNT: UnfulfilledStatus.Fulfilled,
  PRODUCT_NAME: UnfulfilledStatus.Fulfilled,
  CATEGORY: UnfulfilledStatus.Fulfilled,
  PRODUCT_IMAGE: UnfulfilledStatus.Fulfilled,
  DESCRIPTION: UnfulfilledStatus.Fulfilled,
  DESCRIPTION_IMAGE: UnfulfilledStatus.Fulfilled,
  COLOR: UnfulfilledStatus.Fulfilled,
  PRICE: UnfulfilledStatus.Fulfilled,
  DISCOUNT: UnfulfilledStatus.Fulfilled,
  STOCK: UnfulfilledStatus.Fulfilled,
  REQUIRED_OPTION: UnfulfilledStatus.Fulfilled,
  SELECTIVE_OPTION: UnfulfilledStatus.Fulfilled,
  ORDER_PRODUCTION: UnfulfilledStatus.Fulfilled,
  PRODUCT_SHIPMENT_SETTINGS: UnfulfilledStatus.Fulfilled,
  SPECIFICATION: UnfulfilledStatus.Fulfilled,
  SEARCH_TAG: UnfulfilledStatus.Fulfilled,
};

export const sectionFulfillmentVar = makeVar<{
  [key: string]: UnfulfilledStatus | string;
}>(sectionFulfillmentInitialValue);

export const SkipQuantityCache: Array<SkipQuantityType> = [
  { id: 0, label: "20개씩 보기", value: 20 },
  { id: 1, label: "50개씩 보기", value: 50 },
  { id: 2, label: "100개씩 보기", value: 100 },
];

export const SkipQuantityCacheVar =
  makeVar<Array<SkipQuantityType>>(SkipQuantityCache);

export const showHasAnyProblemModal = (description: React.ReactNode) => {
  return systemModalVar({
    ...systemModalVar(),
    isVisible: true,
    description,
    confirmButtonVisibility: true,
    confirmButtonClickHandler: () => {
      systemModalVar({
        ...systemModalVar(),
        isVisible: false,
      });
    },
    cancelButtonVisibility: false,
  });
};
