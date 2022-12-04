import { useState } from "react";
import styled from "styled-components/macro";
import axios from "axios";
import { last } from "lodash";

import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import {
  loadingSpinnerVisibilityVar,
  modalVar,
  systemModalVar,
} from "@cache/index";
import { businessLicenseVar } from "@cache/shopSettings";

const BusinessLicenseModal = () => {
  const [businessInformation, setBusinessInformation] = useState({
    businessNumber: "",
    ecommerceNumber: ["", "", ""],
  });

  const { businessNumber, ecommerceNumber } = businessInformation;

  const handleChangeInput =
    (inputName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputName.includes("ecommerceNumber")) {
        const inputIndex = last(inputName.split("-"));

        setBusinessInformation(
          (prev: {
            businessNumber: string;
            ecommerceNumber: Array<string>;
          }) => {
            const newEcommerceNumber = [...prev.ecommerceNumber];

            newEcommerceNumber[inputIndex] = e.target.value;

            return {
              ...prev,
              ["ecommerceNumber"]: [...newEcommerceNumber],
            };
          }
        );

        return;
      }

      setBusinessInformation((prev) => ({
        ...prev,
        [inputName]: e.target.value,
      }));
    };

  const handleSaveButtonClick = async () => {
    try {
      // 사업자등록증, 혹은 통신판매업신고 번호를 입력하지 않았을 경우
      if (!businessNumber || !ecommerceNumber.join("")) {
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
          confirmButtonText: "확인",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });

        return;
      }

      loadingSpinnerVisibilityVar(true);

      const parameter = {
        params: {
          ServiceKey: process.env.REACT_APP_BUSINESS_AUTHENTICATION_API_KEY,
          pageNo: 1,
          numOfRows: 1,
          resultType: "json",
          bizrno: businessNumber,
          prmsnMgtNo: ecommerceNumber.join("-"),
        },
      };

      // 사업자등록번호 : 882-87-01829
      // 통신판매업신고번호 : 2020-서울송파-3260
      const response = await axios.get(
        "http://apis.data.go.kr/1130000/MllBsDtlService/getMllBsInfoDetail",
        parameter
      );

      const { data } = response as {
        data:
          | {
              items: Array<{
                rprsvNm: string;
                bizrno: string;
                crno: string;
                simTxtnTrgtYnDesc: string;
                rdnAddr: string;
                prmsnMgtNo: string;
                mngStateNm: string;
              }>;
            }
          | string;
      };

      loadingSpinnerVisibilityVar(false);

      if (typeof data === "string") {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              인증 서비스에 문제가 발생하였습니다.
              <br />
              찹스틱스로 문의해주시면
              <br />
              빠르게 조치하겠습니다.
              <br />
              (문의 전화 070-4187-3848)
            </>
          ),
        });

        console.log("인증 에러: ", data);

        return;
      }

      if (data?.items?.length === 0) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: <>기입한 정보가 올바르지 않습니다.</>,
          confirmButtonText: "확인",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });

        return;
      }

      if (data.items[0].mngStateNm !== "정상영업") {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: (
            <>
              유효하지 않은 정보입니다.
              <br />
              최신 정보를 입력해주세요.
            </>
          ),
          confirmButtonText: "확인",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });

        return;
      }

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
        confirmButtonVisibility: true,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });

          modalVar({
            ...modalVar(),
            isVisible: false,
          });

          const businessLicense = data.items[0];

          const {
            rprsvNm,
            bizrno,
            crno,
            simTxtnTrgtYnDesc,
            rdnAddr,
            prmsnMgtNo,
          } = businessLicense;

          businessLicenseVar({
            isConfirmed: true,
            representativeName: rprsvNm,
            businessRegistrationNumber: bizrno,
            corporateRegistrationNumber: crno,
            isSimpleTaxpayers: simTxtnTrgtYnDesc,
            companyLocation: rdnAddr,
            onlineSalesLicense: prmsnMgtNo,
          });
        },
        cancelButtonVisibility: true,
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCancelButtonClick = () => {
    setBusinessInformation({
      businessNumber: "",
      ecommerceNumber: ["", "", ""],
    });

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
          <Label>사업자등록번호</Label>
          <Input
            onChange={handleChangeInput("businessNumber")}
            value={businessNumber}
            placeholder="숫자만 입력"
          />
        </InputContainer>

        <InputContainer>
          <Label>통신판매업신고 번호</Label>

          <EcommerceNumber>
            <Input
              onChange={handleChangeInput("ecommerceNumber-0")}
              value={ecommerceNumber[0]}
              placeholder={"2022"}
            />
            -
            <Input
              onChange={handleChangeInput("ecommerceNumber-1")}
              value={ecommerceNumber[1]}
              placeholder={"서울종로"}
            />
            -
            <Input
              onChange={handleChangeInput("ecommerceNumber-2")}
              value={ecommerceNumber[2]}
              placeholder={"0138"}
            />
          </EcommerceNumber>
        </InputContainer>
      </InfoContainer>

      <ButtonContainer>
        <Button
          type="button"
          size="small"
          full={false}
          className="positive"
          // eslint-disable-next-line
          onClick={handleSaveButtonClick}
        >
          저장
        </Button>

        <Button size="small" full={false} onClick={handleCancelButtonClick}>
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
  margin-bottom: 32px;

  & > :first-child {
    margin-bottom: 16px;
  }
`;

const InputContainer = styled.div`
  height: 32px;
  display: flex;
  align-items: center;

  & > input {
    padding: 9px 8px 9px 8px;
    width: 168px;
    height: 32px;
  }
`;

const EcommerceNumber = styled.div`
  width: 200px;

  display: flex;
  align-items: center;

  & > input {
    width: 64px;
    height: 32px;
    margin: 0 8px;
    padding: 9px 8px 9px 8px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const Label = styled.label`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  white-space: nowrap;

  width: 152px;
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
