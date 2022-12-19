import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { Pathnames } from "@constants/index";
import useShopInfo from "@hooks/useShopInfo";
import {
  loadingSpinnerVisibilityVar,
  sideNavigationBarStatusVar,
} from "@cache/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import { useReactiveVar } from "@apollo/client";

const SideNavigationBar = () => {
  const { data, loading, error } = useShopInfo();

  const sideNavigationBarStatus = useReactiveVar(sideNavigationBarStatusVar);

  const handleNavItemClick = (status: string) => () => {
    sideNavigationBarStatusVar(status);
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
          onClick={handleNavItemClick("product")}
        >
          <Link to={Pathnames.Product}>상품관리</Link>
        </NavItem>
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === "sale"}
          onClick={handleNavItemClick("sale")}
        >
          <Link to={Pathnames.Order}>판매관리</Link>
        </NavItem>
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === "inquiry"}
          onClick={handleNavItemClick("inquiry")}
        >
          <Link to={Pathnames.Inquiry}>문의관리</Link>
        </NavItem>
        <NavItem
          disabled={true}
          isActive={sideNavigationBarStatus === "settlement"}
          onClick={handleNavItemClick("settlement")}
        >
          <Link to={Pathnames.Settlement}>정산관리</Link>
        </NavItem>
        <NavItem
          isActive={sideNavigationBarStatus === "shop"}
          onClick={handleNavItemClick("shop")}
        >
          <Link to={Pathnames.Shop}>샵 설정</Link>
        </NavItem>
        <NavItem
          isActive={sideNavigationBarStatus === "notice"}
          onClick={handleNavItemClick("notice")}
        >
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
  ${({ theme }) => theme.typo.korean.title.secondary.basic};
  padding: 15px 30px;

  cursor: pointer;

  color: ${({ disabled, theme }) =>
    disabled ? theme.palette.grey500 : "white"};
  background-color: ${({ isActive, theme: { palette } }) =>
    isActive && palette.grey700};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "initial")}; ;
`;

export default SideNavigationBar;
