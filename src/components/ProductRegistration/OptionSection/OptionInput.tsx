import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useReactiveVar } from "@apollo/client";

import TextInput from "@components/common/input/TextInput";
import removeOptionIconSrc from "@icons/remove-option.svg";
import addOptionInputIconSrc from "@icons/add-option-input.svg";
import { OptionTypes } from "@models/options";
import { requiredOptionVar, selectiveOptionVar } from "@cache/index";

const OptionInput = ({
  optionType,
  hasEnabled,
}: {
  optionType: OptionTypes;
  hasEnabled: boolean;
}) => {
  const optionVar =
    optionType === OptionTypes.Required
      ? requiredOptionVar
      : selectiveOptionVar;
  const { optionInputList } = useReactiveVar(optionVar);

  return (
    <OptionInputTable>
      <OptionInputHeader fieldNames={["옵션명", "옵션값"]} />
      <tbody>
        {optionInputList.map(({ id }, index) => {
          const isLastOptionInput = optionInputList.length === index + 1;

          const showAddButton =
            optionType === OptionTypes.Required
              ? isLastOptionInput && optionInputList.length < 5
              : isLastOptionInput && optionInputList.length < 10;

          return (
            <OptionInputRow
              key={id}
              optionId={id}
              optionType={optionType}
              showRemoveButton={optionInputList.length <= 1}
              showAddButton={showAddButton}
              disabled={!hasEnabled}
            />
          );
        })}
      </tbody>
    </OptionInputTable>
  );
};

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
          return <TableHeader key={key}>{name}</TableHeader>;
        })}
      </TableHeaderContainer>
    </thead>
  );
};

interface OptionInputRowProps {
  optionId: string;
  optionType: OptionTypes;
  disabled?: boolean;
  showRemoveButton: boolean;
  showAddButton?: boolean;
}

const OptionInputRow = ({
  optionId,
  optionType,
  disabled = false,
  showRemoveButton,
  showAddButton,
}: OptionInputRowProps) => {
  const optionVar =
    optionType === OptionTypes.Required
      ? requiredOptionVar
      : selectiveOptionVar;
  const { register, unregister, setValue } = useFormContext();

  const handleRemoveOptionIconClick = (optionKey: string) => {
    const { optionInputList } = optionVar();

    const filteredList = optionInputList.filter((option) => {
      return option.id !== optionKey.toString();
    });

    optionVar({
      ...optionVar(),
      optionInputList: [...filteredList],
    });

    unregister(
      optionType === OptionTypes.Required
        ? `requiredOptionName-${optionKey}`
        : `selectiveOptionName-${optionKey}`
    );
    unregister(
      optionType === OptionTypes.Required
        ? `requiredOptionValue-${optionKey}`
        : `selectiveOptionValue-${optionKey}`
    );
  };

  const handleAddOptionInputButtonClick = () => {
    const { optionInputList } = optionVar();

    optionVar({
      ...optionVar(),
      optionInputList: [
        ...optionInputList,
        {
          id: uuidv4(),
        },
      ],
    });
  };

  const previousOptionValueList = useRef<string>(null);

  return (
    <TableRowContainer>
      <TableData>
        <OptionName
          register={register(
            optionType === OptionTypes.Required
              ? `requiredOptionName-${optionId}`
              : `selectiveOptionName-${optionId}`
          )}
          disabled={disabled}
          maxLength={5}
        />
      </TableData>
      <TableData>
        <OptionValues
          width={"263px"}
          disabled={disabled}
          register={register(
            optionType === OptionTypes.Required
              ? `requiredOptionValue-${optionId}`
              : `selectiveOptionValue-${optionId}`,
            {
              onChange: (e: React.ChangeEvent) => {
                const target = e.target as HTMLInputElement;
                const currentOptionValueList: string = target.value;

                const hasInvalidOptionValue = currentOptionValueList
                  .split(",")
                  .map((el) => el.trim())
                  .reduce((acc, cur) => {
                    return cur.length > 5 || acc;
                  }, false);

                if (hasInvalidOptionValue) {
                  console.log("has invalid option value!");

                  setValue(
                    optionType === OptionTypes.Required
                      ? `requiredOptionValue-${optionId}`
                      : `selectiveOptionValue-${optionId}`,
                    previousOptionValueList.current
                  );
                }

                previousOptionValueList.current = target.value;
              },
            }
          )}
        />
      </TableData>
      {!showRemoveButton && (
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
      {showAddButton && (
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

const OptionInputTable = styled.table`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const TableHeaderContainer = styled.tr``;

const TableRowContainer = styled.tr``;

const TableHeader = styled.th`
  word-break: keep-all;
  padding: 4px 8px;

  text-align: left;
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

const OptionName = styled(TextInput)``;

const OptionValues = styled(TextInput)``;

export default OptionInput;
