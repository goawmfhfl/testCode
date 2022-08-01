import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import Button from "@components/common/Button";
import BusinessLicenseModal from "@components/ShopSetting/BusinessLicenseModal";
import { modalVar } from "@cache/index";
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
  const businessLicense = useReactiveVar(businessLicenseVar);

  const hasBusinessLicense = Object.values(businessLicense).find(
    (el) => el !== ""
  );

  const {
    rprsvNm: ownerName,
    bizrno: businessNumber,
    crno: corporateNumber,
    simTxtnTrgtYnDesc: isTaxPayer,
    rdnAddr: address,
    prmsnMgtNo: ecommerceRegistrationNumber,
  } = businessLicense;

  return (
    <Container>
      {!hasBusinessLicense ? (
        <HasNoInfoContainer>
          <InfoText>등록된 사업자등록증/통신판매업신고증이 없습니다.</InfoText>
          <Button
            size="small"
            full={false}
            onClick={() =>
              modalVar({
                ...modalVar(),
                isVisible: true,
                component: <BusinessLicenseModal />,
              })
            }
          >
            등록하기
          </Button>
        </HasNoInfoContainer>
      ) : (
        <HasInfoContainer>
          <InfoList>
            <InfoContainer>
              <Text>대표자명</Text>
              <Text>{ownerName}</Text>
            </InfoContainer>
            <InfoContainer>
              <Text>사업자등록번호 </Text>
              <Text>{businessNumber}</Text>
            </InfoContainer>
            <InfoContainer>
              <Text>법인등록번호</Text>
              <Text>{corporateNumber}</Text>
            </InfoContainer>
            <InfoContainer>
              <Text>간이과세대상자</Text>
              <Text>{isTaxPayer}</Text>
            </InfoContainer>
            <InfoContainer>
              <Text>소재지</Text>
              <Text>{address}</Text>
            </InfoContainer>
            <InfoContainer>
              <Text>통신판매업신고번호</Text>
              <Text>{ecommerceRegistrationNumber}</Text>
            </InfoContainer>
          </InfoList>
        </HasInfoContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;

  width: 100%;
`;

const HasNoInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 736px;
  padding: 16px 174px;
  background-color: ${({ theme: { palette } }) => palette.grey100};

  & > :first-child {
    margin-bottom: 16px;
  }

  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

const HasInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;
  padding: 24px 40px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

const InfoList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled.li`
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
