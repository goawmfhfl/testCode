import styled from "styled-components/macro";

import changeImageIconSrc from "@icons/changeImage.svg";
import removeImageIconSrc from "@icons/removeImage.svg";

interface ProductImageProps {
  imageSource: string;
  handleRemoveButtonClick?: () => void;
  handleImageInputChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

const ProductImage = ({
  imageSource,
  handleRemoveButtonClick,
  handleImageInputChange,
}: ProductImageProps) => {
  return (
    <Container backgroundImageSource={imageSource}>
      <RemoveImageButton
        src={removeImageIconSrc}
        onClick={handleRemoveButtonClick}
      />

      <ChangeImageButtonWrapper backgroundImageSource={changeImageIconSrc}>
        {/* eslint-disable-next-line */}
        <ChangeImageButton onChange={handleImageInputChange} />
      </ChangeImageButtonWrapper>
    </Container>
  );
};

const Container = styled.div<{
  backgroundImageSource: string;
}>`
  width: 140px;
  height: 140px;
  background-color: ${({ theme: { palette } }) => palette.grey300};
  background-image: ${({ backgroundImageSource }) =>
    backgroundImageSource ? `url("${encodeURI(backgroundImageSource)}")` : ""};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  margin-right: 8px;

  position: relative;
`;

const ChangeImageButtonWrapper = styled.label<{
  backgroundImageSource: string;
}>`
  position: absolute;
  right: 0;
  bottom: 0;

  width: 24px;
  height: 24px;

  background-image: ${({ backgroundImageSource }) =>
    `url("${backgroundImageSource}")`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  cursor: pointer;
`;

const ChangeImageButton = styled.input.attrs({
  type: "file",
  accept: "image/jpg,image/png,image/jpeg",
})`
  display: none;
`;

const RemoveImageButton = styled.img`
  position: absolute;
  right: 0;
  top: 0;

  cursor: pointer;
  user-select: none;
`;

export default ProductImage;
