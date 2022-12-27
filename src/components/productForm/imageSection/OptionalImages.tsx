import { v4 as uuidv4 } from "uuid";
import styled from "styled-components/macro";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useReactiveVar } from "@apollo/client";

import ProductImageContainer from "@components/productForm/imageSection/common/ProductImageContainer";
import ProductImage from "@components/productForm/imageSection/common/ProductImage";
import AddImageInputWrapper from "@components/productForm/imageSection/common/AddImageInputWrapper";
import AddImageInput from "@components/productForm/imageSection/common/AddImageInput";

import { UploadFileType } from "@models/index";
import { ProductImageType } from "@models/product/productImages";

import { optionalImagesVar } from "@cache/productForm/productImages";
import {
  addImageOnServer,
  removeImageFromServer,
  RemoveImageErrorType,
  validateImageSize,
  validateImageDimensionRatio,
  encodeLastComponent,
} from "@utils/index";
import { systemModalVar } from "@cache/index";

const ProductImageSection = () => {
  const optionalImages = useReactiveVar(optionalImagesVar);

  const { register, unregister, watch } = useFormContext();

  const optionalImageValues: Array<FileList> | Array<null> = watch(
    optionalImages.map(({ id }) => id)
  );

  const previousProductImageValuesRef = useRef<Array<FileList> | null>(null);

  useEffect(() => {
    if (!previousProductImageValuesRef.current) {
      previousProductImageValuesRef.current = optionalImageValues;

      return;
    }

    /*

      새로운 사진이 추가되거나 기존 사진이 변경되었을 때,
      변경된 이미지 데이터만을 확인하여 서버에 새롭게 등록하고 (+ 기존 이미지는 서버에서 삭제)
      등록된 url을 컴포넌트 내부의 상태(optionalImages)에 반영하여
      등록된 이미지가 새롭게 렌더링 될 수 있도록 합니다.

    */

    optionalImageValues.map(
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

          if (optionalImages[index].url) {
            const removeImageResult: {
              result: string;
              error: RemoveImageErrorType;
            } = await removeImageFromServer(optionalImages[index].url);

            if (removeImageResult.error) {
              console.log(removeImageResult.error);
            }
          }

          const {
            url: addedImageUrl,
          }: {
            url: string;
          } = await addImageOnServer(productImageValue[0]);

          const newOptionalImages = [...optionalImagesVar()];

          newOptionalImages[index].url = addedImageUrl;

          optionalImagesVar([...newOptionalImages]);
        } catch (error) {
          console.log(error);
        }
      }
    );

    previousProductImageValuesRef.current = optionalImageValues;
  }, [optionalImageValues]);

  useEffect(() => {
    const hasAllImagesUploaded: boolean = optionalImages.reduce(
      (isUploaded: boolean, productImage: ProductImageType) =>
        isUploaded && Boolean(productImage.url),
      true
    );

    if (!hasAllImagesUploaded) return;

    if (optionalImages.length >= 15) {
      return;
    }

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

  const handleProductImageRemoveButtonClick = async (targetId: string) => {
    const productImage: ProductImageType = optionalImages.find(
      (image) => image.id === targetId
    );

    // 1. productImages에서 해당 객체를 제거한다
    const filteredOptionalImages = optionalImagesVar().filter(
      ({ id }) => id !== targetId
    );

    optionalImagesVar([...filteredOptionalImages]);

    // 2. react hook form에서 인풋 데이터를 제거한다
    unregister(targetId);

    // 3. 서버에 요청을 보내 해당 이미지 데이터를 삭제한다
    const removeImageResult: {
      result: string;
      error: RemoveImageErrorType;
    } = await removeImageFromServer(productImage.url);

    if (removeImageResult.error) {
      console.log(removeImageResult.error);
    }
  };

  {
    /*

        1. input 값을 업데이트하여 react hook form 내부 상태(productImageValues) 업데이트
        2. watching하여 새롭게 변화한 값을 서버에 등록
        3. 등록된 url을 컴포넌트 상태(optionalImages)로 저장하고 렌더링

      */
  }

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
