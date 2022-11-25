import React, { useState } from "react";
import styled from "styled-components/macro";
import axios from "axios";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import triangleSrc from "@icons/triangle.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import ValidText from "@components/common/ValidText";
import { modalVar, systemModalVar } from "@cache/index";
import { settlementAccountVar } from "@cache/shopSettings";
import { isNumber } from "@utils/index";
import AuthenticationLoader from "@components/shopSetting/AuthenticationLoader";

const SettlementAccountModal = () => {
  const [accountInformation, setAccountInformation] = useState<{
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
  }>({
    accountNumber: "",
    accountName: "",
    bankCode: "",
    bankName: "",
  });
  const [hasTriedAuthentication, setHasTriedAuthentication] =
    useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAuthenticationButtonClick = async () => {
    if (!hasTriedAuthentication) setHasTriedAuthentication(true);

    try {
      const configs = {
        headers: { Authorization: process.env.REACT_APP_DATA_API_KEY || "" },
      };

      const { accountNumber, accountName, bankCode } = accountInformation;

      setIsLoading(true);

      const response: {
        data: {
          data: {
            OUTRSLTMSG: string;
            RESULT: string;
          };
          result: string;
        };
      } = await axios.post(
        `${process.env.REACT_APP_DATAHUB_API_URL_DEV}/scrap/common/settlebank/accountOwner`,
        {
          ACCTNO: accountNumber,
          BANKCODE: bankCode,
          CUSTNM: accountName,
        },
        configs
      );

      console.log(response);

      // API Error
      if (response.data.result === "ERROR") {
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

        console.log("정산 계좌 확인 요청 에러", response.data);

        return;
      }

      // User Input Error
      if (response.data.data.RESULT === "FAILURE") {
        setIsAuthenticated(false);

        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const clearModal = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });

    setAccountInformation({
      accountName: "",
      accountNumber: "",
      bankCode: "",
      bankName: "",
    });
  };

  const handleInputChange =
    (inputName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (inputName === "bank") {
        const [bankCode, bankName] = e.target.value.split(",");

        setAccountInformation((prev) => ({
          ...prev,
          bankCode,
          bankName,
        }));

        return;
      }

      if (inputName === "accountNumber" && !isNumber(e.target.value)) {
        return;
      }

      setAccountInformation((prev) => ({
        ...prev,
        [inputName]: e.target.value,
      }));
    };

  const handleConfirmButtonClick = () => {
    const { accountNumber, accountName, bankCode, bankName } =
      accountInformation;

    settlementAccountVar({
      hasInformation: true,
      accountName,
      accountNumber,
      bankCode,
      bankName,
    });

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      icon: "",
      description: <>계좌정보가 등록되었습니다.</>,
      confirmButtonText: "확인",
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });

        clearModal();
      },
    });
  };

  const handleCancelButtonClick = () => {
    clearModal();
  };

  const { accountNumber, accountName, bankName } = accountInformation;
  const hasAccountInformationFulfilled =
    Boolean(accountNumber) && Boolean(accountName) && Boolean(bankName);

  return (
    <Container>
      <Title>정산 계좌 등록하기</Title>
      <NoticeContainer icon={exclamationmarkSrc}>
        예금주명은 사업자등록증의 법인 명의(상호명)과 동일해야 합니다.
        <br />
        법인 명의와 예금주명 비교 로직에 따라 동일함이 확인될 경우 정산계좌 통장
        사본 제출은 생략 됩니다.
        <br /> (예금주명에 따라 비교가 어려울 경우 서류 제출이 필요합니다.)
      </NoticeContainer>

      <InfoContainer>
        <Select onChange={handleInputChange("bank")}>
          <Option defaultChecked>은행선택</Option>
          <Option value={["001", "한국은행"]}>한국은행</Option>
          <Option value={["002", "산업은행"]}>산업은행</Option>
          <Option value={["003", "기업은행"]}>기업은행</Option>
          <Option value={["004", "KB국민은행"]}>KB국민은행</Option>
          <Option value={["007", "수협은행"]}>수협은행</Option>
          <Option value={["008", "수출입은행"]}>수출입은행</Option>
          <Option value={["011", "NH농협은행"]}>NH농협은행</Option>
          <Option value={["012", "농축협"]}>농축협</Option>
          <Option value={["020", "우리은행"]}>우리은행</Option>
        </Select>

        <UserAccountContainer>
          <OwnerNameInput
            placeholder="예금주명"
            onChange={handleInputChange("accountName")}
            value={accountInformation.accountName}
          />

          <AccountNumberInput
            placeholder="계좌번호 (-없이 입력)"
            onChange={handleInputChange("accountNumber")}
            value={accountInformation.accountNumber}
          />

          <Button
            size="small"
            full={false}
            // eslint-disable-next-line
            onClick={async () => {
              await handleAuthenticationButtonClick();
              setIsLoading(false);
            }}
            disabled={isLoading || !hasAccountInformationFulfilled}
          >
            인증
          </Button>

          {isLoading ? (
            <AuthenticationLoader />
          ) : (
            <>
              {hasTriedAuthentication && isAuthenticated && (
                <ValidText valid={true}>인증되었습니다.</ValidText>
              )}
              {hasTriedAuthentication && !isAuthenticated && (
                <ValidText valid={false}>인증 실패하였습니다.</ValidText>
              )}
            </>
          )}
        </UserAccountContainer>

        {!isLoading && hasTriedAuthentication && !isAuthenticated && (
          <ValidText valid={true}>
            입력하신 계좌 정보가 실제 계좌 정보와 일치하지 않습니다.
            <br />
            입력하신 은행, 예금주, 계좌번호를 다시 한번 확인해주세요.
          </ValidText>
        )}
      </InfoContainer>

      <ButtonContainer>
        <Button
          size="small"
          full={false}
          className="positive"
          disabled={!isAuthenticated}
          onClick={handleConfirmButtonClick}
        >
          등록
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

  width: 603px;
  padding: 24px 24px 24px 24px;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  display: flex;
  flex-direction: column;

  & > h2 {
    margin-bottom: 24px;
  }

  & > h2 + div {
    margin-bottom: 24px;
  }
`;

const Title = styled.h2`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 800;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.1px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 58px;
`;

const Select = styled.select`
  width: 134px;
  border: 1px solid ${({ theme: { palette } }) => palette.grey400};
  padding: 8px 45px 8px 8px;
  margin-bottom: 17px;
  background: url(${triangleSrc}) right no-repeat;
  background-size: 24px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
  -o-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
`;

const Option = styled.option``;

const UserAccountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  & > input {
    width: 136px;
    height: 32px;
    padding: 9px 8px;
    margin-right: 16px;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
  }
  & > input:first-child {
    margin-right: 16px;
  }
  & > button {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    padding: 8px 16px;
    margin-right: 16px;
  }
  & > p {
    margin: auto 0;
  }
`;

const OwnerNameInput = styled(Input)`
  font-weight: 300 !important;
`;

const AccountNumberInput = styled(Input)`
  font-weight: 300 !important;
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

export default SettlementAccountModal;
