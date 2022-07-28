import styled from "styled-components/macro";

import changeImageIconSrc from "@icons/changeImage.svg";
import removeImageIconSrc from "@icons/removeImage.svg";
import { useFormContext } from "react-hook-form";

interface ProductImageProps {
  id: string;
  imageSource: string;
  thumbnail?: boolean;
  handleRemoveButtonClick?: () => void;
}

const ProductImage = ({
  id,
  imageSource,
  thumbnail,
  handleRemoveButtonClick,
}: ProductImageProps) => {
  const { register } = useFormContext();

  return (
    <Container backgroundImageSource={imageSource}>
      {thumbnail && <ThumbnailTag>썸네일</ThumbnailTag>}
      <RemoveImageButton
        src={removeImageIconSrc}
        onClick={handleRemoveButtonClick}
      />
      <ChangeImageButtonWrapper backgroundImageSource={changeImageIconSrc}>
        <ChangeImageButton id={id} {...register(id)} />
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
    backgroundImageSource ? `url(${encodeURI(backgroundImageSource)})` : ""};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  margin-right: 8px;

  position: relative;
`;

const ThumbnailTag = styled.span`
  padding: 8px 10px;
  background-color: ${({ theme: { palette } }) => palette.grey700};
  color: ${({ theme: { palette } }) => palette.white};
  border-radius: 7px;

  font-size: 12px;
  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;

  position: absolute;
  top: 8px;
  left: 8px;

  display: flex;
  align-items: center;
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

const ChangeImageButton = styled.input.attrs({ type: "file" })`
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
