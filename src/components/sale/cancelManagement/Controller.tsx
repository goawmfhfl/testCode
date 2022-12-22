import React, { useState } from "react";
import styled from "styled-components";
import { useReactiveVar } from "@apollo/client";

import { skipQuantityType } from "@constants/index";
import {
  OrderSearchType,
  OrderStatusName,
  searchQueryType,
} from "@constants/sale";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  showHasAnyProblemModal,
} from "@cache/index";
import { filterOptionVar } from "@cache/sale/cancel";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import ControllerContainer from "@components/sale/ControllerContainer";
import Button from "@components/common/Button";
import { SelectInput, OptionInput } from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import { checkedOrdersVar } from "@cache/sale/cancel";
import getHasCheckedOrderStatus from "@utils/sale/cancel/getHasCheckedOrderStatus";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const checkedOrders = useReactiveVar(checkedOrdersVar);
  const [temporaryQuery, setTemporaryQuery] = useState<string>("");

  const { isCancelRequestChecked, isCancelCompletedChecked } =
    getHasCheckedOrderStatus(checkedOrders);

  // 취소 요청
  const handleCancelRequestButtonClick = () => {
    if (!checkedOrders.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    return console.log("handleCancelRequestButtonClick");
  };

  // 취소 완료
  const handleCancelCompletedButtonClick = () => {
    if (!checkedOrders.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (isCancelRequestChecked || isCancelCompletedChecked) {
      showHasAnyProblemModal(
        <>
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
        </>
      );
      return;
    }

    return console.log("handleCancelCompletedButtonClick");
  };

  const changeSearchTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as OrderSearchType;

    filterOptionVar({
      ...filterOptionVar(),
      type,
    });
  };

  const changeFilterQueryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemporaryQuery(e.target.value);
  };

  const changeSkipQuantityHandler = ({ target: { value } }) => {
    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      page: 1,
      skip: Number(value),
    });

    paginationSkipVar(0);
  };

  return (
    <ControllerContainer>
      <ActiveButtonContainer>
        <ControlButton
          size="small"
          onClick={handleCancelRequestButtonClick}
          disabled={statusName === OrderStatusName.CANCEL_COMPLETED}
        >
          취소 요청
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleCancelCompletedButtonClick}
          disabled={statusName === OrderStatusName.CANCEL_COMPLETED}
        >
          취소 완료
        </ControlButton>
      </ActiveButtonContainer>
      <FilterContainer>
        <Select
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={type}
          onChange={changeSearchTypeHandler}
        >
          {searchQueryType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </Select>
        <SearchQueryInput
          onChange={changeFilterQueryHandler}
          value={temporaryQuery}
        />

        <Select
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
          onChange={changeSkipQuantityHandler}
        >
          {skipQuantityType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </Select>

        <Button size={"small"}>내보내기</Button>
      </FilterContainer>
    </ControllerContainer>
  );
};

const ActiveButtonContainer = styled.div`
  display: flex;
`;

const ControlButton = styled(Button)`
  margin-right: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
`;

const Select = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 12px;
`;
const Option = styled(OptionInput)``;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

export default Controller;
