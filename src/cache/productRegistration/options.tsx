import { v4 as uuidv4 } from "uuid";
import { makeVar } from "@apollo/client";
import { OptionType } from "@models/options";

const requiredOptionInitialState: OptionType = {
  optionInputList: [{ id: uuidv4() }],
  adaptedOption: {
    optionHeaders: [],
    optionRows: [],
  },
};

const selectiveOptionInitialState: OptionType = {
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
