export interface OptionInputType {
  id: string;
  disabled?: boolean;
  optionName?: string;
  optionValue?: string;
}

export interface OptionHeaderType {
  id: string;
  header: string;
}

export interface OptionRowType {
  id: string;
  option: Array<string>;
  price?: number;
  stock?: number;
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
