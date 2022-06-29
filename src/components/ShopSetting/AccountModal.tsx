import React from "react";
import styled from "styled-components";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import triangleSrc from "@icons/triangle.svg";
import NoticeContainer from "@components/Common/NoticeContainer";
import Button from "@components/Common/Button";
import Input from "@components/Common/Input";
import ValidText from "@components/Common/ValidText";

const AccountModal = () => {
  return (
    <Container>
      <Icon src={deleteSrc} />
      <Title>정산 계좌 등록하기</Title>
      <NoticeContainer icon={exclamationmarkSrc}>
        예금주명은 사업자등록증의 법인 명의(상호명)과 동일해야 합니다.
        <br />
        법인 명의와 예금주명 비교 로직에 따라 동일함이 확인될 경우 정산계좌 통장
        사본 제출은 생략 됩니다.
        <br /> (예금주명에 따라 비교가 어려울 경우 서류 제출이 필요합니다.)
      </NoticeContainer>
      <InfoContainer>
        <SelectContainer>
          <Option>은행선택</Option>
          <Option>신한은행</Option>
          <Option>우리은행</Option>
          <Option>카카오뱅크</Option>
          <Option>수협</Option>
        </SelectContainer>
        <UserAccountContainer>
          <Input placeholder="예금주명" />
          <Input placeholder="계좌번호 (-없이 입력)" />
          <Button size="small" full={false}>
            인증
          </Button>
          <ValidText valid={true}>인증되었습니다</ValidText>
          {/* <ValidText valid={false}>인증 실패하였습니다.</ValidText> */}
        </UserAccountContainer>
        <ValidText valid={true}>
          입력하신 계좌 정보가 실제 계좌 정보와 일치하지 않습니다.
          <br />
          입력하신 은행, 예금주, 계좌번호를 다시 한번 확인해주세요.
        </ValidText>
      </InfoContainer>
      <ButtonContainer>
        <Button size="small" full={false} className="positive">
          저장
        </Button>
        <Button size="small" full={false}>
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

  padding: 40px 24px 24px 24px;
  display: flex;
  flex-direction: column;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  & > h2 {
    margin-bottom: 24px;
  }
`;
const Icon = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;
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
// ButtonContainer
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  & > button {
    margin-right: 16px;

    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

export default AccountModal;
