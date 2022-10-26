import styled from "styled-components/macro";

import RequiredImages from "@components/productRegistration/ImageSection/RequiredImages";
import OptionalImages from "@components/productRegistration/ImageSection/OptionalImages";
import NoticeContainer from "@components/common/NoticeContainer";

import exclamationMarkSrc from "@icons/exclamationmark.svg";

const ProductImageSection = () => {
  return (
    <Container>
      <NoticeContainerWrapper>
        <NoticeContainer icon={exclamationMarkSrc}>
          권장 이미지 크기 : 750 x 750 (px), 파일 크기 : 1장 당 2mb, 등록 가능
          파일 확장자 : jpg, jpeg, png <br /> 최소 5장, 최대 20장 까지 등록
          가능하며 첫 번째로 등록된 사진이 썸네일로 지정됩니다.
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
