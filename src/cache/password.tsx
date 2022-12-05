import { makeVar } from "@apollo/client";

export const inputVar = makeVar({
  email: "",
  phoneNumber: "",
  authCode: "",
});

export const isAuthenticatedVar = makeVar(false);
