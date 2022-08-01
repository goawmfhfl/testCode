/* eslint-disable */
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useFormContext } from "react-hook-form";

import closeIconSource from "@icons/close.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import triangleSrc from "@icons/triangle.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import ValidText from "@components/common/ValidText";
import SystemModal from "@components/common/SystemModal";
import { modalVar } from "@cache/index";
import { settlementAccountVar } from "@cache/shopSettings";

const SettlementAccountModal = () => {
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

  const [validation, setValidation] = useState<{
    isWrongNumber: boolean;
    isVerified: boolean;
  }>({ isWrongNumber: false, isVerified: false });
  const { isWrongNumber, isVerified } = validation;

  const { register, watch, resetField } = useFormContext();
  const watchField = watch();
  const { accountNumber, accountName, bankCode } = watchField;

  const confirmAccountOwner = async () => {
    try {
      const configs = {
        headers: { Authorization: process.env.REACT_APP_DATA_API_KEY || "" },
      };

      const requestData = {
        ACCTNO: accountNumber,
        BANKCODE: bankCode,
        CUSTNM: accountName,
      };

      const { data } = await axios.post(
        "https://datahub-dev.scraping.co.kr/scrap/common/settlebank/accountOwner",
        requestData,
        configs
      );

      if (data?.data.OUTRSLTMSG !== "정상처리") {
        setValidation(() => ({
          isVerified: false,
          isWrongNumber: true,
        }));
      } else {
        setValidation(() => ({
          isVerified: true,
          isWrongNumber: false,
        }));

        setSysyemModal((prev) => ({
          ...prev,
          isVisible: true,
          icon: "",
          description: <>계좌정보가 등록되었습니다.</>,
          buttonText: "확인",
          hasMultiButton: false,
          handleConfirmButtonClick: () => {
            setSysyemModal((prev) => ({
              ...prev,
              isVisible: false,
            }));

            settlementAccountVar({
              ...settlementAccountVar(),
              hasInformation: true,
            });
          },
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickBankName = (options: any) => {
    settlementAccountVar({
      ...settlementAccountVar(),
      bankName: options[options.selectedIndex].textContent,
    });
  };

  const turnOffModal = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });

    resetField("accountName");
    resetField("accountNumber");
    resetField("bankCode");
  };

  const handleConfirmButtonClick = () => {
    turnOffModal();
  };

  const handleCloseButtonClick = () => {
    turnOffModal();
  };

  return (
    <Container>
      <CloseButton src={closeIconSource} onClick={handleCloseButtonClick} />

      <Title>정산 계좌 등록하기</Title>
      <NoticeContainer icon={exclamationmarkSrc}>
        예금주명은 사업자등록증의 법인 명의(상호명)과 동일해야 합니다.
        <br />
        법인 명의와 예금주명 비교 로직에 따라 동일함이 확인될 경우 정산계좌 통장
        사본 제출은 생략 됩니다.
        <br /> (예금주명에 따라 비교가 어려울 경우 서류 제출이 필요합니다.)
      </NoticeContainer>

      <InfoContainer>
        <SelectContainer
          {...register("bankCode")}
          onChange={(event) => pickBankName(event.target.options)}
        >
          <Option defaultChecked>은행선택</Option>
          <Option value={"001"}>한국은행</Option>
          <Option value={"002"}>산업은행</Option>
          <Option value={"003"}>기업은행</Option>
          <Option value={"004"}>KB국민은행</Option>
          <Option value={"007"}>수협은행</Option>
          <Option value={"008"}>수출입은행</Option>
          <Option value={"011"}>NH농협은행</Option>
          <Option value={"012"}>농축협</Option>
          <Option value={"020"}>우리은행</Option>
        </SelectContainer>
        <UserAccountContainer>
          <Input placeholder="예금주명" {...register("accountName")} />
          <Input
            placeholder="계좌번호 (-없이 입력)"
            {...register("accountNumber")}
          />
          <Button size="small" full={false} onClick={confirmAccountOwner}>
            인증
          </Button>
          {isVerified && <ValidText valid={true}>인증되었습니다</ValidText>}
          {isWrongNumber && (
            <ValidText valid={false}>인증 실패하였습니다.</ValidText>
          )}
        </UserAccountContainer>
        {isWrongNumber && (
          <ValidText valid={true}>
            입력하신 계좌 정보가 실제 계좌 정보와 일치하지 않습니다.
            <br />
            입력하신 번호를 다시 한번 확인해주세요.
          </ValidText>
        )}
      </InfoContainer>
      <ButtonContainer>
        <Button
          size="small"
          full={false}
          className={isVerified ? "positive" : "negative"}
          disabled={!isVerified}
          onClick={handleConfirmButtonClick}
        >
          확인
        </Button>

        <Button size="small" full={false} onClick={handleCloseButtonClick}>
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
  padding: 40px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};
  & > h2 {
    margin-bottom: 24px;
  }
  & > h2 + div {
    margin-bottom: 24px;
  }
`;

const CloseButton = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;
  cursor: pointer;
`;

const Title = styled.h2`
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

const SelectContainer = styled.select`
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
