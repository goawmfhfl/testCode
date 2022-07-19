import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { useFormContext, useWatch } from "react-hook-form";

import { ProductRegistrationFormValues } from "@pages/ProductRegistration";
import NoticeContainer from "@components/common/NoticeContainer";
import Checkbox from "@components/common/input/Checkbox";
import Button from "@components/common/Button";
import TextInput from "@components/common/input/TextInput";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import removeOptionIconSrc from "@icons/remove-option.svg";
import smallDownwardArrowIconSrc from "@icons/arrow-downward-small-red.svg";
import addOptionInputIconSrc from "@icons/add-option-input.svg";

interface OptionInputType {
  id: string;
  disabled?: boolean;
}

interface OptionRowType {
  id: string;
  option: Array<string>;
  optionPrice: number;
  optionStock: number;
}

interface AdaptedOptionType {
  optionHeaders: Array<{
    key: string;
    header: string;
  }>;
  optionRows: Array<OptionRowType>;
}

const PurchaseOption = () => {
  const theme = useTheme();
  const { register, unregister, getValues } = useFormContext();
  const productRegistrationInputs = useWatch<ProductRegistrationFormValues>();

  const [optionInputList, setOptionInputList] = useState<
    Array<OptionInputType>
  >([
    {
      id: uuidv4(),
    },
  ]);

  const [adaptedOption, setAdaptedOption] = useState<AdaptedOptionType>({
    optionHeaders: [],
    optionRows: [],
  });

  const handleRemoveOptionIconClick = (optionKey: string) => {
    setOptionInputList((prev) => {
      const filteredList = prev.filter((option) => {
        return option.id !== optionKey.toString();
      });

      return [...filteredList];
    });

    unregister(`optionName-${optionKey}`);
    unregister(`optionValue-${optionKey}`);
  };

  const handleAddOptionInputButtonClick = () => {
    setOptionInputList((prev) => [
      ...prev,
      {
        id: uuidv4(),
      },
    ]);
  };

  const handleAdaptButtonClick = () => {
    const optionHeaders = optionInputList.map(({ id }) => {
      return {
        key: uuidv4(),
        header: productRegistrationInputs[`optionName-${id}`] as string,
      };
    });

    const optionValues = optionInputList.map(
      ({ id }: OptionInputType): Array<string> => {
        const optionValue = productRegistrationInputs[
          `optionValue-${id}`
        ] as string;

        return optionValue.split(",").map((value) => value.trim());
      }
    );

    const optionRows = optionValues.reduce(
      (prevPermutations: Array<Array<string>>, optionValue: Array<string>) => {
        const permutation = optionValue.reduce(
          (acc: Array<Array<string>>, value: string) => {
            prevPermutations.forEach((permutation: Array<string>) => {
              acc.push([...permutation, value]);
            });

            return acc;
          },
          []
        );

        return permutation;
      },
      [[]]
    );

    setAdaptedOption({
      optionHeaders,
      optionRows: optionRows.map((optionRow) => ({
        id: uuidv4(),
        option: optionRow,
        optionPrice: 0,
        optionStock: 0,
      })),
    });
  };

  return (
    <Container>
      <CheckboxContainer>
        <PurchaseOptionCheckbox {...register("hasOption")} /> 옵션 설정하기
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
        <tbody>
          {optionInputList.map(({ id }, index) => {
            const isLastOptionInput = optionInputList.length === index + 1;

            const hasEnabled: boolean = getValues("hasOption") as boolean;

            return (
              <OptionInputRow
                key={id}
                optionId={id}
                isOnly={optionInputList.length <= 1}
                isLast={isLastOptionInput}
                handleAddOptionInputButtonClick={
                  handleAddOptionInputButtonClick
                }
                handleRemoveOptionIconClick={handleRemoveOptionIconClick}
                disabled={!hasEnabled}
              />
            );
          })}
        </tbody>
      </OptionInputTable>

      <AdaptButton
        size="small"
        color={theme.palette.white}
        backgroundColor={theme.palette.grey700}
        onClick={handleAdaptButtonClick}
      >
        적용
        <img src={smallDownwardArrowIconSrc} width={14} />
      </AdaptButton>

      <AdaptedOptionTable adaptedOption={adaptedOption} />
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
  const [mappedFieldNames, setMappedFieldNames] = useState<
    Array<{
      key: string;
      name: string;
    }>
  >([]);

  useEffect(() => {
    setMappedFieldNames(
      fieldNames.map((name) => ({
        key: uuidv4(),
        name,
      }))
    );
  }, []);

  return (
    <thead>
      <TableHeaderContainer>
        {mappedFieldNames.map(({ key, name }) => {
          return (
            <TableHeader
              key={key}
              textAlign={name === "필수" ? "center" : "left"}
            >
              {name}
            </TableHeader>
          );
        })}
      </TableHeaderContainer>
    </thead>
  );
};

interface OptionInputRowProps {
  optionId: string;
  disabled?: boolean;
  isOnly: boolean;
  isLast?: boolean;
  handleRemoveOptionIconClick: (optionId: string) => void;
  handleAddOptionInputButtonClick: () => void;
}

const OptionInputRow = ({
  optionId,
  disabled = false,
  isOnly,
  isLast,
  handleRemoveOptionIconClick,
  handleAddOptionInputButtonClick,
}: OptionInputRowProps) => {
  const { register } = useFormContext();

  return (
    <TableRowContainer>
      <TableData>
        <OptionRequiredCheckbox disabled={disabled} />
      </TableData>
      <TableData>
        <OptionName
          disabled={disabled}
          register={register(`optionName-${optionId}`)}
        />
      </TableData>
      <TableData>
        <OptionValues
          width={"263px"}
          disabled={disabled}
          register={register(`optionValue-${optionId}`)}
        />
      </TableData>
      {!isOnly && (
        <TableData>
          <img
            src={removeOptionIconSrc}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault();

                return;
              }

              handleRemoveOptionIconClick(optionId);
            }}
          />
        </TableData>
      )}
      {isLast && (
        <TableData>
          <img
            src={addOptionInputIconSrc}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault();

                return;
              }

              handleAddOptionInputButtonClick();
            }}
          />
        </TableData>
      )}
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

  & > img {
    margin-right: 4px;
    cursor: pointer;
  }
