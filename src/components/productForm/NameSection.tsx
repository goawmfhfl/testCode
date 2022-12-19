import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import NoticeContainer from "@components/common/NoticeContainer";
import { Input as TextInput } from "@components/common/input/TextInput";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import { TITLE } from "@cache/productForm/index";

const ProductName = () => {
  const { register, watch, setValue } = useFormContext();

  const title = watch(TITLE) as string;

  return (
    <Container>
      <NoticeContainer
        icon={exclamationMarkSrc}
        width={"476px"}
        isOneLiner={true}
      >
        상품명은 100자까지 입력 가능하며 특수문자는 [ ] ( ) _ - + & / ; : ‘ “
        제외 불가합니다.
      </NoticeContainer>

      <TextInputWrapper>
        <TextInput
          {...register(TITLE)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            const regex = /[{}[\]?|*~`!^<>@#$%\\=]/g;

            const hasSpecialChars = regex.test(e.key);

            if (hasSpecialChars) {
              e.preventDefault();

              return;
            }
          }}
          onCompositionEnd={(e: React.CompositionEvent<HTMLInputElement>) => {
            const regex = /[{}[\]?|*~`!^<>@#$%\\=]/g;

            const previousValue = watch(TITLE) as string;

            if (regex.test(e.data)) {
              setValue(TITLE, previousValue.slice(0, previousValue.length - 1));
            }
          }}
          width={"689px"}
          maxLength={100}
        />
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
