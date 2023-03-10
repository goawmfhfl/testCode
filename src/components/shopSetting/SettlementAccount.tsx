import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import Button from "@components/common/Button";
import SettlementAccountModal from "@components/shopSetting/SettlementAccountModal";

import { modalVar } from "@cache/index";
import { settlementAccountVar } from "@cache/shopSettings";

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
  const settlementAccount = useReactiveVar(settlementAccountVar);

  const { hasInformation, accountName, accountNumber, bankName } =
    settlementAccount;

  const showSettlementAccountModal = () =>
    modalVar({
      ...modalVar(),
      isVisible: true,
      component: <SettlementAccountModal />,
    });

  const handleRegisterButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    showSettlementAccountModal();
  };

  return (
    <Container>
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
          <Button size="small" full={false} onClick={handleRegisterButtonClick}>
            {hasInformation ? "변경" : "등록"}
          </Button>
        </RegisterContainer>
      </AccountContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
`;

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountInfoText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  margin-top: 5px;
  margin-bottom: 12px;
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
