import styled from "styled-components";
import { useFormContext } from "react-hook-form";

import NoticeContainer from "@components/common/NoticeContainer";
import TextInput from "@components/common/input/TextInput";
import exclamationMarkSrc from "@icons/exclamationmark.svg";

const ProductName = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <NoticeContainer icon={exclamationMarkSrc}>
        상품명은 100자까지 입력 가능하며 특수문자를 포함할 수 없습니다.
      </NoticeContainer>
      <TextInputWrapper>
        <TextInput register={register("title")} width={"540px"} />
      </TextInputWrapper>
    </Container>
  );
};

const Container = styled.div``;

const TextInputWrapper = styled.div`
  margin-top: 10px;
`;

export default ProductName;
