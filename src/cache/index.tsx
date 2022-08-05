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
  buttonText: string;
  hasMultiButton: boolean;
  handleConfirmButtonClick?: () => void;
  handleCancelButtonClick?: () => void;
}>({
  isVisible: false,
  icon: "",
  description: <></>,
  buttonText: "",
  hasMultiButton: true,
  handleConfirmButtonClick: () => {
    closeSystemModal();
  },
  handleCancelButtonClick: () => {
    closeSystemModal();
  },
});

function closeSystemModal() {
  systemModalVar({
    ...systemModalVar(),
    isVisible: false,
  });
}
