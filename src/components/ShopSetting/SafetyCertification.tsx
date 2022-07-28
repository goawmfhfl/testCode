import { useState } from "react";
import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";
import SafetyModal from "@components/ShopSetting/SafetyModal";

const SafetyCertification = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  return (
    <Container>
      <SafetyContainer>
        <NoticeContainer icon={exclamationmarkSrc}>
          캔들, 디퓨저 판매 브랜드는 검사 인증을 완료해야 상품 등록시 카테고리
          설정에서 캔들, 디퓨저를 선택하실 수 있습니다.
        </NoticeContainer>
        <ConfirmContainer>
          <ConfirmInfoText>안전기준 적합 확인 검사 신고번호</ConfirmInfoText>
          {isConfirm && <ConfirmText>인증완료</ConfirmText>}
          <Button size="small" full={false} onClick={() => setModal(true)}>
            인증하기
          </Button>
        </ConfirmContainer>
      </SafetyContainer>

      {modal && (
        <SafetyModal
          onClickModalHandler={setModal}
          onClickCheckIsConfrim={setIsConfirm}
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

const SafetyContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;

  & > :first-child {
    margin-bottom: 24px;
  }
`;

const ConfirmContainer = styled.div`
  display: flex;
  width: 702px;
  align-items: center;

  & > :first-child {
    margin-right: 12px;
  }

  & > span {
    margin-right: 12px;
  }
  & > span + span {
    color: ${({ theme: { palette } }) => palette.grey500};
  }

  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

const ConfirmInfoText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;
`;

const ConfirmText = styled.span`
  font-family: "NanumGothic";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

export default SafetyCertification;
