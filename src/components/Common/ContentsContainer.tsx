import React, { BaseSyntheticEvent } from "react";
import styled, { css } from "styled-components";

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
`;

const Form = styled.form`
  ${containerStyles}
`;

const Container = styled.div`
  ${containerStyles}
`;

export default ContentsContainer;
