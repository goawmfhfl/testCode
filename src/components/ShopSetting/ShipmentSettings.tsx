import { useFormContext } from "react-hook-form";
import styled from "styled-components/macro";

import TextInput from "@components/common/input/TextInput";
import Dropdown from "@components/common/input/Dropdown";

const ShipmentSettings = () => {
  const { register } = useFormContext();

  return (
    <OrderInfoContainer>
      <OrderFeeContainer>
        <OrderInfoText>기본 배송비</OrderInfoText>
        <ContentContainer>
          <Dropdown
            size="medium"
            register={register("shipmentType")}
            options={["유료", "무료"]}
          />
          <TextInput register={register("shipmentPrice")} />
          <KrwText>원</KrwText>
        </ContentContainer>
      </OrderFeeContainer>
      <OrderFeeContainer>
        <OrderInfoText>기본 제주 도서산간 추가 배송비</OrderInfoText>
        <ContentContainer>
          <TextInput register={register("shipmentDistantPrice")} />
          <KrwText>원</KrwText>
        </ContentContainer>
      </OrderFeeContainer>
    </OrderInfoContainer>
  );
};

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;

  & > :first-child {
    margin-bottom: 24px;
  }
`;

const OrderFeeContainer = styled.div`
  display: flex;

  & > h3 {
    width: 234px;
  }
`;

const OrderInfoText = styled.h3`
  display: flex;
  align-items: center;

  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 8px;

  & > input {
    width: 104px;
    height: 32px;
  }
`;

const KrwText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
`;

export default ShipmentSettings;
