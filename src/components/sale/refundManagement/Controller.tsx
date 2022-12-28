import React, { useState } from "react";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import { filterOptionVar } from "@cache/sale/refund";
import { commonFilterOptionVar, paginationSkipVar } from "@cache/index";
import { OrderSearchType, searchQueryType } from "@constants/sale";
import { skipQuantityType } from "@constants/index";
import { changeOrderStatusType } from "@constants/sale/refundManagement/index";

import questionMarkSrc from "@icons/questionmark.svg";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import ControllerContainer from "@components/sale/ControllerContainer";
import Button from "@components/common/Button";
import { SelectInput, OptionInput } from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const [showNotice, setShowNotice] = useState<boolean>(false);
  const [temporaryQuery, setTemporaryQuery] = useState<string>("");

  const changeOrderStatusHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    return "";
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
        <ControlButton size="small">수거</ControlButton>
        <ControlButton size="small">반품 거절</ControlButton>
        <ControlButton size="small">반품 완료 처리</ControlButton>
        <ChangeOrderStatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={type}
          onChange={changeOrderStatusHandler}
        >
          <Option value={"default"}>강제 상태 변경</Option>
          {changeOrderStatusType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </ChangeOrderStatusDropDown>

        <QuestionMarkIconContainer>
          <QuestionMarkIcon
            src={questionMarkSrc}
            onMouseOver={() => setShowNotice(true)}
            onMouseLeave={() => setShowNotice(false)}
          />
          {showNotice && (
            <NoticeCOntainer>
              <NoticeIcon src={questionMarkSrc} />
              <NoticeText>
                강제 상태 변경은 선택한 주문상틔 이후 상태로만 변경 가능합니다.
                <br /> 이전 상태로 변경은 불가합니다.
              </NoticeText>
            </NoticeCOntainer>
          )}
        </QuestionMarkIconContainer>
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
  justify-content: center;
  align-items: center;
`;

const ControlButton = styled(Button)`
  margin-right: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
`;

const ChangeOrderStatusDropDown = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 7px;
`;

const Select = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 12px;
`;

const Option = styled(OptionInput)``;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

const QuestionMarkIconContainer = styled.div`
  position: relative;
`;

const QuestionMarkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const NoticeCOntainer = styled.div`
  position: absolute;
  top: -100%;
  transform: translateY(-50%);

  z-index: 10;

  display: flex;
  width: 397px;
  padding: 8px 16px 8px 8px;
  border-radius: 7px;
  background: ${({ theme: { palette } }) => palette.grey400};
`;

const NoticeText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;

  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
  white-space: nowrap;
`;

const NoticeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;

  user-select: none;
`;

export default Controller;
