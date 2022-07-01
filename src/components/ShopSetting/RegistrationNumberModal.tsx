/* eslint-disable */
import React, { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";

import { encryptedData } from "@utils/cipher";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import SystemModal from "@components/common/SystemModal";

interface RegistrationNumberModalProps {
  onClickModalHandler: Dispatch<SetStateAction<boolean>>;
}

const RegistrationNumberModal = ({
  onClickModalHandler,
}: RegistrationNumberModalProps) => {
  const [systemModal, setSysyemModal] = useState<{
    isVisible: boolean;
    icon: string;
    description: React.ReactNode;
    buttonText: string;
    hasMultiButton: boolean;
    handleConfirmButtonClick?: () => void;
    handleCancleButtonClick?: () => void;
  }>({
    isVisible: false,
    icon: "",
    description: <></>,
    buttonText: "",
    hasMultiButton: true,
    handleCancleButtonClick: () =>
      setSysyemModal((prev) => ({
        ...prev,
        isVisible: false,
      })),
  });

  const { register, watch } = useFormContext();
  const watchFields = watch();
  const { idName, firstDigits, lastDigits, issuance } = watchFields;

  const confirmRegistrationNumberCode = async () => {
    try {
      const configs = {
        headers: { Authorization: process.env.REACT_APP_DATA_API_KEY || "" },
      };

      const requestData = {
        JUMIN: encryptedData([firstDigits, lastDigits].join("")),
        NAME: encryptedData(idName),
        ISSUEDATE: issuance,
      };

      const { data } = await axios.post(
        "https://datahub-dev.scraping.co.kr/scrap/docInq/gov/ResidentPromotionCommittee",
        requestData,
        configs
      );

      if (data?.data?.ERRMSG) {
        setSysyemModal((prev) => ({
          ...prev,
          isVisible: true,
          icon: exclamationmarkSrc,
          description: (
            <>
              기입한 정보가 올바르지 않습니다.
              <br />
              다시 기입해주세요.
            </>
          ),
          buttonText: "확인",
          hasMultiButton: false,
          handleConfirmButtonClick: () =>
            setSysyemModal((prev) => ({
              ...prev,
              isVisible: false,
            })),
        }));
      } else {
        setSysyemModal((prev) => ({
          ...prev,
          isVisible: true,
          icon: "",
          description: <>인증되었습니다.</>,
          buttonText: "확인",
          hasMultiButton: false,
          handleConfirmButtonClick: () =>
            setSysyemModal((prev) => ({
              ...prev,
              isVisible: false,
            })),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Icon src={deleteSrc} onClick={() => onClickModalHandler(false)} />
      <Title>주민등록증 인증하기</Title>

      <NoticeContainer icon={exclamationmarkSrc}>
        주민등록증은 정산받을 계좌 정보의 예금주명과 같아야 합니다.
      </NoticeContainer>

      <InfoContainer>
        <NameContainer>
          <SubTitle>성명</SubTitle>
          <Input {...register("idName")} />
        </NameContainer>
        <IdContainer>
          <SubTitle>주민등록번호</SubTitle>
          <InputContainer>
            <Input {...register("firstDigits")} />
            <span>-</span>
            <Input type="password" {...register("lastDigits")} />
          </InputContainer>
        </IdContainer>
        <DateContainer>
          <SubTitle>발급일자</SubTitle>
          <Input placeholder="YYYYMMDD" {...register("issuance")} />
        </DateContainer>
      </InfoContainer>

      <ButtonContainer>
        <Button
          size="small"
          full={false}
          className="positive"
          onClick={confirmRegistrationNumberCode}
        >
          저장
        </Button>
        <Button
          size="small"
          full={false}
          onClick={() => onClickModalHandler(false)}
        >
          취소
        </Button>
      </ButtonContainer>

      {systemModal.isVisible && (
        <SystemModal {...systemModal}>{systemModal.description}</SystemModal>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 530px;
  padding: 40px 24px 24px 24px;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};
  & > h2 {
    margin-bottom: 24px;
  }
  & > h2 + div {
    width: 369px;
    margin-bottom: 24px;
  }
`;

const Icon = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;
  cursor: pointer;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  & > h3 {
    width: 152px;
  }
  & > input {
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }
`;

const IdContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  & > h3 {
    width: 152px;
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  & > h3 {
    width: 152px;
  }
  & > input {
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }
`;

const SubTitle = styled.h3`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

const InputContainer = styled.div`
  display: flex;
  & > input {
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }
  & > span {
    margin: auto 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  & > button:first-child {
    margin-right: 16px;
  }
  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

export default RegistrationNumberModal;
