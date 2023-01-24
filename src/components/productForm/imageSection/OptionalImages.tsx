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
  convertFileToBase64,
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

      const imageIndex = optionalImages.findIndex((image) => image.id === id);

      const newOptionalImages = [...optionalImagesVar()];

      newOptionalImages[imageIndex] = {
        ...newOptionalImages[imageIndex],
        file,
        filename: file.name,
        url,
      };

      optionalImagesVar(newOptionalImages);
    };

  const handleRemoveButtonClick = (id: string) => () => {
    const imageIndex = optionalImages.findIndex((image) => image.id === id);

    const newOptionalImages = [...optionalImagesVar()];

    newOptionalImages[imageIndex] = {
      ...newOptionalImages[imageIndex],
      filename: "",
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
        filename: "",
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
        {optionalImages.map(({ id, url }, index) => {
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
                  handleRemoveButtonClick={handleRemoveButtonClick(id)}
                  // eslint-disable-next-line
                  handleImageInputChange={handleImageInputChange(id)}
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
