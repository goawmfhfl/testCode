import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import ProductImageContainer from "@components/productForm/imageSection/common/ProductImageContainer";
import ProductImage from "@components/productForm/imageSection/common/ProductImage";
import AddImageInputWrapper from "@components/productForm/imageSection/common/AddImageInputWrapper";
import AddImageInput from "@components/productForm/imageSection/common/AddImageInput";

import { optionalImagesVar } from "@cache/productForm/productImages";
import { systemModalVar } from "@cache/index";
import {
  addImageOnServer,
  removeImageFromServer,
  validateImageDimensionRatio,
  validateImageSize,
} from "@utils/index";
import { ProductImageType } from "@models/product/productImages";
import { UploadFileType } from "@models/index";

const ProductImageSection = () => {
  const optionalImages = useReactiveVar(optionalImagesVar);

  const handleImageInputChange =
    (id: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const file = e.target.files[0];

      console.log(file);

      const isImageRatioFulfilled = await validateImageDimensionRatio(file, {
        width: 1,
        height: 1,
      });

      if (!isImageRatioFulfilled) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: <>등록 가능한 이미지 비율은 1:1 입니다.</>,
        });

        return;
      }

      if (!validateImageSize(file, 2 * 1000 * 1000)) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: <>등록 가능한 파일 크기는 2MB 입니다.</>,
        });

        return;
      }

      const { url } = await addImageOnServer(file);

      const imageIndex = optionalImages.findIndex((image) => image.id === id);

      if (optionalImages[imageIndex].url) {
        const result = await removeImageFromServer(
          optionalImages[imageIndex].url
        );

        console.log("이미 있던 사진 삭제결과", result);
      }

      const newOptionalImages = [...optionalImagesVar()];

      newOptionalImages[imageIndex] = {
        ...newOptionalImages[imageIndex],
        url,
      };

      optionalImagesVar(newOptionalImages);
    };

  const handleRemoveButtonClick = (url: string) => async () => {
    const result = await removeImageFromServer(url);

    console.log("삭제 결과", result);

    const imageIndex = optionalImages.findIndex((image) => image.url === url);

    const newOptionalImages = [...optionalImagesVar()];

    newOptionalImages[imageIndex] = {
      ...newOptionalImages[imageIndex],
      url: "",
    };

    optionalImagesVar(newOptionalImages);
  };

  useEffect(() => {
    const hasAllImagesUploaded: boolean = optionalImages.reduce(
      (isUploaded: boolean, productImage: ProductImageType) =>
        isUploaded && Boolean(productImage.url),
      true
    );

    if (!hasAllImagesUploaded) return;
    if (optionalImages.length >= 5) return;

    const newOptionalImages = [...optionalImagesVar()];

    if (optionalImages.length < 5) {
      newOptionalImages.push({
        id: uuidv4(),
        url: "",
        type: UploadFileType.PRODUCT_OPTIONAL,
      });
    }

    optionalImagesVar(newOptionalImages);
  }, [optionalImages]);

  return (
    <Container>
      <OptionalImageHeader>추가 이미지</OptionalImageHeader>

      <OptionalImageList>
        {optionalImages.map(({ id, url }, index, arr) => {
          const isFirstRow = index < 5;
          const isRightEnd = (index + 1) % 5 === 0;

          return (
            <OptionalImageContainer
              key={id}
              isFirstRow={isFirstRow}
              isRightEnd={isRightEnd}
            >
              {url ? (
                <ProductImage
                  imageSource={url}
                  // eslint-disable-next-line
                  handleRemoveButtonClick={handleRemoveButtonClick(url)}
                  // eslint-disable-next-line
                  onChange={handleImageInputChange(id)}
                />
              ) : (
                <AddImageInputWrapper>
                  <AddImageInput
                    id={id}
                    // eslint-disable-next-line
                    onChange={handleImageInputChange(id)}
                  />
                </AddImageInputWrapper>
              )}
            </OptionalImageContainer>
          );
        })}
      </OptionalImageList>
    </Container>
  );
};

const Container = styled.div`
  width: 756px;
  margin-top: 16px;
  padding: 8px;

  background-color: ${({ theme: { palette } }) => palette.grey100}; ;
`;

const OptionalImageHeader = styled.div`
  margin-bottom: 4px;
`;

const OptionalImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const OptionalImageContainer = styled(ProductImageContainer)<{
  isFirstRow?: boolean;
  isRightEnd?: boolean;
}>`
  margin-right: ${({ isRightEnd }) => (isRightEnd ? "" : "10px")};
  margin-top: ${({ isFirstRow }) => (isFirstRow ? "" : "12px")};
`;

export default ProductImageSection;
