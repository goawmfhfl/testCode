import { useState } from "react";
import styled from "styled-components";

import Button from "@components/common/Button";
import SettlementAccountModal from "@components/ShopSetting/SettlementAccountModal";

export interface accountInformationType {
  hasInformation: boolean;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

const hideAccountNumber = (accountNumber: string) => {
  const addAsterisk = accountNumber.slice(0, 5) + "*".repeat(6);

  return (
    addAsterisk.slice(0, 3) +
    "-" +
    addAsterisk.slice(3, 7) +
    "-" +
    addAsterisk.slice(7, 11)
  );
};

const SettlementAccount = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [accountInformation, setAccountInformation] =
    useState<accountInformationType>({
      hasInformation: false,
      accountName: "",
      accountNumber: "",
      bankCode: "",
      bankName: "",
    });

  const { hasInformation, accountName, accountNumber, bankCode, bankName } =
    accountInformation;

  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>정산 계좌 정보</SubTitle>
      </SubTitleWrapper>
      <AccountContainer>
        <AccountInfoText>등록된 계좌 정보</AccountInfoText>
        <RegisterContainer>
          <AccountInfoText>
            {hasInformation
              ? `${bankName} ${hideAccountNumber(
                  accountNumber
                )} (예금주명: ${accountName})`
              : " 등록된 계좌 정보가 없습니다."}
          </AccountInfoText>
          <Button size="small" full={false} onClick={() => setModal(true)}>
            {hasInformation ? "변경" : "등록"}
          </Button>
        </RegisterContainer>
      </AccountContainer>

      {modal && (
        <SettlementAccountModal
          onClickModalHandler={setModal}
          setAccountInformation={setAccountInformation}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 88px;
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

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 736px;

  & > :first-child {
    margin-bottom: 21px;
  }
`;

const AccountInfoText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
`;

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;

  & > :first-child {
    margin-right: 16px;
  }

  & > button {
    padding: 9px 16px;

    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

export default SettlementAccount;
