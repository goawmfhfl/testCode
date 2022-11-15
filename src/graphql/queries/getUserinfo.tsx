import { gql } from "@apollo/client";
import { UserRole } from "@models/login";

export interface GetUserInfoType {
  getUserInfo: {
    role: UserRole;
  };
}

export const GET_USER_INFO = gql`
  query GetUserInfo {
    getUserInfo {
      role
    }
  }
`;
