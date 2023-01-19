import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import {
  PHOTOCOPY,
  REGISTRATION_NUMBER_PREFIX,
  REGISTRATION_NUMBER_SUFFIX,
} from "@cache/shopSettings";

import exclamationmarkSource from "@icons/exclamationmark.svg";
import exclamationIconGreySource from "@icons/exclamation-grey.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import TextInput from "@components/common/input/TextInput";
import { convertFileToBase64 } from "@utils/index";

const RegistrationNumber = () => {
  const { register, setValue, watch } = useFormContext();

  const handleChangePhotocopyInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files.length) return;

    const [image] = e.target.files;
    const url = await convertFileToBase64(image);

    setValue(PHOTOCOPY, url);
  };

  const attachedPhotocopy = watch(PHOTOCOPY) as string;

  return (
    <Container>
      <NoticeContainer icon={exclamationmarkSource} width={"550px"}>
        ᐧ 사업자등록증 없이 판매하시는 경우 주민등록번호 입력 및 사본 이미지를
        첨부해주세요. <br />
        (주민등록번호 및 사본이미지는 정산에만 활용됩니다.)
        <br />
        ᐧ 개인 자격으로도 판매 가능하나 지속적으로 판매할 시 사업자등록을
        권유드립니다.
        <br />ᐧ 위에 사업자 정보를 등록하였을 경우 주민등록번호 및 사본 등록은
        필수가 아닙니다.
      </NoticeContainer>

      <Section>
        <RegistrationNumbers>
          <Label>주민등록번호</Label>
          <Prefix
            placeholder="주민번호 앞 6자리"
            register={register(REGISTRATION_NUMBER_PREFIX)}
            numbersOnly={true}
            maxLength={6}
          />
          <input
            id="password"
            type="password"
            {...register(REGISTRATION_NUMBER_SUFFIX)}
            maxLength={7}
          />
        </RegistrationNumbers>

        <RegistrationPhotocopy>
          <Label>주민등록증사본</Label>
          <Attach>
            <Label htmlFor="photocopy">첨부하기</Label>
            <PhotocopyInput
              id="photocopy"
              type="file"
              // eslint-disable-next-line
              onChange={handleChangePhotocopyInput}
            />
          </Attach>

          {attachedPhotocopy && (
            <AttachedPhotocopyWrapper>
              <AttachedPhotocopy src={attachedPhotocopy} />

              <NoticeContainer icon={exclamationIconGreySource}>
                미리보기 용으로만 블러처리되며 첨부된 이미지는 <br />
                원본 그대로 등록됩니다.
              </NoticeContainer>

              <span>
                미리보기는 <br />
                블러처리 됩니다.
              </span>
            </AttachedPhotocopyWrapper>
          )}
        </RegistrationPhotocopy>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 702px;
  padding-bottom: 88px;
`;

const Section = styled.div`
  margin-top: 16px;
  padding: 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
  border-radius: 7px;

  & > button {
    font-family: "Spoqa Han Sans Neo";
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;

    background-color: #fff;
  }
`;

const RegistrationNumbers = styled.div`
  display: flex;
  align-items: center;

  & label {
    flex-basis: 200px;
  }

  & div {
    flex: 1;
  }

  #password {
    background-color: #fff;
    padding: 7px;
    border: 1px solid ${({ theme }) => theme.palette.grey500};
    height: 32px;
  }
`;

const Label = styled.label``;
const Prefix = styled(TextInput)``;
const Suffix = styled(TextInput)``;

const RegistrationPhotocopy = styled.div`
  display: flex;

  & label {
    flex-basis: 200px;
  }

  margin-top: 24px;
`;

const Attach = styled.span`
  height: 32px;
  display: flex;
  align-items: center;

  & label {
    padding: 7.5px 16px;

    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.1px;

    background-color: #fff;
    border: ${({ theme }) => `1px solid ${theme.palette.grey500}`};

    cursor: pointer;
  }
`;
const PhotocopyInput = styled.input`
  display: none;
`;

const AttachedPhotocopyWrapper = styled.div`
  margin-left: 8px;
  position: relative;

  & > span {
    width: 100%;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    ${({ theme }) => theme.typo.korean.headline.emphasized};
    text-align: center;

    pointer-events: none;
  }

  & > div:nth-child(2) {
    visibility: hidden;

    position: absolute;
    top: 70%;
    left: 45%;
    width: 305px;
  }

  &:hover {
    & > div:nth-child(2) {
      visibility: visible;
    }
  }
`;

const AttachedPhotocopy = styled.div<{ src: string }>`
  width: 160px;
  height: 160px;

  background-image: ${({ src }) => `url("${encodeURI(src)}")`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  filter: blur(8px);
  -webkit-filter: blur(8px);
  clip-path: inset(0px 0px 0px 0px);
`;

export default RegistrationNumber;
