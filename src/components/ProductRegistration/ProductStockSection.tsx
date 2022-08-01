import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import NoticeContainer from "@components/common/NoticeContainer";
import TextInput from "@components/common/input/TextInput";
import exclamationmarkSrc from "@icons/exclamationmark.svg";

const ProductStock = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <TextInput register={register("productStock")} /> 개
      <NoticeContainerWrapper>
        <NoticeContainer icon={exclamationmarkSrc}>
          옵션 설정시, 재고 입력란은 0으로 자동 적용되며, 옵션의 재고를
          따릅니다.
        </NoticeContainer>
      </NoticeContainerWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const NoticeContainerWrapper = styled.div`
  margin-left: 8px;
`;

export default ProductStock;
