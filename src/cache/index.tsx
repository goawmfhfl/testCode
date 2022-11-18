import React from "react";
import { makeVar } from "@apollo/client";
import { SkipQuantityCacheType } from "@models/order/index";

import {
  SHOP_SETTING_SECTIONS,
  PRODUCT_REGISTRATION_SECTIONS,
} from "@constants/index";

export const paginationSkipVar = makeVar<number>(0);

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

export const sectionFulfillmentVar = makeVar<{ [key: string]: boolean }>({
  SHOP_INFO: true,
  SHOP_POLICY: true,
  SAFETY_CERTIFICATION: true,
  SHIPMENT_SETTINGS: true,
  BUSINESS_LICENSE: true,
  REGISTRATION_NUMBER: true,
  PHONE_NUMBER: true,
  SETTLEMENT_ACCOUNT: true,
  PRODUCT_NAME: true,
  CATEGORY: true,
  PRODUCT_IMAGE: true,
  DESCRIPTION: true,
  COLOR: true,
  PRICE: true,
  DISCOUNT: true,
  STOCK: true,
  REQUIRED_OPTION: true,
  SELECTIVE_OPTION: true,
  ORDER_PRODUCTION: true,
  PRODUCT_SHIPMENT_SETTINGS: true,
  SPECIFICATION: true,
  SEARCH_TAG: true,
});

export const SkipQuantityCache: Array<SkipQuantityCacheType> = [
  { id: 0, label: "20개씩 보기", value: 20 },
  { id: 1, label: "50개씩 보기", value: 50 },
  { id: 2, label: "100개씩 보기", value: 100 },
];

export const SkipQuantityCacheVar =
  makeVar<Array<SkipQuantityCacheType>>(SkipQuantityCache);
