import { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";

import NoticeContainer from "@components/common/NoticeContainer";
import Checkbox from "@components/common/input/Checkbox";
import Button from "@components/common/Button";
import TextInput from "@components/common/input/TextInput";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import removeOptionIconSrc from "@icons/remove-option.svg";
import smallDownwardArrowIconSrc from "@icons/arrow-downward-small.svg";

const PurchaseOption = () => {
  const { register } = useForm();

  const [optionInputList, setOptionInputList] = useState<
    Array<{
      isRequired: boolean;
      optionName: string;
      optionValues: Array<string>;
    }>
  >([
    {
      isRequired: false,
      optionName: "일러스트",
      optionValues: ["산, 바다"],
    },
    {
      isRequired: false,
      optionName: "액자",
      optionValues: ["화이트, 블랙"],
    },
  ]);

  return (
    <Container>
      <CheckboxContainer>
        <PurchaseOptionCheckbox /> 옵션 설정하기
      </CheckboxContainer>

      <NoticeContainer icon={exclamationMarkSrc}>
        <NoticeList>
          <li>옵션값은 ‘쉼표'로 구분해주세요.</li>
          <li>
            필수 체크 해제시 추가 옵션으로 설정됩니다. 추가 옵션은 소비자가
            필수로 선택하지 않아도 되는 옵션입니다.
          </li>
        </NoticeList>
      </NoticeContainer>

      <OptionInputTable>
        <OptionInputHeader fieldNames={["필수", "옵션명", "옵션값"]} />
        <OptionInputRow />
        <OptionInputRow />
      </OptionInputTable>

      <AdaptButton size="small">
        적용
        <img src={smallDownwardArrowIconSrc} width={14} />
      </AdaptButton>

      <AdaptedOptionTable></AdaptedOptionTable>
    </Container>
  );
};

const Container = styled.div`
  font-family: "SpoqaHanSansNeo";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 0.1px;

  width: 531px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 16px;
  line-height: 16px;
`;

const PurchaseOptionCheckbox = styled(Checkbox)`
  margin-right: 24px;
`;

const NoticeList = styled.ul`
  list-style: disc;
  margin-left: 15px;
  margin-right: 57px;

  line-height: 18px;
`;

const OptionInputTable = styled.table`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const OptionInputHeader = ({ fieldNames }: { fieldNames: Array<string> }) => {
  return (
    <TableHeaderContainer>
      {fieldNames.map((el) => {
        return (
          <TableHeader textAlign={el === "필수" ? "center" : "left"}>
            {el}
          </TableHeader>
        );
      })}
    </TableHeaderContainer>
  );
};

const OptionInputRow = () => {
  return (
    <TableRowContainer>
      <TableData>
        <OptionRequiredCheckbox />
      </TableData>
      <TableData>
        <OptionName />
      </TableData>
      <TableData>
        <OptionValues width={"263px"} />
      </TableData>
      <TableData>
        <img src={removeOptionIconSrc} />
      </TableData>
    </TableRowContainer>
  );
};

const TableHeaderContainer = styled.tr``;
const TableRowContainer = styled.tr``;

const TableHeader = styled.th<{ textAlign: string }>`
  word-break: keep-all;
  padding: 4px 8px;

  text-align: ${({ textAlign }) => textAlign};
`;

const TableData = styled.td`
  text-align: center;
  vertical-align: middle;

  & > input {
    margin: 4px 8px;
  }
`;

const OptionRequiredCheckbox = styled(Checkbox)``;

const OptionName = styled(TextInput)``;

const OptionValues = styled(TextInput)``;

const AdaptButton = styled(Button)``;

const AdaptedOptionTable = () => {
  return (
    <AdaptedOptionTableContainer>
      <AdaptedOptionTableHeaderRow>
        <AdaptedOptionTableHeader className={"headerContainer"} colSpan={2}>
          <AdaptedOptionTableHeaderRow>
            <AdaptedOptionTableHeader colSpan={2}>
              옵션명
            </AdaptedOptionTableHeader>
          </AdaptedOptionTableHeaderRow>
          <AdaptedOptionTableHeaderRow>
            <AdaptedOptionTableHeader>일러스트</AdaptedOptionTableHeader>
            <AdaptedOptionTableHeader>액자</AdaptedOptionTableHeader>
          </AdaptedOptionTableHeaderRow>
        </AdaptedOptionTableHeader>
        <AdaptedOptionTableHeader>옵션가</AdaptedOptionTableHeader>
        <AdaptedOptionTableHeader>재고</AdaptedOptionTableHeader>
      </AdaptedOptionTableHeaderRow>

      <AdaptedOptionTableRow>
        <AdaptedOptionTableData>산</AdaptedOptionTableData>
        <AdaptedOptionTableData>화이트</AdaptedOptionTableData>
        <AdaptedOptionTableData>+10,000</AdaptedOptionTableData>
        <AdaptedOptionTableData>20</AdaptedOptionTableData>
      </AdaptedOptionTableRow>
      <AdaptedOptionTableRow>
        <AdaptedOptionTableData>산</AdaptedOptionTableData>
        <AdaptedOptionTableData>블랙</AdaptedOptionTableData>
        <AdaptedOptionTableData>+10,000</AdaptedOptionTableData>
        <AdaptedOptionTableData>20</AdaptedOptionTableData>
      </AdaptedOptionTableRow>
    </AdaptedOptionTableContainer>
  );
};

const AdaptedOptionTableContainer = styled.table`
  width: 531px;
  margin-top: 16px;

  border-collapse: collapse;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

const AdaptedOptionTableHeaderRow = styled.tr`
  background-color: ${({ theme: { palette } }) => palette.grey400};
`;
const AdaptedOptionTableHeader = styled.th`
  width: 50%;
  padding: 10px;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  border-collapse: collapse;

  vertical-align: middle;

  &.headerContainer {
    padding: 0;

    & th {
      border-top: 0px;
      border-left: 0px;
    }

    & tr:last-child > th {
      border-bottom: 0px;
    }

    & tr > th:last-child {
      border-right: 0px;
    }

    & tr {
      width: 100%;
      display: table;
    }
  }
`;

const AdaptedOptionTableRow = styled.tr``;
const AdaptedOptionTableData = styled.td`
  width: 50%;
  padding: 10px;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  text-align: center;
`;

export default PurchaseOption;
