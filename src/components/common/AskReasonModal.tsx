import React, { useEffect } from "react";
import styled from "styled-components/macro";

import { reasonVar } from "@cache/sale";
import { modalVar } from "@cache/index";

import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import Button from "@components/common/Button";
import NoticeContainer from "@components/common/NoticeContainer";
import Textarea from "@components/common/input/Textarea";
import { useReactiveVar } from "@apollo/client";
import { MainReason } from "@constants/sale";

interface AskReasonModalType {
  option: Array<{
    id: number;
    label: string;
    value: string;
  }>;
  handleSubmitButtonClick: () => void;
}

const AskReasonModal = ({
  option,
  handleSubmitButtonClick,
}: AskReasonModalType) => {
  const { mainReason, detailedReason } = useReactiveVar(reasonVar);

  const changeReasonHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    reasonVar({
      ...reasonVar(),
      mainReason: e.target.value as MainReason,
    });
  };

  const changeDetailReasonHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    reasonVar({
      ...reasonVar(),
      detailedReason: e.target.value,
    });
  };

  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  useEffect(() => {
    return () => {
      reasonVar({
        mainReason: MainReason.DEFAULT,
        detailedReason: "",
      });
    };
  }, []);

  return (
    <Container>
      <CloseButton onClick={handleCloseButtonClick} src={closeIconSource} />
      <Title>반품 처리하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"392px"}>
        • &nbsp;반품 처리 전 반드시 소비자와 합의 후 처리해주시길 바랍니다.
        <br />• &nbsp;수거완료 후 환불 처리시 선택된 대표사유에 의해 환불금액이
        <br />
        &nbsp;&nbsp;&nbsp;결정되니 환불비용을 따로 청구하지 말아주세요.
      </NoticeContainer>
      <ReasonContainer>
        <Label>대표사유</Label>
        <ReasonDropdown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"160px"}
          value={mainReason}
          onChange={changeReasonHandler}
        >
          <Option value={MainReason.DEFAULT} hidden>
            사유를 선택해주세요
          </Option>
          {option.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </ReasonDropdown>
      </ReasonContainer>
      <ReasonContainer>
        <Label>상세 사유</Label>
        <Textarea
          width="376px"
          height="88px"
          size="small"
          onChange={changeDetailReasonHandler}
        />
      </ReasonContainer>

      <ButtonContainer>
        <StyledButton
          size={"small"}
          width={"55px"}
          onClick={handleSubmitButtonClick}
          disabled={mainReason === MainReason.DEFAULT || !detailedReason}
        >
          확인
        </StyledButton>
        <Button size={"small"} width={"55px"} onClick={handleCloseButtonClick}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  min-width: 440px;

  padding: 40px 24px 24px 24px;
  background-color: ${({ theme: { palette } }) => palette.white};
`;

const CloseButton = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;

  width: 24px;
  height: 24px;

  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 24px;

  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

const ReasonContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 24px;
`;

const Label = styled.span`
  margin-bottom: 16px;

  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 32px;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;

const ReasonDropdown = styled(Dropdown)`
  padding-right: 0;
`;

export default AskReasonModal;
