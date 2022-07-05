import styled from "styled-components";

import Dropdown from "@components/common/input/Dropdown";
import NoticeContainer from "@components/common/NoticeContainer";
import exclamationMarkSrc from "@icons/exclamationmark.svg";

const ProductCategory = () => {
  return (
    <Container>
      <NoticeContainer icon={exclamationMarkSrc}>
        카테고리는 하나만 설정 가능합니다. <br /> 상품과 어울리지 않는
        카테고리에 등록할 경우, 강제 이동되거나 판매보류 될 수 있습니다.
      </NoticeContainer>
      <DropdownContainer>
        <Dropdown size={"big"} options={["대분류 1", "대분류 2", "대분류 3"]} />
        <Dropdown size={"big"} options={["중분류 1", "중분류 2", "중분류 3"]} />
        <Dropdown size={"big"} options={["소분류 1", "소분류 2", "소분류 3"]} />
      </DropdownContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const DropdownContainer = styled.div``;

export default ProductCategory;
