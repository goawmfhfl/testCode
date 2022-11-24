import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import Button from "@components/common/Button";
import BusinessLicenseModal from "@components/shopSetting/BusinessLicenseModal";

import { modalVar } from "@cache/index";
import { BusinessLicenseVariables } from "@models/shopSettings";
import { businessLicenseVar } from "@cache/shopSettings";

export interface BusinessLicenseInfoType {
  rprsvNm: string; // 대표자명
  bizrno: string; // 사업자 등록번호
  crno: string; // 법인 등록번호
  simTxtnTrgtYnDesc: string; // 간이과세대상자
  rdnAddr: string; // 소재지
  prmsnMgtNo: string; // 통신판매업신고번호(인허가관리번호)
}

const BusinessLicense = () => {
  const businessLicense: BusinessLicenseVariables =
    useReactiveVar(businessLicenseVar);

  const hasBusinessLicense = Object.values(businessLicense).find(
    (el: string) => el !== ""
  ) as boolean;

  const handleRegisterButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    modalVar({
      ...modalVar(),
      isVisible: true,
      component: <BusinessLicenseModal />,
    });
  };

  const {
    representativeName,
    businessRegistrationNumber,
    corporateRegistrationNumber,
    isSimpleTaxpayers,
    companyLocation,
    onlineSalesLicense,
  } = businessLicense;

  return (
    <Container>
      {!hasBusinessLicense ? (
        <HasNoInfoContainer>
          <InfoText>등록된 사업자등록증/통신판매업신고증이 없습니다.</InfoText>
          <Button size="small" full={false} onClick={handleRegisterButtonClick}>
            등록하기
          </Button>
        </HasNoInfoContainer>
      ) : (
        <HasInfoContainer>
          <InfoList>
            <Info>
              <Text>대표자명</Text>
              <Text>{representativeName}</Text>
            </Info>
            <Info>
              <Text>사업자등록번호 </Text>
              <Text>{businessRegistrationNumber}</Text>
            </Info>
            <Info>
              <Text>법인등록번호</Text>
              <Text>{corporateRegistrationNumber}</Text>
            </Info>
            <Info>
              <Text>간이과세대상자</Text>
              <Text>{isSimpleTaxpayers}</Text>
            </Info>
            <Info>
              <Text>소재지</Text>
              <Text>{companyLocation}</Text>
            </Info>
            <Info>
              <Text>통신판매업신고번호</Text>
              <Text>{onlineSalesLicense}</Text>
            </Info>
          </InfoList>
        </HasInfoContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme: { palette } }) => palette.grey100};
  border-radius: 7px;
  width: 702px;
`;

const HasNoInfoContainer = styled(InfoContainer)`
  padding: 16px 174px;

  & > :first-child {
    margin-bottom: 16px;
  }

  & > button {
    font-family: "Spoqa Han Sans Neo";
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;

    background-color: #fff;
  }
`;

const HasInfoContainer = styled(InfoContainer)`
  padding: 24px 40px;
`;

const InfoList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const Info = styled.li`
  display: flex;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500};

  & > :first-child {
    width: 170px;
  }
`;

const Text = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.03em;
`;

const InfoText = styled.h3`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.1px;
`;

export default BusinessLicense;
