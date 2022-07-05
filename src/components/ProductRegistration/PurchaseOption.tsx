import styled from "styled-components";

import NoticeContainer from "@components/common/NoticeContainer";
import exclamationMarkSrc from "@icons/exclamationmark.svg";

const PurchaseOption = () => {
  return (
    <>
      <PurchaseOptionCheckbox /> 옵션 설정하기
      <NoticeContainer icon={exclamationMarkSrc}>
        옵션값은 ‘쉼표'나 ‘쉼표'로 구분해주세요. 필수 체크 해제시 추가 옵션으로
        설정됩니다. 추가 옵션은 소비자가 필수로 선택하지 않아도 되는 옵션입니다.
      </NoticeContainer>
    </>
  );
};

const PurchaseOptionCheckbox = styled.div``;

export default PurchaseOption;
