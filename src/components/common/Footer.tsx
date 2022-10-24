import styled from "styled-components/macro";

import logoSrc from "@images/logo-black.png";

const Footer = () => {
  return (
    <Container>
      <LogoWrapper>
        <Logo src={logoSrc} />
      </LogoWrapper>
      <CompanyInfoContainer>
        <FirstRow>
          <Info>상호 : (주)클라이머스</Info>
          <Info>대표 : 서강석</Info>
          <Info>개인정보관리책임자 : 서강석</Info>
        </FirstRow>
        <SecondRow>
          <Info>문의 : 070-4879-3425 (10:00 ~ 06:00)</Info>
          <Info>이메일 : service@chopsticks.market</Info>
        </SecondRow>
        <ThirdRow>
          <Info>
            주소 : 서울특별시 종로구 새문안로3길 3,내일빌딩 5층 종로청년창업센터
          </Info>
          <Info>사업자등록번호 : 882-87-01829</Info>
          <Info>통신판매번호 : 2020-서울강남-03401</Info>
        </ThirdRow>
      </CompanyInfoContainer>
      <CopyRight>
        찹스틱스는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 찹스틱스는
        상품 거래정보 및 거래 등에 대하여 책임을 지지 않습니다.Copyright © 2022
        Chopsticks All rights reserved.
      </CopyRight>
    </Container>
  );
};

const Container = styled.footer`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme: { palette } }) => palette.grey500};
  padding: 63px 112px;
`;

const LogoWrapper = styled.div`
  margin-bottom: 24px;
`;
const Logo = styled.img`
  width: 192px;
  height: 40px;
`;

const CompanyInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 36px;

  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
`;

const FirstRow = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 64px;
`;
const SecondRow = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 64px;
`;
const ThirdRow = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 24px;
`;
const Info = styled.li``;

const CopyRight = styled.span`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.1px;
  color: ${({ theme: { palette } }) => palette.grey700};
`;

export default Footer;
