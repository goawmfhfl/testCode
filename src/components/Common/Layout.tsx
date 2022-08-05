import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import GlobalNavigationBar from "@components/common/GlobalNavigationBar";
import SideNavigationBar from "@components/common/SideNavigationBar";
import Footer from "@components/common/Footer";
import SaveBar from "@components/common/SaveBar";
import { modalVar, overModalVar, systemModalVar } from "@cache/index";
import SystemModal from "@components/common/SystemModal";

interface LayoutProps {
  hasSaveBar?: boolean;
  children: React.ReactNode;
}

const Layout = ({ children, hasSaveBar }: LayoutProps) => {
  const modal = useReactiveVar(modalVar);
  const overModal = useReactiveVar(overModalVar);
  const systemModal = useReactiveVar(systemModalVar);

  return (
    <>
      <Container hasSaveBar={hasSaveBar}>
        <GlobalNavigationBar />
        <SideNavigationBar />
        <ContentsContainer>
          <ContentsWrapper>{children}</ContentsWrapper>
          <Footer />
        </ContentsContainer>
        {hasSaveBar && <SaveBar />}
      </Container>

      {modal.isVisible && (
        <ModalLayer>
          {modal.component}
          {overModal.isVisible && overModal.component}
        </ModalLayer>
      )}

      {systemModal.isVisible && <SystemModal />}
    </>
  );
};

const Container = styled.div<{ hasSaveBar: boolean | undefined }>`
  display: flex;
  flex-direction: column;

  min-height: 100vh;
  margin-bottom: ${({ hasSaveBar }) => (hasSaveBar ? "72px" : "")}; ;
`;

const ContentsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 210px;
  margin-top: 56px;
`;

const ContentsWrapper = styled.div`
  flex: 1;
`;

const ModalLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;

  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 1, 1, 0.5);

  & > div:first-child {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 100;

    transform: translate(-50%, -50%);

    box-shadow: 7px 10px 8px 0px #0000001a;
  }

  & > div:nth-child(2) {
    position: fixed;
    top: 46%;
    left: 52%;
    z-index: 150;

    transform: translate(-50%, -50%);

    box-shadow: 7px 10px 8px 0px #0000001a;
  }
`;

export default Layout;
