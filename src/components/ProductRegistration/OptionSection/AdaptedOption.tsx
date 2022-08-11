import styled from "styled-components/macro";
import { useState } from "react";
import { ReactiveVar, useReactiveVar } from "@apollo/client";
import { useFormContext } from "react-hook-form";

import { OptionRowType, OptionType, OptionTypes } from "@models/options";
import {
  requiredOptionVar,
  selectiveOptionVar,
} from "@cache/productRegistration/options";
import { isNumber } from "@utils/index";

const AdaptedOption = ({ optionType }: { optionType: OptionTypes }) => {
  const optionVar: ReactiveVar<OptionType> =
    optionType === OptionTypes.Required
      ? requiredOptionVar
      : selectiveOptionVar;
  const { adaptedOption } = useReactiveVar(optionVar);
  const { register, setValue, getValues } = useFormContext();
  const [lastRowRef, setLastRowRef] = useState<HTMLElement | null>(null);

  return (
    <AdaptedOptionTableContainer
      hasManyColumns={adaptedOption.optionHeaders.length > 3}
    >
      {/* tr */}
      <tbody>
        <AdaptedOptionTableHeaderRow className="header--sticky-top">
          {/* th */}
          <AdaptedOptionTableHeader
            className={"header--container"}
            colSpan={
              adaptedOption.optionHeaders.length < 2
                ? 2
                : adaptedOption.optionHeaders.length
            }
          >
            {/* tr */}
            <Table>
              <tbody>
                <AdaptedOptionTableHeaderRow>
                  {optionType === OptionTypes.Required && (
                    <AdaptedOptionTableHeader>옵션명</AdaptedOptionTableHeader>
                  )}

                  {!adaptedOption.optionHeaders.length &&
                    optionType === OptionTypes.Selective && (
                      <>
                        <AdaptedOptionTableHeader>
                          추가 옵션명
                        </AdaptedOptionTableHeader>
                        <AdaptedOptionTableHeader>
                          추가 옵션값
                        </AdaptedOptionTableHeader>
                      </>
                    )}
                </AdaptedOptionTableHeaderRow>

                {adaptedOption.optionHeaders.length ? (
                  // tr
                  <AdaptedOptionTableHeaderRow>
                    {adaptedOption.optionHeaders.map(
                      ({ key, header }, headerIndex) => {
                        const optionValueCell = lastRowRef?.children[
                          headerIndex
                        ] as HTMLElement | null;

                        const width = optionValueCell?.offsetWidth;

                        return (
                          <AdaptedOptionTableHeader
                            key={key}
                            width={width ? `${width}px` : ""}
                          >
                            {header}
                          </AdaptedOptionTableHeader>
                        );
                      }
                    )}
                  </AdaptedOptionTableHeaderRow>
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
          </AdaptedOptionTableHeader>

          <AdaptedOptionTableHeader className={"header--top-end header--price"}>
            옵션가
          </AdaptedOptionTableHeader>

          <AdaptedOptionTableHeader className={"header--top-end header--stock"}>
            재고
          </AdaptedOptionTableHeader>
        </AdaptedOptionTableHeaderRow>

        {adaptedOption.optionRows.length ? (
          adaptedOption.optionRows.map(
            ({ id, option }: OptionRowType, index, optionRows) => {
              const isLastRow = index + 1 === optionRows.length;

              return (
                <AdaptedOptionTableRow
                  key={id}
                  ref={isLastRow ? (ref) => setLastRowRef(ref) : null}
                >
                  {option.map((el, index) => (
                    <AdaptedOptionTableData
                      key={`${el}-${index}`}
                      colSpan={adaptedOption.optionHeaders.length === 1 ? 2 : 1}
                      className={isLastRow ? "cell--low-end" : ""}
                      width={`${100 / adaptedOption.optionHeaders.length}%`}
                    >
                      {el}
                    </AdaptedOptionTableData>
                  ))}

                  <AdaptedOptionTableData
                    className={isLastRow ? "cell--low-end" : ""}
                    width={"80px"}
                  >
                    <AdaptedOptionPriceInput
                      {...register(`optionPrice-${id}`, {
                        valueAsNumber: true,
                      })}
                      step="1000"
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const nativeEvent = e.nativeEvent as InputEvent;
                        const inputKey: string = nativeEvent.data;

                        const isValidInput =
                          isNumber(inputKey) ||
                          inputKey === undefined ||
                          inputKey === null ||
                          inputKey === "+" ||
                          inputKey === "-" ||
                          inputKey === "shift";

                        if (!isValidInput) {
                          const previousValue = getValues(
                            `optionPrice-${id}`
                          ) as string;

                          setValue(`optionPrice-${id}`, previousValue);
                        }
                      }}
                    />
                  </AdaptedOptionTableData>
                  <AdaptedOptionTableData
                    className={isLastRow ? "cell--low-end" : ""}
                    width={"64px"}
                  >
                    <AdaptedOptionStockInput
                      {...register(`optionStock-${id}`, {
                        valueAsNumber: true,
                      })}
                      step="10"
                      min="0"
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const nativeEvent = e.nativeEvent as InputEvent;
                        const inputKey: string = nativeEvent.data;

                        const isValidInput =
                          isNumber(inputKey) ||
                          inputKey === null ||
                          inputKey === undefined;

                        if (!isValidInput) {
                          const previousValue = getValues(
                            `optionStock-${id}`
                          ) as string;

                          setValue(`optionStock-${id}`, previousValue);
                        }
                      }}
                    />
                  </AdaptedOptionTableData>
                </AdaptedOptionTableRow>
              );
            }
          )
        ) : (
          <EmptyTableRow>
            <EmptyTableCell colSpan={4}>
              옵션명, 옵션값을 넣은 후<br />
              적용 버튼을 눌러주세요.
            </EmptyTableCell>
          </EmptyTableRow>
        )}
      </tbody>
    </AdaptedOptionTableContainer>
  );
};

