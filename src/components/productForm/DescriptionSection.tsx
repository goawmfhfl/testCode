import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import Textarea from "@components/common/input/Textarea";
import NoticeContainer from "@components/common/NoticeContainer";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import { PRODUCT_DESCRIPTION } from "@cache/productForm/index";

const ProductDescriptionSection = () => {
  const { register } = useFormContext();

  return (
    <div>
      <NoticeContainerWrapper>
        <NoticeContainer
          icon={exclamationmarkSrc}
          width="502px"
          isOneLiner={true}
        >
          상품에 관한 간략한 설명을 작성해주세요. 입력하신 내용은 상품페이지
          상단에 노출됩니다.
        </NoticeContainer>
      </NoticeContainerWrapper>

      <Textarea
        size="small"
        width={"757px"}
        height={"120px"}
        register={register(PRODUCT_DESCRIPTION)}
        placeholder={
          "상품에 관한 상세 설명을 작성해주세요. ‘- (대쉬)’는 ‘・(글머리 기호)’로 나옵니다."
        }
      />
    </div>
  );
};

const NoticeContainerWrapper = styled.div`
  margin-bottom: 16px;
`;

export default ProductDescriptionSection;
