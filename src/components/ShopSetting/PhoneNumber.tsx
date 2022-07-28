import { useState } from "react";
import styled from "styled-components/macro";

import PhoneNumberModal from "./PhoneNumberModal";
import Button from "@components/common/Button";

const PhoneNumber = () => {
  const [registeredPhoneNumber, setRegisteredPhoneNumber] =
    useState<string>("");
  const [modal, setModal] = useState<boolean>(false);

  const hidePhoneNumber = (phoneNumber: string) => {
    const addAsterisk = phoneNumber.slice(0, 5) + "*".repeat(6);

    return (
      addAsterisk.slice(0, 3) +
      "-" +
      addAsterisk.slice(3, 7) +
      "-" +
      addAsterisk.slice(7, 11)
    );
  };

  return (
    <Container>
      <PhoneNumberContainer>
        <NumberText>
          등록된 전화번호 : {hidePhoneNumber(registeredPhoneNumber)}
        </NumberText>
        <Button size="small" full={false} onClick={() => setModal(true)}>
          변경하기
        </Button>
      </PhoneNumberContainer>

      {modal && (
        <PhoneNumberModal
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

const PhoneNumberContainer = styled.div`
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

export default PhoneNumber;
