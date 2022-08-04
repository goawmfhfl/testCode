import styled from "styled-components";

import CreateShipmentTemplateModal from "./CreateShipmentTemplateModal";
import { modalVar, overModalVar } from "@cache/index";
import closeIconSource from "@icons/close.svg";

const ShipmentChargeTemplateModal = () => {
  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  const handleCreateShipmentTemplateButtonClick = () => {
    overModalVar({
      ...overModalVar(),
      isVisible: true,
      component: <CreateShipmentTemplateModal />,
    });
  };

  return (
    <Container>
      <CloseButton src={closeIconSource} onClick={handleCloseButtonClick} />

      <CreateShipmentTemplateButton
        onClick={handleCreateShipmentTemplateButtonClick}
      >
        배송 템플릿 만들기
      </CreateShipmentTemplateButton>

      <TemplateList>
        <tbody>
          <TemplateHeader>
            <TemplateCell>템플릿명</TemplateCell>
            <TemplateCell>등록일</TemplateCell>
          </TemplateHeader>

          <TemplateRow>
            <TemplateCell>기본 배송 설정</TemplateCell>
            <TemplateCell>2022. 07. 15</TemplateCell>
          </TemplateRow>
        </tbody>
      </TemplateList>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  width: 552px;
  height: 524px;

  position: relative;

  padding: 40px 24px 32px 24px;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;

  cursor: pointer;
  user-select: none;
`;

const CreateShipmentTemplateButton = styled.button`
  background-color: ${({ theme: { palette } }) => palette.grey700};
  color: ${({ theme: { palette } }) => palette.white};

  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  padding: 10px 16px;

  width: 127px;
  height: 32px;

  cursor: pointer;
  user-select: none;
`;

const TemplateList = styled.table`
  border-collapse: collapse;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

const TemplateRow = styled.tr`
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 14px;

  align-items: center;
  letter-spacing: 0.1px;

  & > td:first-child {
    width: 368px;
  }

  & > td:nth-child(2) {
    width: 136px;
  }
`;

const TemplateHeader = styled(TemplateRow)`
  background-color: ${({ theme: { palette } }) => palette.grey400};
  width: 504px;

  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
`;

const TemplateCell = styled.td`
  height: 40px;
  vertical-align: middle;
  text-align: center;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

export default ShipmentChargeTemplateModal;
