import styled from "styled-components";

import NoticeContainer from "@components/common/NoticeContainer";
import ImageContainer from "@components/ProductRegistration/ProductImage/ImageContainer";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import addImageButtonImageSource from "@images/add-photo-background.png";
import bearProductImageSource from "@images/bear-product-image.jpeg";

const ProductImage = () => {
  return (
    <Container>
      <NoticeContainer icon={exclamationMarkSrc}>
        권장 이미지 크기 : 750 x 750 (px), 파일 크기 : 1장 당 2mb, 등록 가능
        파일 확장자 : jpg, jpeg, png <br /> 최대 10장 까지 등록 가능하며 첫
        번째로 등록된 사진이 썸네일로 지정됩니다.
      </NoticeContainer>

      <ImageList>
        <ImageContainer thumbnail={true} imageSource={bearProductImageSource} />
        <ImageContainer imageSource={bearProductImageSource} />
        <ImageContainer imageSource={bearProductImageSource} />
        <ImageContainer imageSource={bearProductImageSource} />

        <AddImageButton
          imageSource={addImageButtonImageSource}
          hasController={false}
        />
      </ImageList>
    </Container>
  );
};

const Container = styled.div``;

const ImageList = styled.div`
  display: flex;

  margin-top: 16px;
`;

const AddImageButton = styled(ImageContainer)``;

export default ProductImage;
