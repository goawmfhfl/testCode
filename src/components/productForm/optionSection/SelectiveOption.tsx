import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components/macro";
import { useFormContext, useWatch } from "react-hook-form";
import { useReactiveVar } from "@apollo/client";

import NoticeContainer from "@components/common/NoticeContainer";
import Checkbox from "@components/common/input/Checkbox";
import Button from "@components/common/Button";
import OptionInput from "@components/productForm/optionSection/OptionInput";
import AdaptedOption from "@components/productForm/optionSection/AdaptedOption";

import { selectiveOptionVar } from "@cache/productForm/productOptions";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import smallDownwardArrowIconSrc from "@icons/arrow-downward-small-red.svg";
import { HAS_SELECTIVE_OPTION } from "@cache/productForm";
import { OptionInputType, OptionTypes } from "@models/product/options";
import { ProductFormValues } from "@models/product";

const SelectiveOption = () => {
  const theme = useTheme();
  const { register, getValues } = useFormContext();
  const productRegistrationInputs = useWatch<ProductFormValues>();
  const { optionInputList, adaptedOption } = useReactiveVar(selectiveOptionVar);

  const handleAdaptButtonClick = () => {
    if (!getValues(HAS_SELECTIVE_OPTION)) return;

    const optionHeaders = ["선택 옵션명", "선택 옵션값"].map((header) => {
      return {
        id: uuidv4(),
        header,
      };
    });

    const optionValues = optionInputList.map(
      ({ id }: OptionInputType): Array<string> => {
        const optionValue = productRegistrationInputs[
          `selectiveOptionValue-${id}`
        ] as string;

        return optionValue
          ?.split(",")
          .map((value) => value.trim())
          .filter((value) => value);
      }
    );

    const hasEmptyOptionInputValue = !(
      optionHeaders.reduce((acc: boolean, cur) => {
        return acc && Boolean(cur.header);
      }, true) &&
      optionValues.reduce((acc: boolean, cur) => {
        return acc && Boolean(cur.length);
      }, true)
    );

    if (hasEmptyOptionInputValue) {
      // TODO: system modal로 변경하기
      alert("옵션명과 옵션값을 입력해주세요.");

      return;
    }

    const optionRows = optionValues.reduce(
      (acc: Array<Array<string>>, optionValueList, optionValueIndex) => {
        optionValueList.forEach((optionValue) => {
          const optionInputId = optionInputList[optionValueIndex].id;

          const header = getValues(
            `selectiveOptionName-${optionInputId}`
          ) as string;

          acc.push([header, optionValue]);
        });

        return acc;
      },
      []
    );

    selectiveOptionVar({
      ...selectiveOptionVar(),
      adaptedOption: {
        optionHeaders,
        optionRows: optionRows.map((optionRow) => ({
          id: uuidv4(),
          option: optionRow,
        })),
      },
    });
  };

  const [tableRef, setTableRef] = useState<HTMLDivElement | null>(null);
  const [isTableOverflown, setIsTableOverflown] = useState(false);

  useEffect(() => {
    setIsTableOverflown(isOverflown(tableRef));
  }, [adaptedOption]);

  function isOverflown(element: HTMLDivElement | null): undefined | boolean {
    if (!element) return;

    return element?.scrollHeight > element?.clientHeight;
  }

  const hasOptionInputEnabled = getValues(HAS_SELECTIVE_OPTION) as boolean;

  return (
    <Container>
      <CheckboxContainer>
        <PurchaseOptionCheckbox {...register(HAS_SELECTIVE_OPTION)} /> 선택 옵션
        설정하기
      </CheckboxContainer>

      <NoticeContainer icon={exclamationMarkSrc} width={"723px"}>
        <NoticeList>
          <li>
            선택 옵션 설정하기'를 체크하여 기본 상품과 함께 구매하면 좋은
            추가상품을 설정해보세요.
          </li>
        </NoticeList>
      </NoticeContainer>

      <OptionInput
        optionType={OptionTypes.Selective}
        hasEnabled={hasOptionInputEnabled}
      />

      <AdaptButton
        size="small"
        color={theme.palette.white}
        backgroundColor={theme.palette.grey700}
        onClick={handleAdaptButtonClick}
      >
        적용
        <img src={smallDownwardArrowIconSrc} width={14} />
      </AdaptButton>

      <AdaptedTableWrapper
        ref={(ref) => setTableRef(ref)}
        isOverflown={isTableOverflown}
      >
        <AdaptedOption optionType={OptionTypes.Selective} />
      </AdaptedTableWrapper>
    </Container>
  );
};

const Container = styled.div`
  font-family: "Spoqa Han Sans Neo";
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
  width: 100%;
  list-style: disc;
  margin-left: 15px;
  line-height: 18px;
`;

const AdaptButton = styled(Button).attrs({ type: "button" })`
  margin: 0 auto;
`;

const AdaptedTableWrapper = styled.div<{ isOverflown: boolean | undefined }>`
  width: ${({ isOverflown }) => (isOverflown ? "774px" : "757px")};
  max-height: 300px;
  ${({ isOverflown }) =>
    isOverflown ? "overflow-y: scroll" : "overflow: hidden"};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  border-left: 0;

  margin-top: 16px;

  &::-webkit-scrollbar {
    width: 14px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: none;
    background-color: ${({ theme: { palette } }) => palette.grey500};
  }

  &::-webkit-scrollbar-track {
    border-radius: none;
    -webkit-box-shadow: inset 0 0 2px
      ${({ theme: { palette } }) => palette.grey300};
  }
`;

export default SelectiveOption;
