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
    representativeName: "",
    openingDate: "",
    businessNumber: ["", "", ""],
  });

  const { representativeName, openingDate, businessNumber } =
    businessInformation;

  const handleChangeInput =
    (inputName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputName.includes("businessNumber")) {
        const inputIndex = last(inputName.split("-"));

        setBusinessInformation(
          (prev: {
            representativeName: string;
            openingDate: string;
            businessNumber: Array<string>;
          }) => {
            const newBusinessNumber = [...prev.businessNumber];

            newBusinessNumber[inputIndex] = e.target.value;

            return {
              ...prev,
              ["businessNumber"]: [...newBusinessNumber],
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
      if (
        !representativeName ||
        !openingDate ||
        businessNumber.join("").length < 10
      ) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: <>입력값을 다시 확인해주세요.</>,
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

      // 1. 사업자등록정보 진위확인
      const result: {
        data: {
          data: Array<{
            b_no: string;
            valid: "01" | "02";
            valid_msg: string;
          }>;
        };
      } = await axios({
        url: "https://api.odcloud.kr/api/nts-businessman/v1/validate",
        method: "POST",
        params: {
          serviceKey: process.env.REACT_APP_BUSINESS_AUTHENTICATION_API_KEY,
        },
        data: JSON.stringify({
          businesses: [
            {
              b_no: businessNumber.join(""),
              start_dt: openingDate,
              p_nm: representativeName,
            },
          ],
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (result.data.data[0].valid === "02") {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: exclamationmarkSrc,
          description: <>유효하지 않은 정보입니다.</>,
          confirmButtonText: "확인",
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });

        loadingSpinnerVisibilityVar(false);

        return;
      }

      businessLicenseVar({
        ...businessLicenseVar(),
        representativeName, // 대표자명 고정
        businessRegistrationNumber: result.data.data[0].b_no, // 사업자등록번호 고정
      });

      // 2. 통신사업자 번호 확인 (통신판매업번호 파악)
      const parameter = {
        params: {
          serviceKey: process.env.REACT_APP_BUSINESS_AUTHENTICATION_API_KEY,
          pageNo: 1,
          numOfRows: 9999,
          resultType: "json",
          bizrno: businessNumber.join(""),
        },
      };

      const response = await axios.get(
        "https://apis.data.go.kr/1130000/MllBsDtlService/getMllBsInfoDetail",
        parameter
      );

      const { data } = response as {
        data:
          | {
              items: Array<{
                coNm: string;
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

      if (data?.items && data.items.length) {
        if (data.items[0]?.mngStateNm !== "정상영업") {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            icon: exclamationmarkSrc,
            description: <>유효하지 않은 사업자 등록 정보입니다.</>,
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
              등록되었습니다. <br />
              등록을 위해 확인 버튼을 눌러주세요.
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

            const latestBusinessLicense = data.items[0];

            const {
              coNm,
              bizrno,
              crno,
              simTxtnTrgtYnDesc,
              rdnAddr,
              prmsnMgtNo,
            } = latestBusinessLicense;

            businessLicenseVar({
              isConfirmed: true,
              representativeName: coNm,
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

        return;
      }

      // 3. 사업자등록 상태조회 확인 (간이과세자 여부 파악)
      const businessStatusResult: {
        data: {
          data: Array<{
            b_no: string;
            b_stt: string;
            b_stt_cd: string;
            tax_type: string;
            tax_type_cd: string;
          }>;
          match_cnt: number;
          request_cnt: number;
          status_code: string;
        };
      } = await axios({
        url: `https://api.odcloud.kr/api/nts-businessman/v1/status`,
        method: "POST",
        params: {
          serviceKey: process.env.REACT_APP_BUSINESS_AUTHENTICATION_API_KEY,
        },
        data: JSON.stringify({
          b_no: [businessNumber.join("")],
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const isSimplifiedTaxpayer =
        last(businessStatusResult.data.data).tax_type_cd === "02";

      if (isSimplifiedTaxpayer) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          icon: "",
          description: (
            <>
              간이사업자로 사업자정보가 <br />
              등록되었습니다. <br />
              등록을 위해 확인 버튼을 눌러주세요.
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

            businessLicenseVar({
              ...businessLicenseVar(),
              isConfirmed: true,
              corporateRegistrationNumber: "-",
              isSimpleTaxpayers: "대상",
              companyLocation: "-",
              onlineSalesLicense: "-",
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
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCancelButtonClick = () => {
    setBusinessInformation({
      representativeName: "",
      openingDate: "",
      businessNumber: ["", "", ""],
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
          <Label>대표자명</Label>
          <Input
            onChange={handleChangeInput("representativeName")}
            value={representativeName}
          />
        </InputContainer>

        <InputContainer>
          <Label>개업일자</Label>
          <Input
            onChange={handleChangeInput("openingDate")}
            value={openingDate}
            placeholder="YYYYMMDD"
            maxLength={8}
          />
        </InputContainer>

        <InputContainer>
          <Label>사업자등록번호</Label>

          <BusinessNumber>
            <Input
              onChange={handleChangeInput("businessNumber-0")}
              value={businessNumber[0]}
              maxLength={3}
            />
            -
            <Input
              onChange={handleChangeInput("businessNumber-1")}
              value={businessNumber[1]}
              maxLength={2}
            />
            -
            <Input
              onChange={handleChangeInput("businessNumber-2")}
              value={businessNumber[2]}
              maxLength={5}
            />
          </BusinessNumber>
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

  & > div {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
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

const BusinessNumber = styled.div`
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
