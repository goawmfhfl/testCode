import styled from "styled-components";

import RequiredImages from "@components/ProductRegistration/ProductImageSection/RequiredImages";
import ExtraImages from "@components/ProductRegistration/ProductImageSection/ExtraImages";
import NoticeContainer from "@components/common/NoticeContainer";

import exclamationMarkSrc from "@icons/exclamationmark.svg";
import addImageButtonBackgroundSource from "@images/add-photo-background.png";

export interface ProductImageType {
  id: string;
  url: string | undefined;
  type: ImageType;
  isThumbnail?: boolean;
}

export enum ImageType {
  SQUARE = "SQUARE",
  RECTANGLE = "RECTANGLE",
}

const ProductImageSection = () => {
  return (
    <Container>
      <NoticeContainerWrapper>
        <NoticeContainer icon={exclamationMarkSrc}>
          권장 이미지 크기 : 750 x 750 (px), 파일 크기 : 1장 당 2mb, 등록 가능
          파일 확장자 : jpg, jpeg, png <br /> 최소 5장, 최대 10장 까지 등록
          가능하며 첫 번째로 등록된 사진이 썸네일로 지정됩니다.
        </NoticeContainer>
      </NoticeContainerWrapper>

      <RequiredImages />
      <ExtraImages />
    </Container>
  );
};

const Container = styled.div``;

const NoticeContainerWrapper = styled.div`
  width: 547px;
`;

export const ProductImageContainer = styled.div`
  width: 140px;
  height: 140px;

  margin-top: 4px;
  margin-right: 8px;
  margin-bottom: 8px;

  position: relative;
`;

export const AddImageInputWrapper = styled.label<{
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

export const AddImageInput = styled.input.attrs({
  type: "file",
  accept: "image/jpg,image/png,image/jpeg",
})`
  visibility: hidden;
`;

export default ProductImageSection;
