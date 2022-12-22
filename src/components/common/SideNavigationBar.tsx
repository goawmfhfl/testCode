import { useEffect, useState } from "react";
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
  const sideNavigationBarStatus = useReactiveVar(sideNavigationBarStatusVar);
  const saleSubItemVisibility = useReactiveVar(saleSubItemVisibilityVar);

  const handleNavItemClick = (status: MenuStatusType) => () => {
    if (status === MenuStatusType.SALE) {
      saleSubItemVisibilityVar(!saleSubItemVisibility);
    } else {
      saleSubItemVisibilityVar(false);
    }

    sideNavigationBarStatusVar(status);
  };

  const handleSubNavItemClick = (status: SaleMenuStatusType) => () => {
    saleMenuStatusVar(status);
  };
  useEffect(() => {
    loadingSpinnerVisibilityVar(loading);

    if (error) {
      showHasServerErrorModal("", "샵 정보 가져오기");
      console.error(error);
    }
  }, [loading, error]);

  const isRegisteredShop = data?.getShopInfo.shop.registered;

  return (
    <Container>
      <Header>Shop Manager</Header>
      <NavList>
        <NavItem
          disabled={!isRegisteredShop}
          isActive={sideNavigationBarStatus === MenuStatusType.PRODUCT}
        >
          <Link
            to={Pathnames.Product}
            onClick={handleNavItemClick(MenuStatusType.PRODUCT)}
          >
            상품관리
          </Link>
        </NavItem>
        <Link to={Pathnames.Order}>
          <NavItem
            disabled={false}
            isActive={sideNavigationBarStatus === MenuStatusType.SALE}
            onClick={handleNavItemClick(MenuStatusType.SALE)}
          >
            판매관리
            <DropdownIcon
              src={saleSubItemVisibility ? mediumTopSrc : mediumBottomSrc}
              isActive={sideNavigationBarStatus === MenuStatusType.SALE}
            />
          </NavItem>
        </Link>
        {saleSubItemVisibility && (
          <SubNavContainer
            isActive={sideNavigationBarStatus === MenuStatusType.SALE}
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
          isActive={sideNavigationBarStatus === MenuStatusType.INQUIRY}
        >
          <Link
            to={Pathnames.Inquiry}
            onClick={handleNavItemClick(MenuStatusType.INQUIRY)}
          >
            문의관리
          </Link>
        </NavItem>
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === MenuStatusType.SETTLEMENT}
        >
          <Link
            to={Pathnames.Settlement}
            onClick={handleNavItemClick(MenuStatusType.SETTLEMENT)}
          >
            정산관리
          </Link>
        </NavItem>
        <NavItem isActive={sideNavigationBarStatus === MenuStatusType.SHOP}>
          <Link
            to={Pathnames.Shop}
            onClick={handleNavItemClick(MenuStatusType.SHOP)}
          >
            샵 설정
          </Link>
        </NavItem>
        <NavItem isActive={sideNavigationBarStatus === MenuStatusType.NOTICE}>
          <Link
            to={Pathnames.Notice}
            onClick={handleNavItemClick(MenuStatusType.NOTICE)}
          >
            판매자 공지사항
          </Link>
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
