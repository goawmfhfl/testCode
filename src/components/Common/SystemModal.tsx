import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import { systemModalVar } from "@cache/index";
import Button from "@components/common/Button";

const SystemModal = () => {
  const {
    icon,
    description,
    confirmButtonText,
    confirmButtonVisibility,
    confirmButtonClickHandler,
    cancelButtonText,
    cancelButtonVisibility,
    cancelButtonClickHandler,
  } = useReactiveVar(systemModalVar);

  const hasAllButtons = confirmButtonVisibility && cancelButtonVisibility;

  return (
    <Container>
      {icon && <Icon src={icon} />}
      <Text>{description}</Text>

      <ButtonWrapper>
        {confirmButtonVisibility && (
          <Button
            type="button"
            size="small"
            full={false}
            className={hasAllButtons && "positive"}
            onClick={confirmButtonClickHandler}
            autoFocus={true}
          >
            {confirmButtonText}
          </Button>
        )}
        {cancelButtonVisibility && (
          <Button
            type="button"
            size="small"
            full={false}
            onClick={cancelButtonClickHandler}
          >
            {cancelButtonText}
          </Button>
        )}
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateY(-50%);
  z-index: 100;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 279px;
  padding: 20px 0px;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  & > img {
    width: 24px;
    height: 24px;
    margin-bottom: 7px;
  }

  & > span {
    margin-bottom: 16px;
  }
`;

const Text = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.1px;
`;
const Icon = styled.img``;

const ButtonWrapper = styled.div`
  display: flex;

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;

  & > :first-child {
    margin-right: 16px;
  }
`;

export default SystemModal;
