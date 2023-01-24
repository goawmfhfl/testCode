import React from "react";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import ProductImageContainer from "@components/productForm/imageSection/common/ProductImageContainer";
import ProductImage from "@components/productForm/imageSection/common/ProductImage";
import AddImageInputWrapper from "@components/productForm/imageSection/common/AddImageInputWrapper";
import AddImageInput from "@components/productForm/imageSection/common/AddImageInput";

import {
  convertFileToBase64,
  validateImageDimensionRatio,
  validateImageSize,
} from "@utils/index";
import { requiredImagesVar } from "@cache/productForm/productImages";
import { systemModalVar } from "@cache/index";

const RequiredImages = () => {
  const requiredImages = useReactiveVar(requiredImagesVar);

  const [thumbnailImage, ...requiredImagesExceptThumbnail] = requiredImages;

  const handleImageInputChange =
    (id: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const file = e.target.files[0];

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

      const url = await convertFileToBase64(file);

      const imageIndex = requiredImages.findIndex((image) => image.id === id);

      const newRequiredImages = [...requiredImagesVar()];
      newRequiredImages[imageIndex] = {
        ...newRequiredImages[imageIndex],
        file,
        filename: file.name,
        url,
      };
      requiredImagesVar(newRequiredImages);
    };

  const handleRemoveButtonClick = (id: string) => () => {
    const imageIndex = requiredImages.findIndex((image) => image.id === id);

    const newRequiredImages = [...requiredImagesVar()];

    newRequiredImages[imageIndex] = {
      ...newRequiredImages[imageIndex],
      filename: "",
      url: "",
    };

    requiredImagesVar(newRequiredImages);
  };

  return (
    <Container>
      <ThumbnailImageContainer>
        <ThumbnailImageHeader>썸네일</ThumbnailImageHeader>
        <ProductImageContainer key={`thumbnail-${thumbnailImage.id}`}>
          {thumbnailImage.url ? (
            <ProductImage
              imageSource={thumbnailImage.url}
              // eslint-disable-next-line
              handleRemoveButtonClick={handleRemoveButtonClick(
                thumbnailImage.id
              )}
              // eslint-disable-next-line
              handleImageInputChange={handleImageInputChange(thumbnailImage.id)}
            />
          ) : (
            <AddImageInputWrapper>
              <AddImageInput
                id={thumbnailImage.id}
                // eslint-disable-next-line
                onChange={handleImageInputChange(thumbnailImage.id)}
              />
            </AddImageInputWrapper>
          )}
        </ProductImageContainer>
      </ThumbnailImageContainer>

      <RequiredImageContainer>
        <RequiredImageHeader>필수 첨부 이미지</RequiredImageHeader>
        <RequiredImageList>
          {requiredImagesExceptThumbnail.map(({ id, url }) => {
            return (
              <ProductImageContainer key={`requiredImage-${id}`}>
                {url ? (
                  <ProductImage
                    imageSource={url}
                    // eslint-disable-next-line
                    handleRemoveButtonClick={handleRemoveButtonClick(id)}
                    // eslint-disable-next-line
                    handleImageInputChange={handleImageInputChange(id)}
                  />
                ) : (
                  <AddImageInputWrapper>
                    {/* eslint-disable-next-line */}
                    <AddImageInput
                      id={id}
                      // eslint-disable-next-line
                      onChange={handleImageInputChange(id)}
                    />
                  </AddImageInputWrapper>
                )}
              </ProductImageContainer>
            );
          })}
        </RequiredImageList>
      </RequiredImageContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background-color: ${({ theme: { palette } }) => palette.grey100};
  margin-top: 16px;
  padding: 8px;

  width: 756px;
`;

const ThumbnailImageContainer = styled.div`
  margin-right: 16px;
`;
const ThumbnailImageHeader = styled.div`
  margin-bottom: 4px;
`;
const RequiredImageHeader = styled.div`
  margin-bottom: 4px;
`;

const RequiredImageContainer = styled.div``;

const RequiredImageList = styled.div`
  display: flex;

  & > div {
    margin-right: 8px;
  }
`;

export default RequiredImages;
