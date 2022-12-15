import React, { useEffect } from "react";
import styled from "styled-components";

import { reasonVar } from "@cache/sale";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import Button from "@components/common/Button";
import { modalVar } from "@cache/index";

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
  const changeReasonHandler =
    () => (e: React.ChangeEvent<HTMLSelectElement>) => {
      reasonVar(e.target.value);
    };

  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  useEffect(() => {
    return () => {
      reasonVar("");
    };
  }, []);

  return (
    <Container>
      <Dropdown
        arrowSrc={triangleArrowSvg}
        sizing={"medium"}
        width={"119px"}
        value={"default"}
        onChange={changeReasonHandler}
      >
        <Option value={"default"} hidden>
          사유를 선택해주세요
        </Option>
        {option.map(({ id, label, value }) => (
          <Option value={value} key={id}>
            {label}
          </Option>
        ))}
      </Dropdown>

      <ButtonContainer>
        <Button size={"small"} width={"55px"} onClick={handleSubmitButtonClick}>
          확인
        </Button>
        <Button size={"small"} width={"55px"} onClick={handleCloseButtonClick}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div``;
const ButtonContainer = styled.div``;

export default AskReasonModal;
