export interface OptionInputType {
  id: string;
  disabled?: boolean;
}

export interface OptionHeaderType {
  key: string;
  header: string;
}

export interface OptionRowType {
  id: string;
  option: Array<string>;
}

interface AdaptedOptionType {
  optionHeaders: Array<OptionHeaderType>;
  optionRows: Array<OptionRowType>;
}

export interface OptionType {
  optionInputList: Array<OptionInputType>;
  adaptedOption: AdaptedOptionType;
}

export enum OptionTypes {
  Required = "required",
  Selective = "selective",
}