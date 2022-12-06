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
