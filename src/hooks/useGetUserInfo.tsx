import { useQuery } from "@apollo/client";

import { GetUserInfoType, GET_USER_INFO } from "@graphql/queries/getUserInfo";

const useGetUserInfo = () => {
  const { loading, error, data } = useQuery<GetUserInfoType>(GET_USER_INFO, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  return { loading, error, data };
};

export default useGetUserInfo;
