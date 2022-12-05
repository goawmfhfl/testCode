import { gql } from "@apollo/client";

export interface GetUserByEmailResult {
  getUserByEmail: {
    ok: boolean;
    error: string | null;
    user: {
      phoneNumber: string;
    };
  };
}

export interface GetUserByEmailInput {
  input: {
    email: string;
  };
}

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($input: GetUserByEmailInput!) {
    getUserByEmail(input: $input) {
      ok
      error
      user {
        phoneNumber
      }
    }
  }
`;
