import { gql } from "@apollo/client";
import { OathCompany, UserRole } from "@models/login";

export interface SellerLoginType {
  sellerLogin: {
    ok: boolean;
    error: string;
    user: { name: string; role: UserRole };
    token: string;
  };
}

export interface SellerLoginInputType {
  input: {
    email: string;
    password: string;
    oAuthAccessToken?: string;
    oAuthAccessId?: string;
    oAuthProvider?: OathCompany;
  };
}

export const SELLER_LOGIN = gql`
  mutation SellerLogin($input: LoginInput!) {
    sellerLogin(input: $input) {
      ok
      error
      user {
        name
        role
      }
      token
    }
  }
`;
