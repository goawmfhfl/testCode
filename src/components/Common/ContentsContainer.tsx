import React, { BaseSyntheticEvent } from "react";
import styled from "styled-components";

const ContentsContainer = ({
  isForm,
  onSubmit,
  children,
}: {
  isForm?: boolean | undefined;
  onSubmit?: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  children: React.ReactNode;
}) => {
  if (!(isForm ?? false) || !onSubmit) {
    return <Container>{children}</Container>;
  }

  return (
    <Container
      onSubmit={(e) => {
        e.preventDefault();

        // eslint-disable-next-line
        (async () => {
          await onSubmit();
        })();
      }}
    >
      {children}
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme: { palette } }) => palette.grey100};

  padding: 16px 24px;
`;

export default ContentsContainer;
