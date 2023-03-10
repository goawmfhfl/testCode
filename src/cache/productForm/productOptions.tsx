import { v4 as uuidv4 } from "uuid";
import { makeVar } from "@apollo/client";
import { OptionType } from "@models/product/options";

export const requiredOptionInitialState: OptionType = {
  optionInputList: [{ id: uuidv4() }],
  adaptedOption: {
    optionHeaders: [],
    optionRows: [],
  },
};

export const selectiveOptionInitialState: OptionType = {
  optionInputList: [{ id: uuidv4() }],
  adaptedOption: {
    optionHeaders: [],
    optionRows: [],
  },
};

export const requiredOptionVar = makeVar<OptionType>(
  requiredOptionInitialState
);

export const selectiveOptionVar = makeVar<OptionType>(
  selectiveOptionInitialState
);
