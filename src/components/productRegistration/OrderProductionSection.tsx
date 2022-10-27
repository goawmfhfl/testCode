import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

import Checkbox from "@components/common/input/Checkbox";
import TextInput from "@components/common/input/TextInput";
import NoticeContainer from "@components/common/NoticeContainer";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import {
  HAS_MANUFACTURING_LEAD_TIME,
  LEAD_TIME_MIN,
  LEAD_TIME_MAX,
} from "@cache/productRegistration/index";

const OrderProduction = () => {
  const { register, watch } = useFormContext();

  return (
    <Container>
      <CheckboxWrapper>
        <Checkbox {...register(HAS_MANUFACTURING_LEAD_TIME)} /> 주문 후 제작
      </CheckboxWrapper>
      <NoticeContainerWrapper>
        <NoticeContainer icon={exclamationMarkSrc} width="539px">
          주문 확인 후 제작에 들어가는 상품이라면 ‘주문 후 제작'에 체크를 하고
          소요기간을 입력해주세요. <br />
          상품페이지에 노출되어 구매자들에게 상품 수령까지의 대략적인 기간을
          알려줄 수 있습니다.
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
