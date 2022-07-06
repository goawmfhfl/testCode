import React, { BaseSyntheticEvent } from "react";
import styled from "styled-components";

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
    return <div>{children}</div>;
  }

  return (
    <form
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
    </form>
  );
};

export default styled(ContentsContainer)`
  background-color: ${({ theme: { palette } }) => palette.grey100};

  padding: 16px 24px;
`;
