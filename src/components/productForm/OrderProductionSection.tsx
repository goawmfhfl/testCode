import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import Checkbox from "@components/common/input/Checkbox";
import TextInput from "@components/common/input/TextInput";
import NoticeContainer from "@components/common/NoticeContainer";
import exclamationMarkSrc from "@icons/exclamation-grey.svg";
import {
  HAS_MANUFACTURING_LEAD_TIME,
  LEAD_TIME_MIN,
  LEAD_TIME_MAX,
} from "@cache/productForm/index";

const OrderProduction = () => {
  const { register, watch } = useFormContext();

  return (
    <Container>
      <CheckboxWrapper>
        <Checkbox {...register(HAS_MANUFACTURING_LEAD_TIME)} /> 주문 후 제작
      </CheckboxWrapper>
      <NoticeContainerWrapper>
        <NoticeContainer
          icon={exclamationMarkSrc}
          width="610px"
          isOneLiner={true}
        >
          주문 폭주, 브랜드 휴가, 예약 발송 등의 이유로 출고가 늦어질 경우 일시
          품절 대신 해당 기능을 사용하면 좋습니다.
        </NoticeContainer>
      </NoticeContainerWrapper>
      제작 기간 최소{" "}
      <TextInputWrapper>
        <TextInput
          width={"104px"}
          register={register(LEAD_TIME_MIN)}
          textAlign="right"
          disabled={!watch(HAS_MANUFACTURING_LEAD_TIME)}
          numbersOnly={true}
        />
      </TextInputWrapper>
      일에서 최대{" "}
      <TextInputWrapper>
        <TextInput
          width={"104px"}
          register={register(LEAD_TIME_MAX)}
          textAlign="right"
          disabled={!watch(HAS_MANUFACTURING_LEAD_TIME)}
          numbersOnly={true}
        />
      </TextInputWrapper>
      일까지 소요
    </Container>
  );
};

const Container = styled.div``;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 14px;

  & > input {
    margin-right: 16px;
  }
`;

const NoticeContainerWrapper = styled.div`
  margin: 12px 0;
`;

const TextInputWrapper = styled.span`
  margin-left: 24px;
`;

export default OrderProduction;
