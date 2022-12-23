import { useEffect } from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { Pathnames } from "@constants/index";
import useShopInfo from "@hooks/useShopInfo";
import {
  loadingSpinnerVisibilityVar,
  saleSubItemVisibilityVar,
  sideNavigationBarStatusVar,
} from "@cache/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import { saleMenuStatusVar } from "@cache/sale";
import { MenuStatusType, SaleMenuStatusType } from "@constants/sale";

import mediumTopSrc from "@icons/medium-top.svg";
import mediumBottomSrc from "@icons/medium-bottom.svg";

const SideNavigationBar = () => {
  const { data, loading, error } = useShopInfo();

  const saleMenuStatus = useReactiveVar(saleMenuStatusVar);
  const saleSubItemVisibility = useReactiveVar(saleSubItemVisibilityVar);
  const sideNavigationBarStatus = useReactiveVar(sideNavigationBarStatusVar);

  const handleSubNavItemClick = (status: SaleMenuStatusType) => () => {
    saleMenuStatusVar(status);
  };

  useEffect(() => {
    loadingSpinnerVisibilityVar(loading);

    if (error) {
      showHasServerErrorModal("", "샵 정보 가져오기");
    }
  }, [loading, error]);

  const isRegisteredShop = data?.getShopInfo.shop.registered;

  return (
    <Container>
      <Header>Shop Manager</Header>
      <NavList>
        <NavItem
          disabled={!isRegisteredShop}
          isActive={sideNavigationBarStatus === Pathnames.Product}
        >
          <Link to={Pathnames.Product}>상품관리</Link>
        </NavItem>
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === Pathnames.Order}
        >
          <Link to={Pathnames.Order}>판매관리</Link>
          {/* <DropdownIcon
            src={saleSubItemVisibility ? mediumTopSrc : mediumBottomSrc}
            isActive={sideNavigationBarStatus === Pathnames.Order}
          /> */}
        </NavItem>
        {saleSubItemVisibility && (
          <SubNavContainer
            isActive={sideNavigationBarStatus === Pathnames.Order}
          >
            <SubNavItem
              isActive={saleMenuStatus === SaleMenuStatusType.ORDER}
              onClick={handleSubNavItemClick(SaleMenuStatusType.ORDER)}
            >
              주문 관리
            </SubNavItem>
            <SubNavItem
              isActive={saleMenuStatus === SaleMenuStatusType.CANCEL}
              onClick={handleSubNavItemClick(SaleMenuStatusType.CANCEL)}
            >
              취소 관리
            </SubNavItem>
            <SubNavItem
              isActive={saleMenuStatus === SaleMenuStatusType.REFUND}
              onClick={handleSubNavItemClick(SaleMenuStatusType.REFUND)}
            >
              반품 관리
            </SubNavItem>
            <SubNavItem
              isActive={saleMenuStatus === SaleMenuStatusType.EXCHANGE}
              onClick={handleSubNavItemClick(SaleMenuStatusType.EXCHANGE)}
            >
              교환 관리
            </SubNavItem>
          </SubNavContainer>
        )}
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === Pathnames.Inquiry}
        >
          <Link to={Pathnames.Inquiry}>문의관리</Link>
        </NavItem>
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === Pathnames.Settlement}
        >
          <Link to={Pathnames.Settlement}>정산관리</Link>
        </NavItem>
        <NavItem isActive={sideNavigationBarStatus === Pathnames.Shop}>
          <Link to={Pathnames.Shop}>샵 설정</Link>
        </NavItem>
        <NavItem isActive={sideNavigationBarStatus === Pathnames.Notice}>
          <Link to={Pathnames.Notice}>판매자 공지사항</Link>
        </NavItem>
      </NavList>
    </Container>
  );
};

const Container = styled.div`
  width: 210px;
  height: calc(100vh - 56px);
  background-color: ${({ theme: { palette } }) => palette.grey900};

  position: fixed;
  left: 0;
  top: 56px;
  z-index: 1000;

  color: white;
`;

const Header = styled.div`
  padding: 26px 40px;

  font-family: "Helvetica";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
  letter-spacing: -0.015em;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.li<{ disabled?: boolean; isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.typo.korean.title.secondary.basic};
  padding: 15px 30px;

  cursor: pointer;

  color: ${({ disabled, theme }) =>
    disabled ? theme.palette.grey500 : "white"};
  background-color: ${({ isActive, theme: { palette } }) =>
    isActive && palette.grey700};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "initial")}; ;
`;

const DropdownIcon = styled.img<{ isActive: boolean }>`
  pointer-events: ${({ isActive }) => (isActive ? "initial" : "none")}; ;
`;

const SubNavContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;

  min-width: 210px;
  background-color: ${({ isActive, theme: { palette } }) =>
    isActive && palette.grey700};
`;

const SubNavItem = styled.li<{ isActive: boolean }>`
  padding-top: 12px;
  padding-bottom: 8px;
  padding-left: 54px;

  color: ${({ theme: { palette }, isActive }) => isActive && palette.red500};
`;

export default SideNavigationBar;
