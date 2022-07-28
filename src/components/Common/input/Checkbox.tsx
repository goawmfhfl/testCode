import styled from "styled-components/macro";

const Checkbox = styled.input.attrs({ type: "checkbox", tabIndex: -1 })`
  width: 16px;
  height: 16px;
`;

export default Checkbox;
