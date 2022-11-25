import React from "react";
import styled from "styled-components";
import searchDefaultSvg from "@icons/search-default.svg";
import searchFocusSvg from "@icons/search-focus.svg";

interface SearchInputProps {
  value: string;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  width,
  onChange,
  placeholder,
}: SearchInputProps) => {
  return (
    <Input
      value={value}
      width={width}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export const Input = styled.input.attrs({ type: "text" })<{ width?: string }>`
  display: flex;
  align-items: center;

  padding: 4px 0px 4px 48px;
  width: ${({ width }) => (width ? "width" : "328px")};

  background-color: #fff;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  background-image: url(${searchDefaultSvg});
  background-repeat: no-repeat;
  background-position: left 12px bottom 50%;

  &:focus {
    border: 1px solid ${({ theme: { palette } }) => palette.grey700};
    background-image: url(${searchFocusSvg});
    background-repeat: no-repeat;
  }
`;

export default SearchInput;
