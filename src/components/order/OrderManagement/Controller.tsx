import React from "react";
import styled from "styled-components";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";

import { SkipQuantityCache } from "@cache/index";
import { searchQueryCache } from "@cache/order/orderManagement";

const Controller = () => {
  return (
    <Container>
      <ActiveButtonContainer>
        <ControllerButton size="small">주문확인</ControllerButton>
        <ControllerButton size="small">발송 처리</ControllerButton>
        <ControllerButton size="small">주문 취소</ControllerButton>
        <ControllerButton size="small">반품 처리</ControllerButton>
        <ControllerButton size="small">교환 처리</ControllerButton>
      </ActiveButtonContainer>
      <SkipQuantityContainer>
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={"BUYER_NAME"}
        >
          {searchQueryCache.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </StatusDropDown>
        <SearchQueryInput />
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
        >
          {SkipQuantityCache.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </StatusDropDown>
      </SkipQuantityContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px;
  background-color: ${({ theme: { palette } }) => palette.white};

  white-space: nowrap;
`;

const ActiveButtonContainer = styled.div`
  display: flex;
`;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

const StatusDropDown = styled(Dropdown)`
  padding-right: 0px;
`;

const ControllerButton = styled(Button)`
  margin-left: 12px;
`;

const SkipQuantityContainer = styled.div`
  display: flex;
`;

export default Controller;
