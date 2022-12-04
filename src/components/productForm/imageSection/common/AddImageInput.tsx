import styled from "styled-components/macro";

const AddImageInput = styled.input.attrs({
  type: "file",
  accept: "image/jpg,image/png,image/jpeg",
})`
  visibility: hidden;
`;

export default AddImageInput;
