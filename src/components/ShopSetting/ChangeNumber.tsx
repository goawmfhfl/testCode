import React, { useState } from "react";
import styled from "styled-components";

import ChangeNumberModal from "./ChangeNumberModal";
import Button from "@components/Common/Button";

const ChangeNumber = () => {
  const [registeredPhoneNumber, setRegisteredPhoneNumber] =
    useState<string>("");
  const [modal, setModal] = useState<boolean>(false);

  const hidePhoneNumber = (phoneNumber: string) => {
    const addAsteriskPhoneNumber = phoneNumber.slice(0, 5) + "*".repeat(6);
    return (
      addAsteriskPhoneNumber.substr(0, 3) +
      "-" +
      addAsteriskPhoneNumber.substr(3, 4) +
      "-" +
      addAsteriskPhoneNumber.substr(7, 4)
    );
  };

  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>전화번호 변경</SubTitle>
      </SubTitleWrapper>
      <ChangeNumberContainer>
        <NumberText>
          등록된 전화번호 : {hidePhoneNumber(registeredPhoneNumber)}
        </NumberText>
        <Button size="small" full={false} onClick={() => setModal(true)}>
          변경하기
        </Button>
      </ChangeNumberContainer>
      {modal && (
        <ChangeNumberModal
          onClickModalHandler={setModal}
          setPhoneNumber={setRegisteredPhoneNumber}
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
  padding: 94px 0px;
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

const ChangeNumberContainer = styled.div`
  display: flex;

  min-width: 704px;
  & > span {
    display: flex;
    align-items: center;
    margin-right: 12px;
  }

  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

const NumberText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
`;

export default ChangeNumber;
