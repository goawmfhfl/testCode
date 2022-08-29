import { makeVar } from "@apollo/client";
import React from "react";

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
  icon: string;
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

export const GNBReferenceVar = makeVar<HTMLElement | null>(null);
export const contentsContainerReferenceVar = makeVar<HTMLElement | null>(null);

function closeSystemModal() {
  systemModalVar({
    ...systemModalVar(),
    isVisible: false,
  });
}
