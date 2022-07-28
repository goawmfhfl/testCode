import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

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
  validateImage,
} from "@utils/index";

const ProductImageSection = () => {
  const [productImages, setProductImages] = useState<Array<ProductImageType>>([
    {
      id: uuidv4(),
      url: "",
      type: ImageType.SQUARE,
      isThumbnail: true,
    },
  ]);

  const { register, unregister, watch } = useFormContext();

  const productImageValues: Array<FileList> | Array<null> = watch(
    productImages.map(({ id }) => id)
  );

  const previousProductImageValuesRef = useRef<Array<FileList> | null>(null);

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

    productImageValues.map(
      async (productImageValue: FileList, index: number) => {
        try {
          const previousImageValue: FileList | null =
            previousProductImageValuesRef.current[index];
          const hasImageChanged: boolean =
            productImageValue !== previousImageValue &&
            Boolean(productImageValue[0]);

          if (!hasImageChanged) {
            return;
          }

          const invalidMessage: string = await validateImage({
            file: productImageValue[0],
            validator: {
              width: 750,
              height: 750,
              size: 2097152,
              extensions: ["image/jpeg", "image/png", "image/jpg"],
            },
          });

          if (invalidMessage) {
            // TODO: 시스템 모달로 수정
            alert(invalidMessage);

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
      }
    );

    previousProductImageValuesRef.current = productImageValues;
  }, [productImageValues]);

  useEffect(() => {
    const hasAllImagesUploaded: boolean = productImages.reduce(
      (isUploaded: boolean, productImage: ProductImageType) =>
        isUploaded && Boolean(productImage.url),
      true
    );

    if (!hasAllImagesUploaded) return;

    if (productImages.length >= 5) {
      return;
    }

    setProductImages((prev) => [
      ...prev,
      { id: uuidv4(), url: "", type: ImageType.SQUARE },
    ]);
  }, [productImages]);

  const handleProductImageRemoveButtonClick = async (targetId: string) => {
    const productImage: ProductImageType = productImages.find(
      (image) => image.id === targetId
    );

    // 1. productImages에서 해당 객체를 제거한다
    setProductImages((prev) => {
      const filteredImages = prev.filter(({ id }) => id !== targetId);

      return filteredImages;
    });

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
        3. 등록된 url을 컴포넌트 상태(productImages)로 저장하고 렌더링

      */
  }

  return (
    <Container>
      {productImages.map(({ id, url }) => {
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  margin-top: 16px;
`;

export default ProductImageSection;
