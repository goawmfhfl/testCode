import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import RegistrationNumberModal from "@components/ShopSetting/RegistrationNumberModal";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";

import { modalVar } from "@cache/index";
import { registrationNumberVar, businessLicenseVar } from "@cache/shopSettings";

const RegistrationNumber = () => {
  const { isConfirmed } = useReactiveVar(registrationNumberVar);
  const { isConfirmed: hasConfirmedBusinessLicense } =
    useReactiveVar(businessLicenseVar);

  const handleAuthenticationButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: true,
      component: <RegistrationNumberModal />,
    });
  };

  return (
    <Container>
      <NoticeContainer icon={exclamationmarkSrc} width={"100%"}>
        사업자등록증 없이 판매하시는 경우 주민등록증 인증을 해주세요. 인증된
        주민등록번호는 정산에만 활용됩니다.
        <br />
        개인자격으로도 판매 가능하나 지속적으로 판매할 시 사업자등록을 권유하며
        주민등록증 사본 속 성함은 정산 계좌 정보의
        <br /> 예금주명과 같아야 합니다. (사업자 등록 번호를 등록하셨을 경우
        주민등록증 인증은 필수가 아닙니다.)
      </NoticeContainer>

      <InfoContainer>
        <InfoText>
          {hasConfirmedBusinessLicense &&
            "사업자 정보 등록시 주민등록증 인증은 필수가 아닙니다. "}

          {!hasConfirmedBusinessLicense &&
            isConfirmed &&
            "주민등록증이 인증되었습니다."}

          {!hasConfirmedBusinessLicense &&
            !isConfirmed &&
            "인증된 주민등록증이 없습니다."}
        </InfoText>

        <Button
          size="small"
          full={false}
          onClick={handleAuthenticationButtonClick}
          // eslint-disable-next-line
          disabled={hasConfirmedBusinessLicense}
        >
          인증하기
        </Button>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 702px;
  padding-bottom: 88px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 16px;
  padding: 16px 174px;
  background-color: ${({ theme: { palette } }) => palette.grey100};

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

const InfoText = styled.h3`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.1px;
  white-space: nowrap;
`;

export default RegistrationNumber;
