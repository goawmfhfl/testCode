import React from "react";
import styled from "styled-components/macro";

import Button from "./Button";

interface SystemModalType {
  icon?: string;
  children: React.ReactNode;
  buttonText?: string;
  hasMultiButton: boolean;
  handleConfirmButtonClick?: () => void;
  handleCancelButtonClick?: () => void;
}

const SystemModal = ({
  icon = "",
  children,
  buttonText,
  hasMultiButton,
  handleConfirmButtonClick,
  handleCancelButtonClick,
}: SystemModalType) => {
  return (
    <Container>
      {icon && <Icon src={icon} />}
      <Text>{children}</Text>
      {hasMultiButton ? (
        <ButtonWrapper>
          <Button
            type="button"
            size="small"
            full={false}
            className="positive"
            onClick={handleConfirmButtonClick}
          >
            확인
          </Button>
          <Button
            type="button"
            size="small"
            full={false}
            onClick={handleCancelButtonClick}
          >
            취소
          </Button>
        </ButtonWrapper>
      ) : (
        <Button
          type="button"
          size="small"
          full={false}
          onClick={handleConfirmButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateY(-50%);
  z-index: 100;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 279px;
  padding: 20px 0px;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  & > img {
    width: 24px;
    height: 24px;
    margin-bottom: 7px;
  }

  & > span {
    margin-bottom: 16px;
  }
`;

const Text = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.1px;
`;
const Icon = styled.img``;

const ButtonWrapper = styled.div`
  display: flex;

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;

  & > :first-child {
    margin-right: 16px;
  }
`;

export default SystemModal;
