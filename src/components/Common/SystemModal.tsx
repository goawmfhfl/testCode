import React from "react";
import styled from "styled-components";

import Button from "@components/Button";
interface SystemModalType {
  icon?: React.ReactNode;
  children: React.ReactNode;
  text: string;
  multi: boolean;
}

const SystemModal = ({ icon, children, text, multi }: SystemModalType) => {
  return (
    <Container>
      {icon}
      <Text>{children}</Text>
      {multi ? (
        <ButtonWrapper>
          <Button size="small" full={false} className="positive">
            확인
          </Button>
          <Button size="small" full={false}>
            취소
          </Button>
        </ButtonWrapper>
      ) : (
        <Button size="small" full={false}>
          {text}
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

  padding: 20px 56.5px;
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
