import styled, { useTheme } from "styled-components";

import Button from "@components/common/Button";

const SaveBar = () => {
  const theme = useTheme();

  return (
    <Container>
      <ButtonContainer>
        <Button
          size="big"
          color={theme.palette.white}
          backgroundColor={theme.palette.grey700}
        >
          임시 저장
        </Button>
        <Button
          size="big"
          color={theme.palette.white}
          backgroundColor={theme.palette.red900}
        >
          저장
        </Button>
        <Button size="big">취소</Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100vw;
  height: 72px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  background-color: #fff;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-right: 30px;
`;

export default SaveBar;
