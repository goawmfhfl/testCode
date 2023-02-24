import { useEffect } from "react";
import styled from "styled-components/macro";
import { Link, useSearchParams } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { orderStatusGroupVar } from "@cache/sale";
import { decryptSaleStatusId, Pathnames } from "@constants/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import { OrderStatusGroup } from "@constants/sale";
import useShopInfo from "@hooks/useShopInfo";
import {
  loadingSpinnerVisibilityVar,
  saleSubItemVisibilityVar,
  sideNavigationBarStatusVar,
} from "@cache/index";

import mediumTopSrc from "@icons/medium-top.svg";
import mediumBottomSrc from "@icons/medium-bottom.svg";
import { getOrderGroupCounter } from "@utils/sale";

const SideNavigationBar = () => {
  const { data, loading, error } = useShopInfo();

  const [searchParams] = useSearchParams();
  const { statusId } = Object.fromEntries([...searchParams]);

  const saleSubItemVisibility = useReactiveVar(saleSubItemVisibilityVar);
  const sideNavigationBarStatus = useReactiveVar(sideNavigationBarStatusVar);
  const orderStatusGroup = useReactiveVar(orderStatusGroupVar);
  const { order, cancel, refund, exchange } =
    getOrderGroupCounter(orderStatusGroup);

  const handleDrowdownClick = () => {
    saleSubItemVisibilityVar(!saleSubItemVisibility);
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
        <Link to={Pathnames.Product}>
          <NavItem
            disabled={!isRegisteredShop}
            isActive={location.pathname === Pathnames.Product}
          >
            상품관리
          </NavItem>
        </Link>

        {/* <Link to={Pathnames.Order}> */}
        <NavItem
          disabled={location.pathname !== Pathnames.Sale}
          isActive={location.pathname === Pathnames.Sale}
        >
          판매관리
          {/* <DropdownIcon
            src={saleSubItemVisibility ? mediumTopSrc : mediumBottomSrc}
            isActive={location.pathname === Pathnames.Sale}
            onClick={handleDrowdownClick}
          /> */}
        </NavItem>
        {/* </Link> */}

        {/* need Status: saleSubItemVisibility */}
        {location.pathname === Pathnames.Sale && (
          <SubNavContainer
            isActive={sideNavigationBarStatus === Pathnames.Sale}
          >
            <Link to={Pathnames.Order}>
              <SubNavItem
                isActive={
                  decryptSaleStatusId[statusId] === OrderStatusGroup.ORDER
                }
              >
                주문 관리
                {order ? (
                  <OrderCounter count={order}>
                    {order <= 99 ? order : `${order}+`}
                  </OrderCounter>
                ) : null}
              </SubNavItem>
            </Link>

            <Link to={Pathnames.Cancel}>
              <SubNavItem
                isActive={
                  decryptSaleStatusId[statusId] === OrderStatusGroup.CANCEL
                }
              >
                취소 관리
                {cancel ? (
                  <OrderCounter count={cancel}>
                    {cancel <= 99 ? cancel : `${cancel}+`}
                  </OrderCounter>
                ) : null}
              </SubNavItem>
            </Link>

            <Link to={Pathnames.Refund}>
              <SubNavItem
                isActive={
                  decryptSaleStatusId[statusId] === OrderStatusGroup.REFUND
                }
              >
                반품 관리
                {refund ? (
                  <OrderCounter count={refund}>
                    {refund <= 99 ? refund : `${refund}+`}
                  </OrderCounter>
                ) : null}
              </SubNavItem>
            </Link>

            <Link to={Pathnames.Exchange}>
              <SubNavItem
                isActive={
                  decryptSaleStatusId[statusId] === OrderStatusGroup.EXCHANGE
                }
              >
                교환 관리
                {exchange ? (
                  <OrderCounter count={exchange}>
                    {exchange <= 99 ? exchange : `${exchange}+`}
                  </OrderCounter>
                ) : null}
              </SubNavItem>
            </Link>
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
          <a
            href="https://chopsticks.notion.site/b66465d0849a4593b4aec0464ce4151d"
            target="_blank"
          >
            판매자 공지사항
          </a>
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
  display: flex;
  align-items: center;

  padding-top: 12px;
  padding-bottom: 8px;
  padding-left: 54px;

  color: ${({ theme: { palette }, isActive }) => isActive && palette.red500};
`;

const OrderCounter = styled.div<{ count: number }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ count }) => (count <= 99 ? "14px" : "20px")};
  height: 14px;
  border-radius: 50%;
  background-color: ${({ theme: { palette } }) => palette.red900};
  margin-left: 4px;

  color: ${({ theme: { palette } }) => palette.white};
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 700;
  font-size: 8px;
`;

export default SideNavigationBar;
