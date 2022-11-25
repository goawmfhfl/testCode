import React from "react";
import styled from "styled-components";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import ControllerContainer from "@components/order/ControllerContainer";

import { SkipQuantityCache } from "@cache/index";
import { searchQueryType } from "@models/order/orderManagement";

const Controller = () => {
  return (
    <ControllerContainer>
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
          {searchQueryType.map(({ id, label, value }) => (
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
    </ControllerContainer>
  );
};

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
