import { ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import styled from "styled-components/macro";

import { validateImageDimensionRatio } from "@utils/index";
import { systemModalVar } from "@cache/index";
import NoticeContainer from "@components/common/NoticeContainer";
import addImageSrc from "@icons/addImage.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import infoIconSrc from "@icons/info.svg";
import questionmarkSrc from "@icons/questionmark.svg";
import closeIconSource from "@icons/close.svg";
import photochangeSrc from "@icons/photochange.svg";
import { composeStories } from "@storybook/react";

const ShopInfo = () => {
  const { register } = useFormContext();

  const [mobileImage, setMoboileImage] = useState<string>("");
  const [pcImage, setPcImage] = useState<string>("");
  const [textLengh, setTextLength] = useState<number>(0);

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

      if (version === "mobileImage" && imageSizeAsMegabyte > 2) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: (
            <>
              모바일 이미지 사이즈는
              <br />
              2MB 이하로 부탁드려요!
            </>
          ),
          cancelButtonVisibility: false,
        });

        return;
      }

      if (version === "pcImage" && imageSizeAsMegabyte > 3) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: (
            <>
              PC 이미지 사이즈는
              <br />
              3MB 이하로 부탁드려요!
            </>
          ),
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

        setMoboileImage(data[0]);
      }

      if (version === "pcImage") {
        if (pcImage) {
          await deleteImageUrl(pcImage);
        }

        setPcImage(data[0]);
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

      if (imageUrl === mobileImage) setMoboileImage("");
      if (imageUrl === pcImage) setPcImage("");
    } catch (error) {
      console.log(error);
    }
  };

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
              <ImageTitleText>모바일 버전</ImageTitleText>

              <ImageInfoText>
                권장 이미지 크기 : 750 px x 750px (정사각형만 가능)
                <br />
                파일 크기 : 1장 당 2mb / 등록 가능 파일 확장자 : jpg, jpeg, png
              </ImageInfoText>

              {mobileImage ? (
                <AddedMobileImageContainer htmlFor="mobileImage">
                  <AddedMobileImage src={mobileImage} />
                  <DeleteIcon
                    src={closeIconSource}
                    // eslint-disable-next-line
                    onClick={async () => await deleteImageUrl(mobileImage)}
                  />
                  <ChangeImageLabel htmlFor="mobileImage">
                    <ImageInput
                      type="file"
                      id="mobileImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("mobileImage")}
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </ChangeImageLabel>
                </AddedMobileImageContainer>
              ) : (
                <MobileImageContainer htmlFor="mobileImage">
                  <UploadImageLabel htmlFor="mobileImage">
                    <ImageInput
                      type="file"
                      id="mobileImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("mobileImage")}
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </UploadImageLabel>
                  <p>사진 등록하기</p>
                </MobileImageContainer>
              )}
            </ImageContainer>

            <ImageContainer>
              <ImageTitleText>PC 버전</ImageTitleText>

              <ImageInfoText>
                권장 이미지 크기 : 1500 px x 750px
                <br />
                파일 크기 : 1장 당 3mb / 등록 가능 파일 확장자 : jpg, jpeg, png
              </ImageInfoText>

              {pcImage ? (
                <AddedPcImageContainer htmlFor="pcImage">
                  <AddedPcImage src={pcImage} />
                  <DeleteIcon
                    src={closeIconSource}
                    // eslint-disable-next-line
                    onClick={async () => await deleteImageUrl(pcImage)}
                  />
                  <ChangeImageLabel htmlFor="pcImage">
                    <ImageInput
                      type="file"
                      id="pcImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("pcImage")}
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </ChangeImageLabel>
                </AddedPcImageContainer>
              ) : (
                <PcImageContainer htmlFor="pcImage">
                  <UploadImageLabel htmlFor="pcImage">
                    <ImageInput
                      type="file"
                      id="pcImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("pcImage")}
                      // eslint-disable-next-line
                      onChange={handleChangeImageInput}
                    />
                  </UploadImageLabel>
                  <p>사진 등록하기</p>
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
          <TextAreaContainer>
            <TextArea
              {...register("shopIntroduction")}
              onChange={(event) => setTextLength(event.target.value.length)}
              maxLength={200}
            />
            <TextCounter>{textLengh}/200</TextCounter>
          </TextAreaContainer>
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

  & > div:first-child {
    margin-bottom: 48px;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;

  & > span {
    margin-bottom: 8px;
  }

  & > span + div {
    margin-bottom: 12px;
  }
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
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 363px;
  padding: 16px 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};

  &:nth-child(1) {
    margin-right: 10px;
  }

  & > h3 {
    padding-bottom: 12px;
  }

  & > p {
    margin-bottom: 35px;
  }
`;

const ImageTitleText = styled.h3`
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.1px;
`;

const ImageInfoText = styled.p`
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

const UploadImageLabel = styled.label`
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

const PcImageContainer = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 280px;
  height: 140px;
  background-color: ${({ theme: { palette } }) => palette.white};
  border: 1px dashed ${({ theme: { palette } }) => palette.grey500};
  margin: 0 auto;

  cursor: pointer;

  & > label {
    width: 48px;
    height: 48px;
    margin-bottom: 14px;
  }

  & > p {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

const MobileImageContainer = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 140px;
  height: 140px;
  background-color: ${({ theme: { palette } }) => palette.white};
  border: 1px dashed ${({ theme: { palette } }) => palette.grey500};
  margin: 0 auto;

  cursor: pointer;

  & > label {
    width: 48px;
    height: 48px;
    margin-bottom: 14px;
  }

  & > p {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

const AddedMobileImageContainer = styled.label`
  position: relative;
  margin: 0 auto;
  width: 140px;
  height: 140px;
`;

const AddedPcImageContainer = styled.label`
  position: relative;
  margin: 0 auto;
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

const DeleteIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme: { palette } }) => palette.grey500};

  width: 24px;
  height: 24px;
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

const TextAreaContainer = styled.div`
  display: flex;

  & > span {
    display: flex;
    align-items: flex-end;
    margin-left: 8px;
  }
`;

const TextArea = styled.textarea`
  width: 377px;
  height: 156px;
  background: ${({ theme: { palette } }) => palette.white};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  padding: 8px;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;

  resize: none;
`;

const TextCounter = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
`;

export default ShopInfo;
