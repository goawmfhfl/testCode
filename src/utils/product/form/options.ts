import { v4 as uuidv4 } from "uuid";
import { OptionCombination } from "@models/product";
import { OptionType } from "@models/product/options";

export function restructureOptions(
  options: Array<OptionCombination>
): OptionType {
  const optionInputList = options[0].components.map((_) => ({
    id: uuidv4(),
  }));

  const adaptedOption = options.reduce(
    (result, option) => {
      const headers = option.components.map(({ name }) => {
        return {
          id: uuidv4(),
          header: name,
        };
      });

      const values = option.components.map(({ value }) => {
        return value;
      });

      result.optionHeaders = headers;
      result.optionRows.push({
        id: uuidv4(),
        option: values,
        price: option.price,
        stock: option.quantity,
      });

      return result;
    },
    {
      optionHeaders: [],
      optionRows: [],
    }
  );

  return {
    optionInputList,
    adaptedOption,
  };
}

export function restructureSelectiveOptions(
  options: Array<OptionCombination>
): OptionType {
  const optionInputList = options.reduce(
    (optionInputList, option) => {
      const optionName = option.components[0].name;
      const optionValue = option.components[0].value;

      if (!optionInputList[optionName]) {
        optionInputList[optionName] = {
          id: uuidv4(),
          optionName,
          optionValue: [],
        };
      }

      optionInputList[optionName].optionValue.push(optionValue);

      return optionInputList;
    },
    {} as Record<
      string,
      {
        id: string;
        optionName: string;
        optionValue: Array<string>;
      }
    >
  );

  const adaptedOption = options.reduce(
    (result, option) => {
      const headers = [
        {
          id: uuidv4(),
          header: "선택옵션명",
        },
        {
          id: uuidv4(),
          header: "선택옵션값",
        },
      ];

      const { name, value } = option.components[0];

      result.optionHeaders = headers;
      result.optionRows.push({
        id: uuidv4(),
        option: [name, value],
        price: option.price,
        stock: option.quantity,
      });

      return result;
    },
    {
      optionHeaders: [],
      optionRows: [],
    }
  );

  return {
    optionInputList: Object.values(optionInputList).map((optionInput) => ({
      ...optionInput,
      optionValue: optionInput.optionValue.join(", "),
    })),
    adaptedOption,
  };
}
