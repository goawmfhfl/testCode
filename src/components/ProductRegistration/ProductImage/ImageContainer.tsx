import styled from "styled-components";

import changeImageIconSrc from "@icons/changeImage.svg";
import removeImageIconSrc from "@icons/removeImage.svg";

interface ImageContainerProps {
  imageSource: string;
  thumbnail?: boolean;
  hasController?: boolean;
}

const ImageContainer = ({
  imageSource,
  thumbnail,
  hasController = true,
}: ImageContainerProps) => {
  return (
    <Container backgroundImageSource={imageSource}>
      {thumbnail && <ThumbnailTag>썸네일</ThumbnailTag>}
      {hasController && (
        <>
          <RemoveImageButton src={removeImageIconSrc} />
          <ChangeImageButton src={changeImageIconSrc} />
        </>
      )}
    </Container>
  );
};

const Container = styled.div<{ backgroundImageSource: string }>`
  width: 140px;
  height: 140px;
  background-color: ${({ theme: { palette } }) => palette.grey300};
  background-image: ${({ backgroundImageSource }) =>
    backgroundImageSource ? `url(${backgroundImageSource})` : ""};
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  margin-right: 8px;

  position: relative;
`;

const ThumbnailTag = styled.span`
  padding: 8px 10px;
  background-color: ${({ theme: { palette } }) => palette.grey700};
  color: ${({ theme: { palette } }) => palette.white};
  border-radius: 7px;

  font-size: 12px;
  font-family: "SpoqaHanSansNeo";
  font-weight: 300;

  position: absolute;
  top: 8px;
  left: 8px;

  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  cursor: pointer;
`;

const ChangeImageButton = styled(Icon)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const RemoveImageButton = styled(Icon)`
  position: absolute;
  right: 0;
  top: 0;
`;

export default ImageContainer;
