import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";
import SafetyCertificationModal from "@components/shopSetting/SafetyCertificationModal";
import { modalVar } from "@cache/index";
import { safetyCertificationVar } from "@cache/shopSettings";

const SafetyCertification = () => {
  const safetyCerification = useReactiveVar(safetyCertificationVar);

  const handleAuthenticationButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: true,
      component: <SafetyCertificationModal />,
    });
  };

  return (
    <Container>
      <SafetyContainer>
        <NoticeContainer icon={exclamationmarkSrc}>
          캔들, 디퓨저 판매 브랜드는 검사 인증을 완료해야 상품 등록시 카테고리
          설정에서 캔들, 디퓨저를 선택하실 수 있습니다.
        </NoticeContainer>

        <ConfirmContainer>
          <ConfirmInfoText>안전기준 적합 확인 검사 신고번호</ConfirmInfoText>
          {safetyCerification.isConfirmed && (
            <ConfirmText>인증완료</ConfirmText>
          )}

          <Button
            size="small"
            full={false}
            onClick={handleAuthenticationButtonClick}
          >
            인증하기
          </Button>
        </ConfirmContainer>
      </SafetyContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const SafetyContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConfirmContainer = styled.div`
  display: flex;
  width: 702px;
  align-items: center;

  margin-top: 10px;

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
