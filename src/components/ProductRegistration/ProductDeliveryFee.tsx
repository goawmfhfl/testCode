import styled from "styled-components";

import Checkbox from "@components/common/input/Checkbox";
import TextInput from "@components/common/input/TextInput";
import NoticeContainer from "@components/common/NoticeContainer";
import Dropdown from "@components/common/input/Dropdown";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import Button from "@components/common/Button";

const ProductDeliveryFee = () => {
  return (
    <Container>
      <CheckboxWrapper>
        <Checkbox /> 배송 설정하기
      </CheckboxWrapper>
      <NoticeContainerWrapper>
        <NoticeContainer icon={exclamationMarkSrc}>
          미설정시 배송은 샵 설정 내 기본 배송 정보를 따릅니다.
        </NoticeContainer>
      </NoticeContainerWrapper>
      <InputContainer>
        <InputContainer>
          <Label>배송 템플릿</Label>
          <DropdownWrapper>
            <Dropdown
              size="medium"
              options={["배송 템플릿 1", "배송 템플릿 2"]}
            />
          </DropdownWrapper>
          <Button size="small">배송 템플릿 만들기</Button>
        </InputContainer>
      </InputContainer>
      <InputContainer>
        <InputContainer>
          <Label>배송비 ●</Label>
          <DeliveryFeeInputContainer>
            <Dropdown
              size="medium"
              options={["배송비 옵션 1", "배송비 옵션 2"]}
            />
            <TextInputWrapper>
              <TextInput /> 원
            </TextInputWrapper>
          </DeliveryFeeInputContainer>
        </InputContainer>
      </InputContainer>

      <InputContainer>
        <InputContainer>
          <Label>제주 도서산간 추가 배송비 ●</Label>
          <TextInput /> 원
        </InputContainer>
      </InputContainer>
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
  width: 330px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;

  margin: 13px 0;
`;

const DropdownWrapper = styled.span`
  margin-right: 9px;
`;

const DeliveryFeeInputContainer = styled.div``;

const Label = styled.label`
  width: 230px;
`;

const TextInputWrapper = styled.div`
  margin-top: 9px;
`;

export default ProductDeliveryFee;
