import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import { useState, useEffect, useRef } from "react";

import ProductImage from "@components/ProductRegistration/ProductImageSection/ProductImage";

import {
  ProductImageType,
  ImageType,
  ProductImageContainer,
  AddImageInputWrapper,
  AddImageInput,
} from "./index";

import {
  addImageOnServer,
  removeImageFromServer,
  RemoveImageErrorType,
} from "@utils/index";

const RequiredImages = () => {
  const [productImages, setProductImages] = useState<Array<ProductImageType>>([
    {
      id: uuidv4(),
      url: "",
      type: ImageType.SQUARE,
      isThumbnail: true,
    },
    {
      id: uuidv4(),
      url: "",
      type: ImageType.SQUARE,
    },
    {
      id: uuidv4(),
      url: "",
      type: ImageType.SQUARE,
    },
    {
      id: uuidv4(),
      url: "",
      type: ImageType.SQUARE,
    },
    {
      id: uuidv4(),
      url: "",
      type: ImageType.SQUARE,
    },
  ]);

  const { register, setValue, watch } = useFormContext();

  const previousProductImageValuesRef = useRef<Array<FileList> | null>(null);

  const productImageValues: Array<FileList> | Array<null> = watch(
    productImages.map(({ id }) => id)
  );

  useEffect(() => {
    if (!previousProductImageValuesRef.current) {
      previousProductImageValuesRef.current = productImageValues;

      return;
    }

    /*

      새로운 사진이 추가되거나 기존 사진이 변경되었을 때,
      변경된 이미지 데이터만을 확인하여 서버에 새롭게 등록하고 (+ 기존 이미지는 서버에서 삭제)
      등록된 url을 컴포넌트 내부의 상태(productImages)에 반영하여
      등록된 이미지가 새롭게 렌더링 될 수 있도록 합니다.

    */

    productImageValues.map(async (productImageValue: FileList, index) => {
      try {
        const previousImageValue: FileList | null =
          previousProductImageValuesRef.current[index];
        const hasImageChanged: boolean =
          productImageValue !== previousImageValue &&
          Boolean(productImageValue[0]);

        if (!hasImageChanged) {
          return;
        }

        if (productImages[index].url) {
          const removeImageResult: {
            result: string;
            error: RemoveImageErrorType;
          } = await removeImageFromServer(productImages[index].url);

          if (removeImageResult.error) {
            console.log(removeImageResult.error);
          }
        }

        const addedImageUrl: string = await addImageOnServer(
          productImageValue[0]
        );

        setProductImages((prev) => {
          const newProductImages = [...prev];
          newProductImages[index].url = addedImageUrl;

          return newProductImages;
        });
      } catch (error) {
        console.log(error);
      }
    });

    previousProductImageValuesRef.current = productImageValues;
  }, [productImageValues]);

  const handleProductImageRemoveButtonClick = async (targetId: string) => {
    const productImage: ProductImageType = productImages.find(
      (image) => image.id === targetId
    );

    // 1. productImages에서 해당 url을 삭제한다
    setProductImages((prev) => {
      const newProductImages = [...prev].map((image) => {
        if (image.id === targetId) {
          return {
            ...image,
            url: "",
          };
        }

        return image;
      });

      return newProductImages;
    });

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

  const [thumbnailImage, ...requiredImages] = productImages;

  return (
    <Container>
      <ThumbnailImageContainer>
        <ThumbnailImageHeader>썸네일</ThumbnailImageHeader>
        <ProductImageContainer key={thumbnailImage.id}>
          {thumbnailImage.url ? (
            <ProductImage
              id={thumbnailImage.id}
              imageSource={thumbnailImage.url}
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
          {requiredImages.map(({ id, url }) => {
            return (
              <ProductImageContainer key={id}>
                {url ? (
                  <ProductImage
                    id={id}
                    imageSource={url}
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

  margin-top: 16px;
`;

const ThumbnailImageContainer = styled.div`
  margin-right: 16px;
`;
const ThumbnailImageHeader = styled.div``;
const RequiredImageContainer = styled.div``;
const RequiredImageHeader = styled.div``;
const RequiredImageList = styled.div`
  display: flex;
`;

export default RequiredImages;
