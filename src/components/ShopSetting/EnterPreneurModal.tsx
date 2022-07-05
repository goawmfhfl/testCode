/* eslint-disable */
import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useFormContext } from "react-hook-form";

import deleteSrc from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark-red.svg";
import NoticeContainer from "@components/Common/NoticeContainer";
import SystemModal from "@components/Common/SystemModal";
import Input from "@components/Common/Input";
import Button from "@components/Common/Button";

import { EnterPreneurInfoType } from "@components/ShopSetting/EnterPreneur";

interface EnterPreneurModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  setEnterPreneurInfo: Dispatch<SetStateAction<EnterPreneurInfoType>>;
}

const EnterPreneurModal = ({
  setModal,
  setEnterPreneurInfo,
}: EnterPreneurModalProps) => {
  const [systemModal, setSystemModal] = useState<{
    isVisible: boolean;
    icon: string;
    description: React.ReactNode;
    buttonText: string;
    hasMultiButton: boolean;
    handleConfirmButtonClick?: () => void;
    handleCancelButtonClick?: () => void;
  }>({
    isVisible: false,
    icon: "",
    description: <></>,
    buttonText: "",
    hasMultiButton: true,
    handleConfirmButtonClick: () =>
      setSystemModal((prev) => ({
        ...prev,
        isVisible: false,
      })),
  });

  const { register, watch, resetField } = useFormContext();
  const watchFields = watch();
  const { bizrno, prmsnMgtNo } = watchFields;

  const postEnterPreneur = async () => {
    if (!bizrno || !prmsnMgtNo) {
      setSystemModal((prev) => ({
        ...prev,
        isVisible: true,
        icon: exclamationmarkSrc,
        description: (
          <>
            사업자등록번호와 통신판매업신고 번호를
            <br /> 모두 입력해주세요.
          </>
        ),
        buttonText: "확인",
        hasMultiButton: false,
        handleConfirmButtonClick: () => {
          setSystemModal((prev) => ({
            ...prev,
            isVisible: false,
          }));
        },
      }));

      return;
    }

    const parameter = {
      params: {
        ServiceKey:
          "M9GeLCBRxbhAJt3QlWNEGLQAYdLqjtZm+JhsJcjYIUm62vaFl/7oJZXUjdMg5kz9KosBdLsSUT24ojG+eZhGTA==",
        pageNo: 1,
        numOfRows: 1,
        resultType: "json",
        bizrno,
        prmsnMgtNo,
      },
    };

    const { data } = await axios.get(
      "http://apis.data.go.kr/1130000/MllBsDtlService/getMllBsInfoDetail",
      parameter
    );

    if (data?.items?.length !== 0) {
      setSystemModal((prev) => ({
        ...prev,
        isVisible: true,
        icon: "",
        description: (
          <>
            사업자등록증과 통신판매업신고증이 <br />
            등록되었습니다.
          </>
        ),
        hasMultiButton: true,
        handleConfirmButtonClick: () => {
          setModal(false);

          onConfirm(data.items[0]);
        },
        handleCancelButtonClick: () => {
          setSystemModal((prev) => ({
            ...prev,
            isVisible: false,
          }));
        },
      }));
    } else {
      setSystemModal((prev) => ({
        ...prev,
        isVisible: true,
        icon: exclamationmarkSrc,
        description: <>기입한 정보가 올바르지 않습니다.</>,
        buttonText: "확인",
        hasMultiButton: false,
        handleConfirmButtonClick: () => {
          setSystemModal((prev) => ({
            ...prev,
            isVisible: false,
          }));
        },
      }));
    }
  };

  const onConfirm = async (items: SetStateAction<EnterPreneurInfoType>) => {
    setEnterPreneurInfo(items);
  };

  const onCancel = () => {
    resetField("bizrno");
    resetField("prmsnMgtNo");

    setModal(false);
  };

  // 8828701829
  // 2020-서울송파-3260

  console.log(systemModal);

  return (
    <Container>
      <Icon src={deleteSrc} onClick={() => setModal(false)} />
      <Title>사업자등록증/통신판매업신고증 등록하기</Title>
      <NoticeContainer icon={exclamationmarkSrc}>
        전기통신매체, 광고물 등을 통해 소비자와 직접 상거래가 이루어지는 사업을
        하려면
        <br />
        통신판매업 신고를 해야 합니다.
      </NoticeContainer>
      <InfoContainer>
        <FillCodeContainer>
          <SubTitle>사업자등록번호</SubTitle>
          <Input placeholder="숫자만 입력" {...register("bizrno")} />
        </FillCodeContainer>
        <FillCodeContainer>
          <SubTitle>통신판매업신고 번호</SubTitle>
          <Input {...register("prmsnMgtNo")} />
        </FillCodeContainer>
      </InfoContainer>
      <ButtonContainer>
        <Button
          type="button"
          size="small"
          full={false}
          className="positive"
          onClick={() => postEnterPreneur()}
        >
          저장
        </Button>
        <Button size="small" full={false} onClick={onCancel}>
          취소
        </Button>
      </ButtonContainer>
      {systemModal.isVisible && (
        <SystemModal {...systemModal}>{systemModal.description}</SystemModal>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;

  display: flex;
  flex-direction: column;

  width: 530px;
  padding: 40px 24px 24px 24px;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  background-color: ${({ theme: { palette } }) => palette.white};
  box-shadow: ${({ theme: { shadow } }) => shadow.boxShadow};

  & > h2 {
    margin-bottom: 24px;
  }

  & > h2 + div {
    margin-bottom: 24px;
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

const Icon = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 320px;
  margin-bottom: 32px;

  & > :first-child {
    margin-bottom: 16px;
  }
`;

const FillCodeContainer = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > input {
    padding: 9px 8px 9px 8px;
    width: 168px;
    height: 32px;
  }
`;

const SubTitle = styled.h3`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  & > button:first-child {
    margin-right: 16px;
  }

  & > button {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

export default EnterPreneurModal;
