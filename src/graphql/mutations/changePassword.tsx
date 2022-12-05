import { gql } from "@apollo/client";

export interface ChangePasswordResult {
  changePassword: {
    ok: boolean;
    error: string | null;
  };
}

export interface ChangePasswordInput {
  input: {
    email: string;
    password: string;
  };
}

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      ok
      error
    }
  }
`;
