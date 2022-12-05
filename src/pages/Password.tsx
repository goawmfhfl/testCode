import styled from "styled-components";

import Layout from "@components/common/Layout";
import UserAuthentication from "@components/changePassword/UserAuthentication";
import NewPassword from "@components/changePassword/NewPassword";

const Password = () => {
  return (
    <Layout hasSideNavigation={false}>
      <Container>
        <UserAuthentication />
        <NewPassword />
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 56px);

  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Password;
