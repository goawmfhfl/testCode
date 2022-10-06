import React from "react";
import styled from "styled-components";

import { filterOptionStatusVar } from "@cache/ProductManagement";

const FilterBar = () => {
  const changeFilterOptionNameClick =
    (filterOptionName: string | null) => () => {
      filterOptionStatusVar(filterOptionName);
    };

  return (
    <Container>
      <Button onClick={changeFilterOptionNameClick(null)}>전체</Button>
      <Button onClick={changeFilterOptionNameClick("ON_SALE")}>판매중</Button>
      <Button onClick={changeFilterOptionNameClick("STOP_SALE")}>숨김</Button>
      <Button onClick={changeFilterOptionNameClick("SOLD_OUT")}>품절</Button>
    </Container>
  );
};

const Container = styled.ul`
  background-color: pink;
  padding: 1em;

  display: flex;
`;

const Button = styled.li`
  background-color: yellow;
  padding: 1em;
  margin-right: 1em;
`;

export default FilterBar;
