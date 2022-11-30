import { last } from "lodash";
import axios from "axios";
import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import exclamationmarkSrc from "@icons/exclamationmark.svg";

import NoticeContainer from "@components/common/NoticeContainer";
import TextInput from "@components/common/input/TextInput";
import {
  PHOTOCOPY,
  REGISTRATION_NUMBER_PREFIX,
  REGISTRATION_NUMBER_SUFFIX,
} from "@cache/shopSettings";
import deleteImageUrl from "@utils/shopSettings/deleteImageUrl";

const RegistrationNumber = () => {
  const { register, watch, setValue, getValues } = useFormContext();

  const handleChangePhotocopyInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files.length) return;

    const previous = getValues(PHOTOCOPY) as string;
    const [image] = e.target.files;

    if (previous) {
      await deleteImageUrl(previous);
    }

    const formData = new FormData();
    formData.append("files", image);

    const { data }: { data: Array<string> } = await axios.post(
      `${process.env.REACT_APP_SERVER_URI}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const photocopy = data[0];

    setValue(PHOTOCOPY, photocopy);
  };

  const attachedPhotocopy = getValues(PHOTOCOPY) as string;

  return (
    <Container>
      <NoticeContainer icon={exclamationmarkSrc} width={"100%"}>
        ᐧ 사업자등록증 없이 판매하시는 경우 주민등록증를 입력 및 사본을
        첨부해주세요(주민등록번호 및 사본은 정산에만 활용)
        <br />
        ᐧ 개인자격으로도 판매 가능하나 지속적으로 판매할 시 사업자등록을
        권유드립니다.
        <br />
        ᐧ 주민등록증 사본 속 성함은 정산 계좌 정보의 예금주명과 같아야 합니다.
        <br />
        ᐧ 사업자 등록 번호를 등록하셨을 경우 주민등록증 인증은 필수가 아닙니다.
        <br />
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
          <Suffix
            register={register(REGISTRATION_NUMBER_SUFFIX)}
            maxLength={7}
          />
        </RegistrationNumbers>

        <RegistrationPhotocopy>
          <Label>주민등록증사본</Label>
          <Attach>
            <Label htmlFor="photocopy" onClick={() => console.log(watch())}>
              첨부하기
            </Label>
            <PhotocopyInput
              id="photocopy"
              type="file"
              // eslint-disable-next-line
              onChange={handleChangePhotocopyInput}
            />
          </Attach>
          {attachedPhotocopy && <AttachedPhotocopy src={attachedPhotocopy} />}
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
const AttachedPhotocopy = styled.div<{ src: string }>`
  width: 160px;
  height: 160px;

  margin-left: 8px;

  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  filter: blur(8px);
  -webkit-filter: blur(8px);
  clip-path: inset(0px 0px 0px 0px);
`;

export default RegistrationNumber;
