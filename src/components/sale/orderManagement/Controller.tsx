import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import ControllerContainer from "@components/sale/ControllerContainer";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  showHasAnyProblemModal,
  SkipQuantityCache,
} from "@cache/index";
import {
  searchQueryType,
  OrderSearchType,
  OrderStatusType,
} from "@constants/sale";
import { useReactiveVar } from "@apollo/client";
import { checkedOrderIdsVar } from "@cache/sale";
import { filterOptionVar } from "@cache/sale/orderManagement";

const Controller = () => {
  const checkedOrderIds = useReactiveVar(checkedOrderIdsVar);
  const [temporaryQuery, setTemporaryQuery] = useState("");

  // 주문확인
  const handleConfirmOrderButtonClick = () => {
    if (!checkedOrderIds.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }
  };

  //발송처리
  const handleSendButtonClick = () => {
    if (!checkedOrderIds.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }
  };

  //주문취소
  const handleCancelOrderClick = () => {
    if (!checkedOrderIds.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }
  };

  //반품처리
  const handleReturnButtonClick = () => {
    if (!checkedOrderIds.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }
  };

  //교환처리
  const handleExchangeButtonClick = () => {
    if (!checkedOrderIds.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }
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

  useEffect(() => {
    const debounce = setTimeout(() => {
      return commonFilterOptionVar({
        ...commonFilterOptionVar(),
        query: temporaryQuery,
      });
    }, 500);

    return () => clearTimeout(debounce);
  }, [temporaryQuery]);

  return (
    <ControllerContainer>
      <ActiveButtonContainer>
        <ControllerButton size="small" onClick={handleConfirmOrderButtonClick}>
          주문확인
        </ControllerButton>
        <ControllerButton size="small" onClick={handleSendButtonClick}>
          발송 처리
        </ControllerButton>
        <ControllerButton size="small" onClick={handleCancelOrderClick}>
          주문 취소
        </ControllerButton>
        <ControllerButton size="small" onClick={handleReturnButtonClick}>
          반품 처리
        </ControllerButton>
        <ControllerButton size="small" onClick={handleExchangeButtonClick}>
          교환 처리
        </ControllerButton>
      </ActiveButtonContainer>

      <SkipQuantityContainer>
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={OrderSearchType.RECIPIENT_NAME}
          onChange={changeSearchTypeHandler}
        >
          {searchQueryType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </StatusDropDown>
        <SearchQueryInput
          onChange={changeFilterQueryHandler}
          value={temporaryQuery}
        />
        <StatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
          onChange={changeSkipQuantityHandler}
        >
          {SkipQuantityCache.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </StatusDropDown>
        <Button size={"small"}>내보내기</Button>
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
  margin-right: 12px;
`;

const ControllerButton = styled(Button)`
  margin-left: 12px;
`;

const SkipQuantityContainer = styled.div`
  display: flex;
`;

export default Controller;
