import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";

import ProductImageContainer from "@components/productForm/imageSection/common/ProductImageContainer";
import ProductImage from "@components/productForm/imageSection/common/ProductImage";
import AddImageInputWrapper from "@components/productForm/imageSection/common/AddImageInputWrapper";
import AddImageInput from "@components/productForm/imageSection/common/AddImageInput";

import {
  addImageOnServer,
  removeImageFromServer,
  RemoveImageErrorType,
  validateImageDimensionRatio,
  validateImageSize,
  encodeLastComponent,
} from "@utils/index";

import { ProductImageType } from "@models/product/productImages";

import { systemModalVar } from "@cache/index";
import { useReactiveVar } from "@apollo/client";
import { requiredImagesVar } from "@cache/productForm/productImages";

const RequiredImages = () => {
  const requiredImages = useReactiveVar(requiredImagesVar);

  const { register, setValue, watch } = useFormContext();

  const previousProductImageValuesRef = useRef<Array<FileList> | null>(null);

  const productImageValues: Array<FileList> | Array<null> = watch(
    requiredImages.map(({ id }) => id)
  );

  useEffect(() => {
    if (!previousProductImageValuesRef.current) {
      previousProductImageValuesRef.current = productImageValues;

      return;
    }

    /*

      새로운 사진이 추가되거나 기존 사진이 변경되었을 때,
      변경된 이미지 데이터만을 확인하여 서버에 새롭게 등록하고 (+ 기존 이미지는 서버에서 삭제)
      등록된 url을 컴포넌트 내부의 상태(requiredImages)에 반영하여
      등록된 이미지가 새롭게 렌더링 될 수 있도록 합니다.

    */

    productImageValues.map(
      async (productImageValue: FileList, index: number) => {
        if (!productImageValue?.length) return;

        try {
          const previousImageValue: FileList | null =
            previousProductImageValuesRef.current[index];
          const hasImageChanged: boolean =
            productImageValue !== previousImageValue &&
            Boolean(productImageValue[0]);

          if (!hasImageChanged) {
            return;
          }

          const isImageRatioFulfilled = await validateImageDimensionRatio(
            productImageValue[0],
            { width: 1, height: 1 }
          );

          if (!isImageRatioFulfilled) {
            systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: <>등록 가능한 이미지 비율은 1:1 입니다.</>,
            });

            return;
          }

          if (!validateImageSize(productImageValue[0], 2 * 1000 * 1000)) {
            systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: <>등록 가능한 파일 크기는 2MB 입니다.</>,
            });

            return;
          }

          if (requiredImages[index].url) {
            const removeImageResult: {
              result: string;
              error: RemoveImageErrorType;
            } = await removeImageFromServer(requiredImages[index].url);

            if (removeImageResult.error) {
              console.log(removeImageResult.error);
            }
          }

          const { url: addedImageUrl }: { url: string } =
            await addImageOnServer(productImageValue[0]);

          const newRequiredImages = [...requiredImagesVar()];
          newRequiredImages[index].url = addedImageUrl;

          requiredImagesVar(newRequiredImages);
        } catch (error) {
          console.log(error);
        }
      }
    );

    previousProductImageValuesRef.current = productImageValues;
  }, [productImageValues]);

  const handleProductImageRemoveButtonClick = async (targetId: string) => {
    const productImage: ProductImageType = requiredImages.find(
      (image) => image.id === targetId
    );

    // 1. 로컬 상태에서 해당 이미지 url을 삭제한다
    const newRequiredImages = [...requiredImagesVar()].map((image) => {
      if (image.id === targetId) {
        return {
          ...image,
          url: "",
        };
      }

      return image;
    });

    requiredImagesVar(newRequiredImages);

    // 2. react hook form에서 인풋 데이터를 빈 File 객체로 바꿔준다
    const dataTransfer = new DataTransfer();

    setValue(targetId, dataTransfer.files);

    // 3. 서버에 요청을 보내 해당 이미지 데이터를 삭제한다
    const removeImageResult: {
      result: string;
      error: RemoveImageErrorType;
    } = await removeImageFromServer(productImage.url);

    if (removeImageResult.error) {
      console.log(removeImageResult.error);
    }
  };

  const [thumbnailImage, ...requiredImagesExceptThumbnail] = requiredImages;

  return (
    <Container>
      <ThumbnailImageContainer>
        <ThumbnailImageHeader>썸네일</ThumbnailImageHeader>
        <ProductImageContainer key={thumbnailImage.id}>
          {thumbnailImage.url ? (
            <ProductImage
              id={thumbnailImage.id}
              imageSource={encodeLastComponent(thumbnailImage.url)}
              handleRemoveButtonClick={() => {
                // eslint-disable-next-line
                (async () => {
                  await handleProductImageRemoveButtonClick(thumbnailImage.id);
                })();
              }}
            />
          ) : (
            <AddImageInputWrapper>
              <AddImageInput
                id={thumbnailImage.id}
                {...register(thumbnailImage.id)}
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
              <ProductImageContainer key={id}>
                {url ? (
                  <ProductImage
                    id={id}
                    imageSource={encodeLastComponent(url)}
                    handleRemoveButtonClick={() => {
                      // eslint-disable-next-line
                      (async () => {
                        await handleProductImageRemoveButtonClick(id);
                      })();
                    }}
                  />
                ) : (
                  <AddImageInputWrapper>
                    <AddImageInput id={id} {...register(id)} />
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
