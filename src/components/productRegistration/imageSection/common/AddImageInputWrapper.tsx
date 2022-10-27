import styled from "styled-components";
import addImageButtonBackgroundSource from "@images/add-photo-background.png";

const AddImageInputWrapper = styled.label<{
  backgroundImage?: string;
}>`
  width: 140px;
  height: 140px;

  background-image: url(${addImageButtonBackgroundSource});
  background-position: center;
  background-size: cover;

  position: absolute;
  top: 0;
  left: 0;

  cursor: pointer;
`;

export default AddImageInputWrapper;
