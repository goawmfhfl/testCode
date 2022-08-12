import styled from "styled-components";
import Textarea from "@components/common/input/Textarea";
import { useFormContext } from "react-hook-form";

import NoticeContainer from "@components/common/NoticeContainer";
import exclamationmarkSrc from "@icons/exclamationmark.svg";

const ProductDescriptionSection = () => {
  const { register } = useFormContext();

  return (
    <div>
      <NoticeContainerWrapper>
        <NoticeContainer icon={exclamationmarkSrc} width="502px">
          상품에 관한 간략한 설명을 작성해주세요. 입력하신 내용은 상품페이지
          상단에 노출됩니다.
        </NoticeContainer>
      </NoticeContainerWrapper>

      <Textarea
        size="small"
        width={"716px"}
        height={"126px"}
        register={register("productDescription")}
      />
    </div>
  );
};

const NoticeContainerWrapper = styled.div`
  margin-bottom: 16px;
`;

export default ProductDescriptionSection;
