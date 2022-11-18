import React, { ChangeEvent } from "react";
import { useReactiveVar } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import styled from "styled-components/macro";

import { shopImagesVar, SHOP_INTRODUCTION } from "@cache/shopSettings";
import { systemModalVar } from "@cache/index";
import { validateImageDimensionRatio } from "@utils/index";

import NoticeContainer from "@components/common/NoticeContainer";
import Textarea from "@components/common/input/Textarea";
import addImageSrc from "@icons/addImage.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import infoIconSrc from "@icons/info.svg";
import questionmarkSrc from "@icons/questionmark.svg";
import closeIconSource from "@icons/delete.svg";
import photochangeSrc from "@icons/photochange.svg";

const ShopInfo = () => {
  const { register, watch } = useFormContext();

  const shopImages = useReactiveVar(shopImagesVar);
  const { mobileImage, pcImage } = shopImages;

  const handleChangeImageInput = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const formData = new FormData();
      const version = event.target.name;
      const [targetImage] = event.target.files;
      const { size } = targetImage;
      formData.append("files", targetImage);

      // 이미지 비율 확인
      if (version === "mobileImage") {
        const isMobileImageRatioFulfilled = await validateImageDimensionRatio(
          targetImage,
          { width: 1, height: 1 }
        );

        if (!isMobileImageRatioFulfilled) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>등록 가능한 이미지 비율은 1:1입니다.</>,
          });

          return;
        }
      }

      if (version === "pcImage") {
        const isPcImageRatioFulfilled = await validateImageDimensionRatio(
          targetImage,
          {
            width: 2,
            height: 1,
          }
        );

        if (!isPcImageRatioFulfilled) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>등록 가능한 이미지 비율은 2:1입니다.</>,
          });

          return;
        }
      }

      // 이미지 사이즈 확인
      const imageSizeAsMegabyte = size / 1000 / 1000;

      if (version === "mobileImage" && imageSizeAsMegabyte > 3) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: <>등록 가능한 파일크기는 3mb입니다.</>,
          cancelButtonVisibility: false,
        });

        return;
      }

      if (version === "pcImage" && imageSizeAsMegabyte > 5) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: <>등록 가능한 파일 크기는 5mb입니다.</>,
          cancelButtonVisibility: false,
        });

        return;
      }

      // 확인이 끝난 이미지들은 업로드 이후 상태로 세팅
      const { data }: { data: Array<string> } = await axios.post(
        "https://dev.chopsticks-store.com/upload",
        formData
      );

      if (version === "mobileImage") {
        if (mobileImage) {
          await deleteImageUrl(mobileImage);
        }

        shopImagesVar({
          ...shopImagesVar(),
          mobileImage: data[0],
        });
      }

      if (version === "pcImage") {
        if (pcImage) {
          await deleteImageUrl(pcImage);
        }

        shopImagesVar({
          ...shopImagesVar(),
          pcImage: data[0],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteImageUrl = async (imageUrl: string) => {
    try {
      const response: { data: { result: boolean } } = await axios.delete(
        "https://dev.chopsticks-store.com/upload",
        {
          data: {
            url: imageUrl.toString(),
          },
        }
      );

      if (!response.data.result) {
        console.log("이미지 삭제 서버 에러", response);
      }

      if (imageUrl === mobileImage) {
        shopImagesVar({
          ...shopImagesVar(),
          mobileImage: "",
        });
      }

      if (imageUrl === pcImage) {
        shopImagesVar({
          ...shopImagesVar(),
          pcImage: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteButtonClick =
    (imageUrl: string) => async (e: React.MouseEvent<HTMLImageElement>) => {
      e.preventDefault();
      e.stopPropagation();

      console.log(imageUrl);

      await deleteImageUrl(imageUrl);
    };

  const shopIntroduction = watch(SHOP_INTRODUCTION) as string;

  return (
    <Container>
      <ShopInfoContainer>
        <SectionContainer>
          <Description>샵 대표 사진</Description>

          <NoticeContainer icon={infoIconSrc} width={"627px"}>
            샵 대표 사진은 브랜드페이지 및 창작자 프로필 사진으로 노출됩니다.
            로고를 제외한 대표 상품 사진을 첨부해주세요.
          </NoticeContainer>

          <ShopImages>
            <ImageContainer>
              <ImageInputType>모바일 버전</ImageInputType>

              <ImageInputDescription>
                이미지 크기 : 1:1 정사각형(권장 750px x 750px)
                <br />
                파일 크기 : 3mb / 등록 가능 파일 확장자 : jpg, jpeg, png
              </ImageInputDescription>

              {mobileImage ? (
                <AddedMobileImageContainer>
                  <AddedMobileImage src={mobileImage} />
                  <DeleteButton
                    src={closeIconSource}
                    // eslint-disable-next-line
                    onClick={handleDeleteButtonClick(mobileImage)}
                  />
                  <ChangeImageLabel htmlFor="mobileImage">
                    <ImageInput
                      type="file"
                      id="mobileImage"
                      name="mobileImage"
                      accept="image/jpg,image/png,image/jpeg"
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </ChangeImageLabel>
                </AddedMobileImageContainer>
              ) : (
                <MobileImageContainer htmlFor="mobileImage">
                  <ImageInputLabel htmlFor="mobileImage">
                    <ImageInput
                      type="file"
                      id="mobileImage"
                      name="mobileImage"
                      accept="image/jpg,image/png,image/jpeg"
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </ImageInputLabel>
                  사진 등록하기
                </MobileImageContainer>
              )}
            </ImageContainer>

            <ImageContainer>
              <ImageInputType>PC 버전</ImageInputType>

              <ImageInputDescription>
                이미지 크기 : 2:1 직사각형(권장 1500px x 750px)
                <br />
                파일 크기 : 5mb / 등록 가능 파일 확장자 : jpg, jpeg, png
              </ImageInputDescription>

              {pcImage ? (
                <AddedPcImageContainer>
                  <AddedPcImage src={pcImage} />
                  <DeleteButton
                    src={closeIconSource}
                    // eslint-disable-next-line
                    onClick={handleDeleteButtonClick(pcImage)}
                  />
                  <ChangeImageLabel htmlFor="pcImage">
                    <ImageInput
                      type="file"
                      id="pcImage"
                      name="pcImage"
                      accept="image/jpg,image/png,image/jpeg"
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </ChangeImageLabel>
                </AddedPcImageContainer>
              ) : (
                <PcImageContainer htmlFor="pcImage">
                  <ImageInputLabel htmlFor="pcImage">
                    <ImageInput
                      type="file"
                      id="pcImage"
                      name="pcImage"
                      accept="image/jpg,image/png,image/jpeg"
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </ImageInputLabel>
                  사진 등록하기
                </PcImageContainer>
              )}
            </ImageContainer>
          </ShopImages>
        </SectionContainer>

        <SectionContainer>
          <Description>샵 소개</Description>

          <NoticeContainer icon={questionmarkSrc} width={"349px"}>
            창작자 페이지, 작품 상세 페이지에 노출되는 소개말입니다.
          </NoticeContainer>

          <TextareaContainer>
            <Textarea
              size="big"
              width={"377px"}
              height={"156px"}
              register={register(SHOP_INTRODUCTION)}
              maxLength={200}
            />
            <TextCounter>{shopIntroduction?.length}/200</TextCounter>
          </TextareaContainer>
        </SectionContainer>
      </ShopInfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const ShopInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 736px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;

  margin-bottom: 8px;
`;

const ShopImages = styled.div`
  display: flex;
  margin-top: 12px;
  margin-bottom: 48px;

  & > div:first-child {
    margin-right: 10px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 363px;
  padding: 16px 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

const ImageInputType = styled.h3`
  margin-bottom: 12px;

  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.1px;
`;

const ImageInputDescription = styled.p`
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;

  margin-bottom: 35px;
`;

const ImageInputLabel = styled.label`
  width: 48px;
  height: 48px;

  margin-bottom: 8px;

  background-image: url(${addImageSrc});
  background-position: center;
  background-size: cover;

  cursor: pointer;
`;

const ImageInput = styled.input.attrs({
  type: "file",
  accept: "image/jpg,image/png,image/jpeg",
})`
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  padding: 0;
`;

const ImageInputContainer = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme: { palette } }) => palette.white};
  border: 1px dashed ${({ theme: { palette } }) => palette.grey500};
  margin: 0 auto;

  cursor: pointer;

  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;
`;

const PcImageContainer = styled(ImageInputContainer)`
  width: 280px;
  height: 140px;
`;

const MobileImageContainer = styled(ImageInputContainer)`
  width: 140px;
  height: 140px;
`;

const AddedImageContainer = styled.div`
  position: relative;
  margin: 0 auto;
`;

const AddedMobileImageContainer = styled(AddedImageContainer)`
  width: 140px;
  height: 140px;
`;

const AddedPcImageContainer = styled(AddedImageContainer)`
  width: 280px;
  height: 140px;
`;

const AddedMobileImage = styled.img`
  width: 140px;
  height: 140px;
`;

const AddedPcImage = styled.img`
  width: 280px;
  height: 140px;
`;

const DeleteButton = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme: { palette } }) => palette.grey500};

  width: 24px;
  height: 24px;

  cursor: pointer;
`;

const ChangeImageLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;

  width: 24px;
  height: 24px;

  background-image: url(${photochangeSrc});
  background-position: center;
  background-size: cover;

  cursor: pointer;
`;

const TextareaContainer = styled.div`
  display: flex;

  margin-top: 10px;
`;

const TextCounter = styled.span`
  display: flex;
  align-items: flex-end;
  margin-left: 8px;

  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
`;

export default ShopInfo;
