import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { Pathnames } from "@constants/index";

const SideNavigationBar = () => {
  return (
    <Container>
      <Header>Shop Manager</Header>
      <NavList>
        <NavItem>
          <Link to={Pathnames.Product}>상품관리</Link>
        </NavItem>
        <NavItem>
          <Link to={Pathnames.Order}>판매관리</Link>
        </NavItem>
        <NavItem>
          <Link to={Pathnames.Inquiry}>문의관리</Link>
        </NavItem>
        <NavItem>
          <Link to={Pathnames.Settlement}>정산관리</Link>
        </NavItem>
        <NavItem>
          <Link to={Pathnames.Shop}>샵 설정</Link>
        </NavItem>
        <NavItem>
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

const NavItem = styled.li`
  ${({ theme }) => theme.typo.korean.title.secondary.basic};
  padding: 15px 30px;

  cursor: pointer;
`;

export default SideNavigationBar;