`;

const OptionRequiredCheckbox = styled(Checkbox)``;

const OptionName = styled(TextInput)``;

const OptionValues = styled(TextInput)``;

const AdaptButton = styled(Button).attrs({ type: "button" })`
  margin: 0 auto;
`;

const AdaptedOptionTable = ({
  adaptedOption,
}: {
  adaptedOption: AdaptedOptionType;
}) => {
  return (
    <AdaptedOptionTableContainer>
      {/* tr */}
      <tbody>
        <AdaptedOptionTableHeaderRow>
          {/* th */}
          <AdaptedOptionTableHeader className={"headerContainer"} colSpan={2}>
            {/* tr */}
            <Table>
              <tbody>
                <AdaptedOptionTableHeaderRow>
                  <AdaptedOptionTableHeader colSpan={2}>
                    옵션명
                  </AdaptedOptionTableHeader>
                </AdaptedOptionTableHeaderRow>

                {adaptedOption.optionHeaders.length ? (
                  // tr
                  <AdaptedOptionTableHeaderRow>
                    {adaptedOption.optionHeaders.map(({ key, header }) => (
                      <AdaptedOptionTableHeader key={key}>
                        {header}
                      </AdaptedOptionTableHeader>
                    ))}
                  </AdaptedOptionTableHeaderRow>
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
          </AdaptedOptionTableHeader>

          <AdaptedOptionTableHeader>옵션가</AdaptedOptionTableHeader>

          <AdaptedOptionTableHeader>재고</AdaptedOptionTableHeader>
        </AdaptedOptionTableHeaderRow>

        {adaptedOption.optionRows.map(
          ({ id, option, optionPrice, optionStock }: OptionRowType) => {
            return (
              <AdaptedOptionTableRow key={id}>
                {option.map((el, index) => (
                  <AdaptedOptionTableData key={`${el}-${index}`}>
                    {el}
                  </AdaptedOptionTableData>
                ))}
                <AdaptedOptionTableData>{optionPrice}</AdaptedOptionTableData>
                <AdaptedOptionTableData>{optionStock}</AdaptedOptionTableData>
              </AdaptedOptionTableRow>
            );
          }
        )}
      </tbody>
    </AdaptedOptionTableContainer>
  );
};

const Table = styled.table`
  width: 100%;
`;

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
