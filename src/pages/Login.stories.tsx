import { ComponentMeta } from "@storybook/react";
import Login, { LOGIN } from "@pages/Login";

export default {
  component: Login,
  title: "Login",
} as ComponentMeta<typeof Login>;

export const Example = () => <Login />;

Example.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: LOGIN,
        },
        result: {
          data: {
            ok: false,
            error: "Error found!",
            token: null,
          },
        },
      },
    ],
  },
};
