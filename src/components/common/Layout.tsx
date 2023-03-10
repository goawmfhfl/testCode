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
  sideNavigationBarStatusVar,
  saleSubItemVisibilityVar,
} from "@cache/index";
import SystemModal from "@components/common/SystemModal";
import { Pathnames } from "@constants/index";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
  hasGNB?: boolean;
  hasSaveBar?: boolean;
  hasSideNavigation?: boolean;
}

const Layout = ({
  children,
  hasGNB,
  hasSaveBar,
  hasSideNavigation = true,
}: LayoutProps) => {
  const modal = useReactiveVar(modalVar);
  const overModal = useReactiveVar(overModalVar);
  const systemModal = useReactiveVar(systemModalVar);
  const loadingSpinnerVisibility = useReactiveVar(loadingSpinnerVisibilityVar);

  const isShopPage = location.pathname === Pathnames.Shop;
  const isProductPage = location.pathname.includes(Pathnames.Product);
  const isTablePage =
    location.pathname === Pathnames.Product ||
    location.pathname === Pathnames.Order;

  useEffect(() => {
    sideNavigationBarStatusVar(location.pathname);
    saleSubItemVisibilityVar(location.pathname === Pathnames.Order);
  }, []);

  useEffect(() => {
    if (systemModal.isVisible) return;

    systemModalVar({
      ...systemModalVar(),
      confirmButtonClickHandler: () =>
        systemModalVar({ ...systemModalVar(), isVisible: false }),
      cancelButtonClickHandler: () =>
        systemModalVar({ ...systemModalVar(), isVisible: false }),
    });
  }, [systemModal.isVisible]);

  return (
    <>
      <Container>
        <GlobalNavigationBar />
        {hasSideNavigation && <SideNavigationBar />}

        <ContentsContainer
          hasTopMargin={hasGNB ?? true}
          hasBottomMargin={hasSaveBar}
          hasLeftMargin={hasSideNavigation}
          isTablePage={isTablePage}
          ref={(newRef: HTMLElement) => contentsContainerReferenceVar(newRef)}
          preventScroll={loadingSpinnerVisibility}
        >
          {children}

          <Footer />
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
  hasTopMargin?: boolean;
  hasBottomMargin?: boolean;
  hasLeftMargin?: boolean;
  preventScroll: boolean;
  isTablePage?: boolean;
}>`
  width: ${({ hasLeftMargin }) =>
    hasLeftMargin ? "calc(100vw - 210px)" : "100%"};

  min-width: ${({ isTablePage }) => isTablePage && "1180px"};

  height: ${({ hasTopMargin, hasBottomMargin }) => {
    if (hasTopMargin && hasBottomMargin) {
      return `calc(100vh - 56px - 72px)`;
    }

    if (hasTopMargin) {
      return `calc(100vh - 56px)`;
    }

    if (hasBottomMargin) {
      return `calc(100vh - 72px)`;
    }

    return "100%";
  }};

  position: absolute;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;

  margin-left: ${({ hasLeftMargin }) => (hasLeftMargin ? "210px" : "0px")};
  margin-top: 56px;
  margin-bottom: ${({ hasBottomMargin }) => (hasBottomMargin ? "72px" : "")};

  ${({ preventScroll }) =>
    preventScroll
      ? `
        height: 100vh;
        margin-top: 0;
        margin-bottom: 0;
        overflow: hidden;
        `
      : ""};

  & > div {
    flex: 1;
  }
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
  z-index: 5000;

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
  z-index: 8000;

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
  z-index: 9999;

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
