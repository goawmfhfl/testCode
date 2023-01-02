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
          <Info>개인정보관리책임자 : 설지우</Info>

          <Info>
            <a href="https://chopsticks.notion.site/b66465d0849a4593b4aec0464ce4151d">
              공지사항
            </a>
          </Info>
        </FirstRow>

        <SecondRow>
          <Info>문의 : 070-4187-3848 (10:00 ~ 17:00)</Info>
          <Info>이메일 : service@chopsticks.market</Info>

          <Info>
            <a href="/documents/service-policy-20221130.pdf">이용약관</a>
          </Info>
        </SecondRow>

        <ThirdRow>
          <Info>
            주소 : 서울특별시 종로구 새문안로3길 3,내일빌딩 5층 종로청년창업센터
          </Info>
          <Info>사업자등록번호 : 882-87-01829</Info>
          <Info>통신판매번호 : 제2022-서울종로-0138호</Info>

          <Info>
            <a href="/documents/privacy-policy-221208.pdf">개인정보처리방침</a>
          </Info>
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  background-color: ${({ theme: { palette } }) => palette.grey500};
  padding: 24px 112px;

  word-break: keep-all;
`;

const LogoWrapper = styled.div`
  margin-bottom: 24px;
`;
const Logo = styled.img`
  width: 192px;
  height: 40px;
`;

const CompanyInfoContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 36px;

  & ul > li:last-child {
    margin-left: auto;
  }
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
const Info = styled.li`
  ${({ theme }) => theme.typo.korean.body.secondary.basic};
`;

const CopyRight = styled.span`
  ${({ theme }) => theme.typo.korean.caption.primary.basic};
  color: ${({ theme: { palette } }) => palette.grey700};
`;

export default Footer;
