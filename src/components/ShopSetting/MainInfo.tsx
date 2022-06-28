import React from "react";
import styled from "styled-components";

import NoticeContainer from "@components/NoticeContainer";
import addphotoSrc from "@icons/addphoto.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import questionmarkSrc from "@icons/questionmark.svg";

import SystemModal from "@components/Common/SystemModal";

const MainInfo = () => {
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>샾 정보</SubTitle>
      </SubTitleWrapper>
      <ShopInfoContainer>
        <SectionContainer>
          <Description>샵 대표 사진</Description>
          <NoticeContainer icon={exclamationmarkSrc}>
            샵 대표 사진은 브랜드페이지 및 창작자 프로필 사진으로 노출됩니다.
            로고를 제외한 대표 상품 사진을 첨부해주세요.
            <br />
            권장 이미지 크기 : 750 px x 750px (정사각형만 가능)파일 크기 : 1장
            당 2mb / 등록 가능 파일 확장자 : jpg, jpeg, png
          </NoticeContainer>
          <RepresentImageContainer>
            <ImageContainer>
              <ImageTitleText>모바일 버전</ImageTitleText>
              <ImageInfoText>
                권장 이미지 크기 : 750 px x 750px (정사각형만 가능)
                <br />
                파일 크기 : 1장 당 2mb / 등록 가능 파일 확장자 : jpg, jpeg, png
              </ImageInfoText>
              <AddMobilePhotoContainer>
                <img src={addphotoSrc} />
                <p>사진 등록하기</p>
              </AddMobilePhotoContainer>
            </ImageContainer>
            <ImageContainer>
              <ImageTitleText>PC 버전</ImageTitleText>
              <ImageInfoText>
                권장 이미지 크기 : 1500 px x 750px
                <br />
                파일 크기 : 1장 당 3mb / 등록 가능 파일 확장자 : jpg, jpeg, png
              </ImageInfoText>
              <AddPcPhotoContainer>
                <img src={addphotoSrc} />
                <p>사진 등록하기</p>
              </AddPcPhotoContainer>
            </ImageContainer>
          </RepresentImageContainer>
        </SectionContainer>
        <SectionContainer>
          <Description>샵 소개</Description>
          <NoticeContainer icon={questionmarkSrc}>
            창작자 페이지, 작품 상세 페이지에 노출되는 소개말입니다.
          </NoticeContainer>
          <TextAreaContainer>
            <TextArea />
            <TextCounter>0/150</TextCounter>
          </TextAreaContainer>
        </SectionContainer>
      </ShopInfoContainer>
      <SystemModal icon="" text="확인">
        샵/판매자 정보 설정을 완료하시면
        <br />
        판매 활동을 시작할 수 있습니다.
      </SystemModal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding: 88px 0px;
`;
const SubTitleWrapper = styled.div`
  min-width: 235px;
  padding-left: 56px;
`;
const SubTitle = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
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
`;
const Description = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;
`;
const RepresentImageContainer = styled.div`
  display: flex;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};

  &:nth-child(1) {
    margin-right: 10px;
  }

  & > h3 {
    padding-bottom: 12px;
    padding-right: 254px;
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
const AddMobilePhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 36px 32px;
  margin: 0 auto;

  background-color: ${({ theme: { palette } }) => palette.white};
  border: 1px dashed ${({ theme: { palette } }) => palette.grey500};

  & > img {
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
const AddPcPhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
  width: 100%;
  padding: 33px 0px;

  background-color: ${({ theme: { palette } }) => palette.white};
  border: 1px dashed ${({ theme: { palette } }) => palette.grey500};

  & > img {
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
`;

const TextCounter = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
`;

export default MainInfo;