const Table = styled.table`
  width: 100%;
`;

const AdaptedOptionTableContainer = styled.table<{ hasManyColumns: boolean }>`
  width: ${({ hasManyColumns }) => (hasManyColumns ? "892px" : "757px")};

  border-collapse: collapse;
`;

const AdaptedOptionTableHeaderRow = styled.tr`
  background-color: ${({ theme: { palette } }) => palette.grey400};

  &.header--sticky-top {
    position: sticky;
    top: 0;
  }
`;

const AdaptedOptionTableHeader = styled.th<{
  width?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
}>`
  width: ${({ width }) => (width ? width : "50%")};
  min-width: 100px;
  padding: 10px;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  border-collapse: collapse;
  vertical-align: middle;
  white-space: nowrap;

  &.header--container {
    padding: 0;
    border-top: 0px;

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

  &.header--top-end {
    border-top: 0px;
  }

  &.header--price {
    width: 80px;
  }

  &.header--stock {
    width: 64px;
  }
`;

const AdaptedOptionTableRow = styled.tr``;

const AdaptedOptionTableData = styled.td<{ width: string }>`
  width: ${({ width }) => width};
  padding: 10px;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  text-align: center;
  white-space: pre-wrap;
  vertical-align: middle;

  &.cell--low-end {
    border-bottom: 0px;
  }
`;

const NumberInput = styled.input.attrs({
  type: "number",
})`
  text-align: center;
`;

const AdaptedOptionPriceInput = styled(NumberInput)`
  ime-mode: disabled;
`;

const AdaptedOptionStockInput = styled(NumberInput)``;

const EmptyTableRow = styled.tr`
  color: ${({ theme: { palette } }) => palette.grey500};
  font-family: Spoqa Han Sans Neo;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;

  vertical-align: middle;
  text-align: center;
`;

const EmptyTableCell = styled.td`
  height: 192px;
  vertical-align: middle;

  border-left: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

export default AdaptedOption;
