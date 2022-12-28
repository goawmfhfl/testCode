import React from "react";
import styled from "styled-components/macro";

const SelectNew = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled.select`
  padding: 10px;
  border: 1px solid black;
`;

export default SelectNew;
