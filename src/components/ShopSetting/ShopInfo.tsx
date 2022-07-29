/* eslint-disable */
import { ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import styled from "styled-components/macro";

import NoticeContainer from "@components/common/NoticeContainer";
import SystemModal from "@components/common/SystemModal";
import addImageSrc from "@icons/addImage.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import infoIconSrc from "@icons/info.svg";
import questionmarkSrc from "@icons/questionmark.svg";
import deleteSrc from "@icons/delete.svg";
import photochangeSrc from "@icons/photochange.svg";

const ShopInfo = () => {
  const { register, watch } = useFormContext();
  const shopDescription = watch("description") as string;

  const [mobileImage, setMoboileImage] = useState<string>("");
  const [pcImage, setPcImage] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [textLengh, setTextLength] = useState<number>(0);

  const imageHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData();
      const version = event.target.name;
      const targetImage = event.target.files as FileList;
      const { size } = targetImage[0];
      formData.append("files", targetImage[0]);

      // check Image size
      if (version === "mobileImage" && size / 1024 / 1024 > 2)
        return setModal(true);
      if (version === "pcImage" && size / 1024 / 1024 > 3)
        return setModal(true);

      // delete duplicate image url
      if (mobileImage && version === "mobileImage") deleteImageUrl(mobileImage);
      if (pcImage && version === "pcImage") deleteImageUrl(pcImage);

      // create & save image url
      const { data } = await axios.post(
        "https://dev.chopsticks-store.com/upload",
        formData
      );
      if (version === "mobileImage") setMoboileImage(data);
      if (version === "pcImage") setPcImage(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteImageUrl = async (imageUrl: any) => {
    try {
      const response = await axios.delete(
        "https://dev.chopsticks-store.com/upload",
        {
          data: {
            url: imageUrl.toString(),
          },
        }
      );

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
          <NoticeContainer icon={infoIconSrc}>
            샵 대표 사진은 브랜드페이지 및 창작자 프로필 사진으로 노출됩니다.
            로고를 제외한 대표 상품 사진을 첨부해주세요.
            <br />
            권장 이미지 크기 : 750 px x 750px (정사각형만 가능)파일 크기 : 1장
            당 2mb / 등록 가능 파일 확장자 : jpg, jpeg, png
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
                <AddedMobileImageContainer>
                  <AddedMobileImage src={mobileImage} />
                  <DeleteIcon
                    src={deleteSrc}
                    onClick={() => deleteImageUrl(mobileImage)}
                  />
                  <ChangeImageLabel htmlFor="mobileImage">
                    <UploadImgInput
                      type="file"
                      id="mobileImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("mobileImage")}
                      onChange={(event) => imageHandler(event)}
                    />
                  </ChangeImageLabel>
                </AddedMobileImageContainer>
              ) : (
                <MobileImageContainer>
                  <UploadImageLabel htmlFor="mobileImage">
                    <UploadImgInput
                      type="file"
                      id="mobileImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("mobileImage")}
                      onChange={(event) => imageHandler(event)}
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
                <AddedPcImageContainer>
                  <AddedPcImage src={pcImage} />
                  <DeleteIcon
                    src={deleteSrc}
                    onClick={() => deleteImageUrl(pcImage)}
                  />
                  <ChangeImageLabel htmlFor="pcImage">
                    <UploadImgInput
                      type="file"
                      id="pcImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("pcImage")}
                      onChange={(event) => imageHandler(event)}
                    />
                  </ChangeImageLabel>
                </AddedPcImageContainer>
              ) : (
                <PcImageContainer>
                  <UploadImageLabel htmlFor="pcImage">
                    <UploadImgInput
                      type="file"
                      id="pcImage"
                      accept="image/jpg,image/png,image/jpeg"
                      {...register("pcImage")}
                      onChange={(event) => imageHandler(event)}
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
          <NoticeContainer icon={questionmarkSrc}>
            창작자 페이지, 작품 상세 페이지에 노출되는 소개말입니다.
          </NoticeContainer>
          <TextAreaContainer>
            <TextArea
              {...register("shopInroduce")}
              onChange={(event) => setTextLength(event.target.value.length)}
              maxLength={200}
            />
            <TextCounter>{textLengh}/200</TextCounter>
          </TextAreaContainer>
        </SectionContainer>
      </ShopInfoContainer>

      {modal && (
        <SystemModal
          buttonText="확인"
          icon={exclamationmarkSrc}
          hasMultiButton={false}
          handleConfirmButtonClick={() => setModal(false)}
        >
          등록 가능한 최대 파일크기를
          <br />
          초과하였습니다.
        </SystemModal>
      )}
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
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;
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

const UploadImgInput = styled.input`
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  padding: 0;
`;

const PcImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 315px;
  height: 140px;
  background-color: ${({ theme: { palette } }) => palette.white};
  border: 1px dashed ${({ theme: { palette } }) => palette.grey500};
  margin: 0 auto;

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

const MobileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 140px;
  height: 140px;
  background-color: ${({ theme: { palette } }) => palette.white};
  border: 1px dashed ${({ theme: { palette } }) => palette.grey500};
  margin: 0 auto;

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

const AddedMobileImageContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 140px;
  height: 140px;
`;

const AddedPcImageContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 315px;
  height: 140px;
`;

const AddedMobileImage = styled.img`
  width: 140px;
  height: 140px;
`;

const AddedPcImage = styled.img`
  width: 315px;
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
