import styled from "styled-components/macro";

import RequiredImages from "@components/productForm/imageSection/RequiredImages";
import OptionalImages from "@components/productForm/imageSection/OptionalImages";
import NoticeContainer from "@components/common/NoticeContainer";

import exclamationMarkSrc from "@icons/exclamationmark.svg";

const ProductImageSection = () => {
  return (
    <Container>
      <NoticeContainerWrapper>
        <NoticeContainer icon={exclamationMarkSrc} width={"300px"}>
          권장 이미지 크기 : 750 x 750 (px) <br />
          파일 크기 : 1장 당 최대 2mb <br />
          등록 가능 파일 확장자 : jpg, jpeg, png <br />
          이미지 최소 5장, 최대 10장 등록 가능합니다. <br />
        </NoticeContainer>
      </NoticeContainerWrapper>

      <RequiredImages />
      <OptionalImages />
    </Container>
  );
};

const Container = styled.div``;

const NoticeContainerWrapper = styled.div`
  width: 547px;
`;

export default ProductImageSection;
