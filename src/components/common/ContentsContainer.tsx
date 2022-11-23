import React from "react";
import styled, { css } from "styled-components/macro";

interface ContentsContainerProps {
  isForm?: boolean | undefined;
  children: React.ReactNode;
}

const ContentsContainer = ({ isForm, children }: ContentsContainerProps) => {
  if (!(isForm ?? false)) {
    return <Container>{children}</Container>;
  }

  return (
    <Form
      id="hook-form"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      {children}
    </Form>
  );
};

const containerStyles = css`
  background-color: ${({ theme: { palette } }) => palette.grey100};
  padding: 16px 24px;
  height: 100%;

  overflow: scroll;
`;

const Form = styled.form`
  ${containerStyles}
`;

const Container = styled.div`
  ${containerStyles}
`;

export default ContentsContainer;
