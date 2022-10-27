import React, { useState } from "react";
import { last } from "lodash";
import axios from "axios";
import styled from "styled-components/macro";

import { encryptedData } from "@utils/cipher";

import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import { modalVar, systemModalVar } from "@cache/index";
import { registrationNumberVar } from "@cache/shopSettings";
import AuthenticationLoader from "./AuthenticationLoader";

const RegistrationNumberModal = () => {
  const [registrationInformation, setRegistrationInformation] = useState({
    registerName: "",
    registerNumber: ["", ""],
    issueDate: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { registerName, registerNumber, issueDate } = registrationInformation;

  const handleInputChange =
    (inputName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputName.includes("registerNumber")) {
        const registerNumberIndex = last(inputName.split("-"));

        setRegistrationInformation((prev) => {
          const newRegisterNumber = [...prev.registerNumber];

          newRegisterNumber[registerNumberIndex] = e.target.value;

          return {
            ...prev,
            registerNumber: newRegisterNumber,
          };
        });

        return;
      }

      setRegistrationInformation((prev) => ({
        ...prev,
        [inputName]: e.target.value,
      }));
    };

  const handleAuthenticationButtonClick = async () => {
    setIsLoading(true);

    try {
      const configs = {
        headers: { Authorization: process.env.REACT_APP_DATA_API_KEY || "" },
      };

      const response: {
        data: {
          result: string;
          data: { ERRMSG: string };
          errCode: string;
          errMsg: string;
        };
      } = await axios.post(
        `${process.env.REACT_APP_DATAHUB_API_URL_DEV}/scrap/docInq/gov/ResidentPromotionCommittee`,
        {
          JUMIN: encryptedData(registerNumber.join("")),
          NAME: encryptedData(registerName),
          ISSUEDATE: encryptedData(issueDate),
        },
        configs
      );

      const {
        data: { result, data, errCode, errMsg },
      } = response;

      if (result === "FAIL" || result === "ERROR") {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              인증 서비스에 문제가 발생하였습니다.
              <br />
              찹스틱스로 문의해주시면
              <br />
              빠르게 조치하겠습니다.
              <br />
              (문의 전화 070-4187-3848)
            </>
          ),
        });

        console.log(`Error code: ${errCode}`);
        console.log(`Error Message: ${errMsg}`);

        return;
      }

      if (data.ERRMSG) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: (
            <>
              기입한 정보가 올바르지 않습니다.
              <br />
              다시 기입해주세요.
            </>
          ),
          confirmButtonText: "확인",
          confirmButtonClickHandler: () =>
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            }),
        });

        return;
      }

      setIsAuthenticated(true);

      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        icon: "",
        description: <>인증되었습니다.</>,
        confirmButtonText: "확인",
        confirmButtonClickHandler: () =>
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveButtonClick = () => {
    const identificationCardNumber = registerNumber.join("");

    const issueDateArray = Array.from(issueDate);
    issueDateArray.splice(4, 0, "-");
    issueDateArray.splice(7, 0, "-");

    const identificationCardIssueDate = new Date(issueDateArray.join(""));

    registrationNumberVar({
      isConfirmed: true,
      identificationCardOwner: registerName,
      identificationCardNumber,
      identificationCardIssueDate,
    });

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>인증사항이 저장되었습니다.</>,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });

        modalVar({
          ...modalVar(),
          isVisible: false,
        });
      },
      cancelButtonVisibility: false,
    });
  };

  const clearModal = () => modalVar({ ...modalVar(), isVisible: false });

  const handleCancelButtonClick = () => clearModal();

  return (
    <Container>
      <Title>주민등록증 인증하기</Title>

      <NoticeContainer icon={exclamationmarkSrc}>
        주민등록증은 정산받을 계좌 정보의 예금주명과 같아야 합니다.
      </NoticeContainer>

      <InfoContainer>
        <RegisterNameContainer>
          <Label>성명</Label>
          <Input
            onChange={handleInputChange("registerName")}
            value={registerName}
          />
        </RegisterNameContainer>

        <RegisterNumberContainer>
          <Label>주민등록번호</Label>
          <InputContainer>
            <Input
              onChange={handleInputChange("registerNumber-0")}
              value={registerNumber[0]}
            />
            <span>-</span>
            <Input
              type="password"
              onChange={handleInputChange("registerNumber-1")}
              value={registerNumber[1]}
            />
          </InputContainer>
        </RegisterNumberContainer>

        <DateContainer>
          <Label>발급일자</Label>
          <Input
            placeholder="YYYYMMDD"
            onChange={handleInputChange("issueDate")}
            value={issueDate}
          />
          <AuthenticationButton
            size="small"
            full={false}
            // eslint-disable-next-line
            onClick={async () => {
              await handleAuthenticationButtonClick();
              setIsLoading(false);
            }}
            disabled={isLoading}
          >
            인증
          </AuthenticationButton>

          <AuthenticationStatus>
            {isLoading ? (
              <AuthenticationLoader />
            ) : (
              isAuthenticated && <>인증되었습니다.</>
            )}
          </AuthenticationStatus>
        </DateContainer>
      </InfoContainer>

      <ButtonContainer>
        <Button
          size="small"
          full={false}
          className="positive"
          onClick={handleSaveButtonClick}
          disabled={!isAuthenticated}
        >
          저장
        </Button>

        <Button size="small" full={false} onClick={handleCancelButtonClick}>
          취소
        </Button>
      </ButtonContainer>
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
  padding: 24px 24px 24px 24px;
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

const RegisterNameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > input {
    font-weight: 300;
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }
`;

const RegisterNumberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > input {
    font-weight: 300;
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;

  width: 152px;
`;

const InputContainer = styled.div`
  display: flex;

  & > input {
    font-weight: 300;
    width: 120px;
    height: 32px;
    padding: 9px 8px;
  }

  & > span {
    margin: auto 8px;
  }
`;

const AuthenticationButton = styled(Button)`
  margin-left: 8px;
`;

const AuthenticationStatus = styled.div`
  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  margin-left: 8px;

  & > span {
    font-weight: 500;
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
