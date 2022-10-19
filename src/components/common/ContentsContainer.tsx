import React, { BaseSyntheticEvent } from "react";
import styled, { css } from "styled-components/macro";

interface ContentsContainerProps {
  isForm?: boolean | undefined;
  onSubmit?: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  children: React.ReactNode;
}

const ContentsContainer = ({
  isForm,
  onSubmit,
  children,
}: ContentsContainerProps) => {
  if (!(isForm ?? false) || !onSubmit) {
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
      onSubmit={(e) => {
        e.preventDefault();

        // eslint-disable-next-line
        (async () => {
          await onSubmit();
        })();
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
`;

const Form = styled.form`
  ${containerStyles}
`;

const Container = styled.div`
  ${containerStyles}
`;

export default ContentsContainer;
