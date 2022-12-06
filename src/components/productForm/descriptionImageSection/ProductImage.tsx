import styled from "styled-components/macro";

import changeImageIconSrc from "@icons/changeImage.svg";
import removeImageIconSrc from "@icons/removeImage.svg";
import { descriptionImagesVar } from "@cache/productForm/descriptionImages";
import deleteImageUrl from "@utils/shopSettings/deleteImageUrl";

interface ProductImageProps {
  src: string;
  handleChangeButtonClick: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

const ProductImage = ({ src, handleChangeButtonClick }: ProductImageProps) => {
  const handleRemoveImageButton =
    (url: string) => async (e: React.MouseEvent<HTMLElement>) => {
      descriptionImagesVar([
        ...descriptionImagesVar().filter((img) => img.url !== url),
      ]);

      await deleteImageUrl(url);
    };

  return (
    <Container backgroundSource={src}>
      {/* <ThumbnailTag>썸네일</ThumbnailTag> */}
      <RemoveImageButton
        src={removeImageIconSrc}
        // eslint-disable-next-line
        onClick={handleRemoveImageButton(src)}
      />
      <ChangeImageButtonWrapper backgroundSource={changeImageIconSrc}>
        {/* eslint-disable-next-line */}
        <ChangeImageButton onChange={handleChangeButtonClick} />
      </ChangeImageButtonWrapper>
    </Container>
  );
};

const Container = styled.div<{
  backgroundSource: string;
}>`
  width: 140px;
  height: 140px;
  background-color: ${({ theme: { palette } }) => palette.grey300};
  background-image: ${({ backgroundSource }) =>
    backgroundSource ? `url(${encodeURI(backgroundSource)})` : ""};
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
  backgroundSource: string;
}>`
  position: absolute;
  right: 0;
  bottom: 0;

  width: 24px;
  height: 24px;

  background-image: ${({ backgroundSource }) => `url("${backgroundSource}")`};
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
