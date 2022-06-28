import React from "react";
import styled from "styled-components";

import Button from "@components/Button";
interface SystemModalType {
  icon?: string;
  text: string;
  children: React.ReactNode;
}

const SystemModal = ({ icon, children, text }: SystemModalType) => {
  return (
    <Container>
      <Icon src={icon} />
      <Text>{children}</Text>
      <Button size="small" full={false}>
        {text}
      </Button>
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
    margin-bottom: 7px;
  }

  & > span {
    margin-bottom: 16px;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Text = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.1px;
`;

export default SystemModal;
