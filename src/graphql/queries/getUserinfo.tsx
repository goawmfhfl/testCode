import { gql } from "@apollo/client";
import { UserRole } from "@models/login";

export interface GetUserInfoType {
  getUserInfo: {
    role: UserRole;
  };
}

export const GET_USER_IFNO = gql`
  query GetUserInfo {
    getUserInfo {
      role
    }
  }
`;
