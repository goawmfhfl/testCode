import { useState } from "react";
import styled from "styled-components";

import Button from "@components/Common/Button";
import EnterPreneurModal from "./EnterPreneurModal";

export interface EnterPreneurInfoType {
  rprsvNm: string; // 대표자명
  bizrno: string; // 사업자 등록번호
  crno: string; // 법인 등록번호
  simTxtnTrgtYnDesc: string; // 간이과세대상자
  rdnAddr: string; // 소재지
  prmsnMgtNo: string; // 통신판매업신고번호(인허가관리번호)
}

const EnterPreneur = () => {
  const [enterPreneurInfo, setEnterPreneurInfo] =
    useState<EnterPreneurInfoType>({
      rprsvNm: "",
      bizrno: "",
      crno: "",
      simTxtnTrgtYnDesc: "",
      rdnAddr: "",
      prmsnMgtNo: "",
    });
  const [modal, setModal] = useState<boolean>(false);
  const {
    rprsvNm: ownerName,
    bizrno: businessNumber,
    crno: corporateNumber,
    simTxtnTrgtYnDesc: isTaxPayer,
    rdnAddr: address,
    prmsnMgtNo: ecommerceRegistrationNumber,
  } = enterPreneurInfo;

  const hasEntreprenuer: boolean = Object.values(enterPreneurInfo).find(
    (el) => el !== ""
  ) as boolean;

  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>사업자 정보(간이,법인)</SubTitle>
      </SubTitleWrapper>
      {!hasEntreprenuer ? (
        <HasNoInfoContainer>
          <InfoText>등록된 사업자등록증/통신판매업신고증이 없습니다.</InfoText>
          <Button size="small" full={false} onClick={() => setModal(true)}>
            등록하기
          </Button>
        </HasNoInfoContainer>
      ) : (
        <HasInfoContainer>
          <EntrePreneurInfoList>
            <EntrepreneurInfoContainer>
              <EntrePreneurText>대표자명</EntrePreneurText>
              <EntrePreneurText>{ownerName}</EntrePreneurText>
            </EntrepreneurInfoContainer>
            <EntrepreneurInfoContainer>
              <EntrePreneurText>사업자등록번호 </EntrePreneurText>
              <EntrePreneurText>{businessNumber}</EntrePreneurText>
            </EntrepreneurInfoContainer>
            <EntrepreneurInfoContainer>
              <EntrePreneurText>법인등록번호</EntrePreneurText>
              <EntrePreneurText>{corporateNumber}</EntrePreneurText>
            </EntrepreneurInfoContainer>
            <EntrepreneurInfoContainer>
              <EntrePreneurText>간이과세대상자</EntrePreneurText>
              <EntrePreneurText>{isTaxPayer}</EntrePreneurText>
            </EntrepreneurInfoContainer>
            <EntrepreneurInfoContainer>
              <EntrePreneurText>소재지</EntrePreneurText>
              <EntrePreneurText>{address}</EntrePreneurText>
            </EntrepreneurInfoContainer>
            <EntrepreneurInfoContainer>
              <EntrePreneurText>통신판매업신고번호</EntrePreneurText>
              <EntrePreneurText>{ecommerceRegistrationNumber}</EntrePreneurText>
            </EntrepreneurInfoContainer>
          </EntrePreneurInfoList>
        </HasInfoContainer>
      )}

      {modal && (
        <EnterPreneurModal
          setModal={setModal}
          setEnterPreneurInfo={setEnterPreneurInfo}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  width: 100%;
  padding: 88px 0px;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey400};
`;

const SubTitleWrapper = styled.div`
  min-width: 235px;
  padding-left: 56px;
`;
const SubTitle = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
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

const EntrePreneurInfoList = styled.ul`
  display: flex;
  flex-direction: column;
`;
const EntrepreneurInfoContainer = styled.li`
  display: flex;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500};

  & > :first-child {
    width: 170px;
  }
`;

const EntrePreneurText = styled.span`
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

export default EnterPreneur;
