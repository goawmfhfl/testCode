import { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

import { Medium as InputMedium } from "@components/common/input/Input";
import Button from "@components/common/Button";

import { inputVar, isAuthenticatedVar } from "@cache/password";
import { validatePassword } from "@utils/index";
import {
  CHANGE_PASSWORD,
  ChangePasswordResult,
  ChangePasswordInput,
} from "@graphql/mutations/changePassword";
import { systemModalVar } from "@cache/index";
import { useNavigate } from "react-router-dom";
import { Pathnames } from "@constants/index";

const NewPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [changePassword] =
    useMutation<ChangePasswordResult, ChangePasswordInput>(CHANGE_PASSWORD);

  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangePasswordButtonClick = async () => {
    if (!!password.length && !validatePassword(password)) {
      setIsValidPassword(false);

      return;
    }

    const result = await changePassword({
      variables: {
        input: {
          email: inputVar().email,
          password,
        },
      },
    });

    if (result.data.changePassword.ok) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            비밀번호 변경이 <br />
            완료되었습니다.
          </>
        ),
        confirmButtonClickHandler: () => {
          navigate(Pathnames.Login);

          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });

      return;
    }
  };

  useEffect(() => {
    systemModalVar({
      ...systemModalVar(),
      isVisible: false,
      confirmButtonVisibility: true,
      confirmButtonText: "확인",
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
      cancelButtonVisibility: false,
    });
  }, []);

  return (
    <Container>
      <Restriction>영문 + 숫자 + 특수문자 조합 8~16 자리</Restriction>
      <InputMedium
        type="password"
        placeholder="변경할 비밀번호"
        width="400px"
        value={password}
        onChange={handlePasswordChange}
        onFocus={() => setIsValidPassword(true)}
      />

      {!isValidPassword && (
        <InvalidPassword>더 안전한 비밀번호를 설정해주세요.</InvalidPassword>
      )}

      <ButtonWrapper>
        <Button
          size="big"
          width="100%"
          backgroundColor={theme.palette.grey700}
          color={"white"}
          disabled={!isAuthenticated || !password.length}
          // eslint-disable-next-line
          onClick={handleChangePasswordButtonClick}
        >
          변경하기
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 102px;
`;

const Message = styled.div`
  ${({ theme }) => theme.typo.korean.caption.primary.basic};
`;

const Restriction = styled(Message)`
  margin-bottom: 12px;
`;

const InvalidPassword = styled(Message)`
  color: red;
  margin-top: 12px;
`;

const ButtonWrapper = styled.div`
  margin-top: 48px;
`;

export default NewPassword;
