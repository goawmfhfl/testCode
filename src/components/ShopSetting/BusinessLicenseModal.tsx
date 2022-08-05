/* eslint-disable */
import { useFormContext } from "react-hook-form";
import styled from "styled-components";
import axios from "axios";

import closeIconSource from "@icons/close.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import { modalVar, systemModalVar } from "@cache/index";
import { businessLicenseVar } from "@cache/shopSettings";

const BusinessLicenseModal = () => {
  const { register, watch, resetField } = useFormContext();
  const watchFields = watch();
  const { businessNumber, ecommerceRegistrationNumber } = watchFields;

  const postBusinessLicense = async () => {
    try {
      // 사업자등록증, 혹은 통신판매업신고 번호를 입력하지 않았을 경우
      if (!businessNumber || !ecommerceRegistrationNumber) {
        systemModalVar({
          ...systemModalVar(),
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
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });
        return;
      }

      const parameter = {
        params: {
          ServiceKey: process.env.REACT_APP_BUSINESS_AUTHENTICATION_API_KEY,
          pageNo: 1,
          numOfRows: 10,
          resultType: "json",
          bizrno: businessNumber,
          prmsnMgtNo: ecommerceRegistrationNumber,
        },
      };

      // 사업자등록번호 : 882-87-01829
      // 통신판매업신고번호 : 2020-서울송파-3260
      const { data } = await axios.get(
        "http://apis.data.go.kr/1130000/MllBsDtlService/getMllBsInfoDetail",
        parameter
      );

      if (data?.items?.length === 0) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: <>기입한 정보가 올바르지 않습니다.</>,
          buttonText: "확인",
          hasMultiButton: false,
          handleConfirmButtonClick: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });
      } else {
        systemModalVar({
          ...systemModalVar(),
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
            modalVar({
              ...modalVar(),
              isVisible: false,
            });
            onConfirm(data.items[0]);
          },
          handleCancelButtonClick: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onConfirm = (items) => {
    businessLicenseVar({ ...items });
  };

  const onCancel = () => {
    resetField("businessNumber");
    resetField("ecommerceRegistrationNumber");

    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  return (
    <Container>
      <CloseButton
        src={closeIconSource}
        onClick={() =>
          modalVar({
            ...modalVar(),
            isVisible: false,
          })
        }
      />

      <Title>사업자등록증/통신판매업신고증 등록하기</Title>

      <NoticeContainer icon={exclamationmarkSrc}>
        전기통신매체, 광고물 등을 통해 소비자와 직접 상거래가 이루어지는 사업을
        하려면
        <br />
        통신판매업 신고를 해야 합니다.
      </NoticeContainer>

      <InfoContainer>
        <InputContainer>
          <SubTitle>사업자등록번호</SubTitle>
          <Input placeholder="숫자만 입력" {...register("businessNumber")} />
        </InputContainer>

        <InputContainer>
          <SubTitle>통신판매업신고 번호</SubTitle>
          <Input {...register("ecommerceRegistrationNumber")} />
        </InputContainer>
      </InfoContainer>

      <ButtonContainer>
        <Button
          type="button"
          size="small"
          full={false}
          className="positive"
          onClick={postBusinessLicense}
        >
          저장
        </Button>

        <Button size="small" full={false} onClick={onCancel}>
          취소
        </Button>
      </ButtonContainer>
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

const CloseButton = styled.img`
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

const InputContainer = styled.div`
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

export default BusinessLicenseModal;
