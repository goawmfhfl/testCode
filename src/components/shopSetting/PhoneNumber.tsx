import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import PhoneNumberModal from "@components/shopSetting/PhoneNumberModal";
import Button from "@components/common/Button";

import { modalVar } from "@cache/index";
import { phoneNumberVar } from "@cache/shopSettings";

const PhoneNumber = () => {
  const phoneNumber = useReactiveVar(phoneNumberVar);

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

  const handleChangePhoneNumberButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: true,
      component: <PhoneNumberModal />,
    });
  };

  return (
    <Container>
      <PhoneNumberContainer>
        <NumberText>
          등록된 전화번호 : {hidePhoneNumber(phoneNumber)}
        </NumberText>

        <Button
          size="small"
          full={false}
          onClick={handleChangePhoneNumberButtonClick}
        >
          변경하기
        </Button>
      </PhoneNumberContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
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
