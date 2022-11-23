import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";

import questionMarkSrc from "@icons/questionmark.svg";
import { systemModalVar, filterOptionVar } from "@cache/index";
import { Pathnames } from "@constants/index";
import Button from "@components/common/Button";

const FilterBar = () => {
  const navigate = useNavigate();

  const filterOption = useReactiveVar(filterOptionVar);

  const changeFilterOptionNameClick =
    (filterOptionName: string | null) => () => {
      filterOptionVar({ ...filterOption, status: filterOptionName });
    };

  const handleButtonClick = () => {
    navigate(Pathnames.ProductRegistration);
  };

  return (
    <Container>
      <FilterList>
        <Filter
          onClick={changeFilterOptionNameClick(null)}
          isActvie={filterOption.status === null}
        >
          전체
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick("ON_SALE")}
          isActvie={filterOption.status === "ON_SALE"}
        >
          판매중
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick("STOP_SALE")}
          isActvie={filterOption.status === "STOP_SALE"}
        >
          숨김
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick("SOLD_OUT")}
          isActvie={filterOption.status === "SOLD_OUT"}
        >
          <QuestionMarkIcon src={questionMarkSrc} />
          품절
        </Filter>
      </FilterList>
      <Button
        size="big"
        width="126px"
        type="button"
        className="positive"
        onClick={handleButtonClick}
      >
        상품 등록
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const FilterList = styled.ul`
  display: flex;

  height: 48px;
  border-radius: 7px 7px 0px 0px;
  background-color: ${({ theme: { palette } }) => palette.white};

  font-family: "Spoqa Han Sans Neo";
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.015em;
  text-align: left;
`;

const Filter = styled.li<{ isActvie: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 14px 56px;
  border-bottom: 1px solid
    ${({ theme: { palette }, isActvie }) =>
      isActvie ? palette.grey500 : "none"};

  cursor: pointer;
`;

const QuestionMarkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export default FilterBar;
