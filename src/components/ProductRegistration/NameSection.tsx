import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import NoticeContainer from "@components/common/NoticeContainer";
import TextInput from "@components/common/input/TextInput";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import { TITLE } from "@cache/productRegistration/index";

const ProductName = () => {
  const { register, watch } = useFormContext();

  const title = watch(TITLE) as string;

  return (
    <Container>
      <NoticeContainer
        icon={exclamationMarkSrc}
        width={"396px"}
        isOneLiner={true}
      >
        상품명은 100자까지 입력 가능하며 특수문자를 포함할 수 없습니다.
      </NoticeContainer>

      <TextInputWrapper>
        <TextInput register={register(TITLE)} width={"689px"} maxLength={100} />
        <TextLength>{title?.length}/100</TextLength>
      </TextInputWrapper>
    </Container>
  );
};

const Container = styled.div``;

const TextInputWrapper = styled.div`
  margin-top: 10px;
`;

const TextLength = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.015em;
  text-align: left;
`;

export default ProductName;
