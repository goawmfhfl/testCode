import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";
import { last } from "lodash";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import DescriptionImage from "@components/productForm/descriptionImageSection/DescriptionImage";

import { UploadFileType } from "@models/index";
import { descriptionImagesVar } from "@cache/productForm/descriptionImages";
import { bytesToMegaBytes } from "@utils/index";

const ProductDescriptionSection = () => {
  const descriptionImages = useReactiveVar(descriptionImagesVar);

  useEffect(() => {
    if (last(descriptionImages).url) {
      descriptionImagesVar([
        ...descriptionImagesVar(),
        {
          id: uuidv4(),
          url: "",
          size: 0,
          type: UploadFileType.PRODUCT_DETAIL_PAGE,
        },
      ]);
    }
  }, [descriptionImages]);

  const totalSize = bytesToMegaBytes(
    descriptionImages.reduce(
      (total: number, { size }: { size: number }) => total + size,
      0
    )
  );

  return (
    <Container>
      <NoticeContainerWrapper>
        <NoticeContainer
          icon={exclamationmarkSrc}
          width="502px"
          isOneLiner={true}
        >
          권장 이미지 크기 : 가로 최대 1920px, 세로 제한 없음. <br />
          파일 크기 : 1장 당 10mb이고 장수에는 제한이 없으며 총합 50mb 등록 가능{" "}
          <br />
          업로드 가능한 파일 확장자 : jpg, jpeg, png <br />
          최소 1장 이상 업로드 필수 <br />※ 업로드된 이미지 순서대로
          상품상세페이지에 노출됩니다.
        </NoticeContainer>
      </NoticeContainerWrapper>

      <Capacity>업로드 가능 용량 {(50 - totalSize).toFixed(2)}MB</Capacity>

      <DescriptionImageList>
        {descriptionImages.map(({ id, url }) => {
          return <DescriptionImage key={id} id={id} url={url} />;
        })}
      </DescriptionImageList>
    </Container>
  );
};

const Container = styled.div``;

const NoticeContainerWrapper = styled.div`
  margin-bottom: 16px;
`;

const Capacity = styled.div`
  margin-bottom: 16px;
`;

const DescriptionImageList = styled.div`
  width: 756px;
  background-color: ${({ theme }) => theme.palette.grey100};

  display: flex;
  flex-wrap: wrap;

  padding: 4px;

  & > div {
    margin: 4px;
  }
`;

export default ProductDescriptionSection;
