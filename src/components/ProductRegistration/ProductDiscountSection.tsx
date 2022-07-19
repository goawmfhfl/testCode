import styled from "styled-components";
import { useFormContext } from "react-hook-form";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";
import DateInput from "@components/common/input/DateInput";
import Checkbox from "@components/common/input/Checkbox";

const ProductDiscount = () => {
  const { register } = useFormContext();

  const discountedPrice = "-";

  return (
    <Container>
      <InputContainer>
        <TextInput register={register("discountValue")} />
        <DropdownWrapper>
          {/* Dropdown name="discountUnit" */}
          <Dropdown
            size={"medium"}
            options={["%", "₩"]}
            register={register("discountOption")}
          />
        </DropdownWrapper>
        할인
        <DiscountCheckbox name="" id="" /> 기간할인 설정하기
      </InputContainer>

      <CalendarContainer>
        <StartAt />
        ~
        <EndAt />
      </CalendarContainer>

      <HorizontalLine />

      <DiscountedPrice>
        최종 가격
        <PriceWrapper>{discountedPrice}</PriceWrapper>
        <DiscountTimespanNotification>
          (2022.02.06 부터 2022.02.16 까지 할인됩니다.)
        </DiscountTimespanNotification>
      </DiscountedPrice>
    </Container>
  );
};

const Container = styled.div``;

const InputContainer = styled.div`
  display: flex;
  align-items: center;

  font-family: "SpoqaHanSansNeo";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
`;

const DropdownWrapper = styled.span`
  margin-right: 8px;
`;

const DiscountCheckbox = styled(Checkbox)`
  margin-left: 24px;
  margin-right: 8px;
`;

const CalendarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
`;

const StartAt = styled(DateInput)`
  margin-right: 16px;
`;
const EndAt = styled(DateInput)`
  margin-left: 16px;
`;

const HorizontalLine = styled.div`
  height: 1px;
  margin: 24px 0px;
  background-color: ${({ theme: { palette } }) => palette.grey500}; ;
`;

const DiscountedPrice = styled.div`
  font-family: "SpoqaHanSansNeo";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
  letter-spacing: 0.1px;
`;

const PriceWrapper = styled.span`
  font-family: "SpoqaHanSansNeo";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;

  margin-left: 65px;
  margin-right: 8px;
`;

const DiscountTimespanNotification = styled.span`
  font-family: "SpoqaHanSansNeo";
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

export default ProductDiscount;
