import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components/macro";
import { useFormContext, useWatch } from "react-hook-form";
import { useReactiveVar } from "@apollo/client";

import { ProductRegistrationFormValues } from "@pages/product/registration";
import NoticeContainer from "@components/common/NoticeContainer";
import Checkbox from "@components/common/input/Checkbox";
import Button from "@components/common/Button";
import OptionInput from "@components/ProductRegistration/OptionSection/OptionInput";
import AdaptedOption from "@components/ProductRegistration/OptionSection/AdaptedOption";

import { HAS_REQUIRED_OPTION } from "@cache/productRegistration/index";
import { requiredOptionVar } from "@cache/productRegistration/productOptions";
import {
  OptionInputType,
  OptionTypes,
} from "@models/productRegistration/options";
import { isElementOverflown } from "@utils/index";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import smallDownwardArrowIconSrc from "@icons/arrow-downward-small-red.svg";
import { tableScrollbarStyles } from "@styles/GlobalStyles";

const RequiredOption = () => {
  const theme = useTheme();
  const { register, getValues } = useFormContext();
  const productRegistrationInputs = useWatch<ProductRegistrationFormValues>();
  const { optionInputList, adaptedOption } = useReactiveVar(requiredOptionVar);

  const handleAdaptButtonClick = () => {
    if (!getValues(HAS_REQUIRED_OPTION)) return;

    const optionHeaders = optionInputList.map(({ id }) => {
      return {
        key: uuidv4(),
        header: productRegistrationInputs[`requiredOptionName-${id}`] as string,
      };
    });

    const optionValues = optionInputList.map(
      ({ id }: OptionInputType): Array<string> => {
        const optionValue = productRegistrationInputs[
          `requiredOptionValue-${id}`
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

    requiredOptionVar({
      ...requiredOptionVar(),
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
  const [isTableOverflown, setIsTableOverflown] = useState<boolean>(false);

  useEffect(() => {
    const isTableOverflown = isElementOverflown(tableRef) as boolean;

    setIsTableOverflown(isTableOverflown);
  }, [adaptedOption]);

  const hasOptionInputEnabled = getValues(HAS_REQUIRED_OPTION) as boolean;

  return (
    <Container>
      <CheckboxContainer>
        <PurchaseOptionCheckbox {...register(HAS_REQUIRED_OPTION)} /> 옵션
        설정하기
      </CheckboxContainer>

      <NoticeContainer icon={exclamationMarkSrc}>
        <NoticeList>
          <li>
            필수 옵션은 구매자가 필수로 선택해야 하는 옵션입니다. ex) 핸드폰
            케이스의 기종 옵션
          </li>
          <li>옵션값은 쉼표로 구분해주세요.</li>
          <li>
            옵션명과 쉼표로 구분된 각각의 옵션값은 최대 25자(한글, 영문
            동일)까지 작성하실 수 있습니다.
          </li>
          <li>최대 추가 가능한 옵션은 5개 입니다.</li>
        </NoticeList>
      </NoticeContainer>

      <OptionInput
        optionType={OptionTypes.Required}
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
        hasManyColumns={adaptedOption.optionHeaders.length > 3}
      >
        <AdaptedOption optionType={OptionTypes.Required} />
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

const AdaptedTableWrapper = styled.div<{
  isOverflown: boolean | undefined;
  hasManyColumns: boolean;
}>`
  width: ${({ hasManyColumns, isOverflown }) =>
    hasManyColumns
      ? isOverflown
        ? "909px"
        : "892px"
      : isOverflown
      ? "774px"
      : "757px"};
  max-height: 300px;
  ${({ isOverflown }) =>
    isOverflown ? "overflow-y: scroll" : "overflow: hidden"};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  border-left: 0;

  margin-top: 16px;

  ${tableScrollbarStyles}
`;

export default RequiredOption;
