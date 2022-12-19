import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { Pathnames } from "@constants/index";
import useShopInfo from "@hooks/useShopInfo";
import {
  loadingSpinnerVisibilityVar,
  sideNavigationBarStatusVar,
} from "@cache/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import { saleMenuStatusVar } from "@cache/sale";
import { SaleMenuStatusType } from "@constants/sale";

import mediumTopSrc from "@icons/medium-top.svg";
import mediumBottomSrc from "@icons/medium-bottom.svg";

const SideNavigationBar = () => {
  const { data, loading, error } = useShopInfo();
  const saleMenuStatus = useReactiveVar(saleMenuStatusVar);
  const [saleSubItemVisibilty, setSaleSubItemVisibilty] =
    useState<boolean>(false);

  const handleSaleDropdownClick = () => {
    setSaleSubItemVisibilty((prev) => !prev);
  };

  const sideNavigationBarStatus = useReactiveVar(sideNavigationBarStatusVar);

  const handleNavItemClick = (status: string) => () => {
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
          isActive={sideNavigationBarStatus === "product"}
        >
          <Link to={Pathnames.Product} onClick={handleNavItemClick("product")}>
            상품관리
          </Link>
        </NavItem>
        <NavItem disabled={false} isActive={sideNavigationBarStatus === "sale"}>
          <Link to={Pathnames.Order} onClick={handleNavItemClick("sale")}>
            판매관리
          </Link>
          <DropdownIcon
            src={saleSubItemVisibilty ? mediumTopSrc : mediumBottomSrc}
            isActive={sideNavigationBarStatus === "sale"}
            onClick={handleSaleDropdownClick}
          />
        </NavItem>
        {saleSubItemVisibilty && (
          <SubNavContainer isActive={sideNavigationBarStatus === "sale"}>
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
          isActive={sideNavigationBarStatus === "inquiry"}
        >
          <Link to={Pathnames.Inquiry} onClick={handleNavItemClick("inquiry")}>
            문의관리
          </Link>
        </NavItem>
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === "settlement"}
        >
          <Link
            to={Pathnames.Settlement}
            onClick={handleNavItemClick("settlement")}
          >
            정산관리
          </Link>
        </NavItem>
        <NavItem isActive={sideNavigationBarStatus === "shop"}>
          <Link to={Pathnames.Shop} onClick={handleNavItemClick("shop")}>
            샵 설정
          </Link>
        </NavItem>
        <NavItem isActive={sideNavigationBarStatus === "notice"}>
          <Link to={Pathnames.Notice} onClick={handleNavItemClick("notice")}>
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
  font-family: "Helvetica";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
  letter-spacing: -0.015em;

  padding: 26px 40px;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.li<{ disabled?: boolean; isActive?: boolean }>`
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

  background-color: ${({ isActive, theme: { palette } }) =>
    isActive && palette.grey700};

  width: 100%;
`;
const SubNavItem = styled.li<{ isActive: boolean }>`
  width: 100%;

  color: ${({ theme: { palette }, isActive }) => isActive && palette.red500};

  margin-top: 12px;
  margin-bottom: 8px;
  margin-left: 54px;
`;

export default SideNavigationBar;
