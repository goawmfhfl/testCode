import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";
import { TailSpin } from "react-loader-spinner";

import GlobalNavigationBar from "@components/common/GlobalNavigationBar";
import SideNavigationBar from "@components/common/SideNavigationBar";
import Footer from "@components/common/Footer";
import ProductSaveBar from "@components/productForm/SaveBar";
import ShopSaveBar from "@components/shopSetting/SaveBar";
import {
  modalVar,
  overModalVar,
  systemModalVar,
  contentsContainerReferenceVar,
  loadingSpinnerVisibilityVar,
} from "@cache/index";
import SystemModal from "@components/common/SystemModal";
import { Pathnames } from "@constants/index";

interface LayoutProps {
  children: React.ReactNode;
  hasSaveBar?: boolean;
}

const Layout = ({ children, hasSaveBar }: LayoutProps) => {
  const modal = useReactiveVar(modalVar);
  const overModal = useReactiveVar(overModalVar);
  const systemModal = useReactiveVar(systemModalVar);
  const loadingSpinnerVisibility = useReactiveVar(loadingSpinnerVisibilityVar);

  const isShopPage = location.pathname === Pathnames.Shop;
  const isProductPage = location.pathname.includes(Pathnames.Product);

  return (
    <>
      <Container>
        <GlobalNavigationBar />
        <SideNavigationBar />

        <ContentsContainer
          hasBottomMargin={hasSaveBar}
          ref={(newRef: HTMLElement) => contentsContainerReferenceVar(newRef)}
          preventScroll={loadingSpinnerVisibility}
        >
          <ContentsWrapper>{children}</ContentsWrapper>
          {!loadingSpinnerVisibility && <Footer />}
        </ContentsContainer>

        {hasSaveBar && isShopPage && <ShopSaveBar />}
        {hasSaveBar && isProductPage && <ProductSaveBar />}
      </Container>

      {modal.isVisible && <ModalLayer>{modal.component}</ModalLayer>}
      {overModal.isVisible && (
        <OverModalLayer>{overModal.component}</OverModalLayer>
      )}
      {systemModal.isVisible && (
        <SystemModalLayer
          hasOtherModal={modal.isVisible || overModal.isVisible}
        >
          {<SystemModal />}
        </SystemModalLayer>
      )}
      {loadingSpinnerVisibility && (
        <LoaderSpinnerLayer>
          <TailSpin
            height="100"
            width="100"
            color={"#fff"}
            ariaLabel="tail-spin-loading"
            visible={true}
          />
        </LoaderSpinnerLayer>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 100vh;
`;

const ContentsContainer = styled.div<{
  hasBottomMargin: boolean;
  preventScroll: boolean;
}>`
  display: flex;
  flex-direction: column;

  margin-left: 210px;
  margin-top: 56px;
  margin-bottom: ${({ hasBottomMargin }) => (hasBottomMargin ? "72px" : "")};

  min-width: 1182px;
  min-height: 100%;

  ${({ preventScroll }) =>
    preventScroll
      ? `
        height: 100vh;
        margin-top: 0;
        margin-bottom: 0;
        overflow: hidden;
        `
      : ""};
`;

const ContentsWrapper = styled.div`
  flex: 1;
`;

const ModalLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 1, 1, 0.5);

  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 100;

    transform: translate(-50%, -50%);

    box-shadow: 7px 10px 8px 0px #0000001a;
  }
`;

const OverModalLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  width: 100vw;
  height: 100vh;
  background-color: transparent;

  & > div {
    position: fixed;
    top: 46%;
    left: 46%;
    z-index: 150;

    transform: translate(-50%, -50%);

    box-shadow: 7px 10px 8px 0px #0000001a;
  }
`;

const SystemModalLayer = styled.div<{ hasOtherModal: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  width: 100vw;
  height: 100vh;
  background-color: ${({ hasOtherModal }) =>
    hasOtherModal ? "transparent" : "rgba(1, 1, 1, 0.5)"};

  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 200;

    transform: translate(-50%, -50%);
    box-shadow: 7px 10px 8px 0px #0000001a;
  }
`;

const LoaderSpinnerLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;

  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 1, 1, 0.5);

  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2001;

    transform: translate(-50%, -50%);
  }
`;

export default Layout;
