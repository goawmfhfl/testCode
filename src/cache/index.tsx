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
