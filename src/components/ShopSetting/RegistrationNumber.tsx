import { useState } from "react";
import styled from "styled-components";

import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import RegistrationNumberModal from "@components/ShopSetting/RegistrationNumberModal";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";

const RegistrationNumber = () => {
  const [modal, setModal] = useState<boolean>(false);
  const textText = true;

  return (
    <Container>
      <NoticeContainer icon={exclamationmarkSrc}>
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
          {textText
            ? "주민등록이 인증되었습니다."
            : "인증된 주민등록증이 없습니다."}
        </InfoText>
        <Button size="small" full={false} onClick={() => setModal(true)}>
          인증하기
        </Button>
      </InfoContainer>
      {modal && <RegistrationNumberModal onClickModalHandler={setModal} />}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  width: 100%;
  padding-bottom: 88px;
`;

const InfoContainer = styled.div`
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

const InfoText = styled.h3`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.1px;
`;

export default RegistrationNumber;
