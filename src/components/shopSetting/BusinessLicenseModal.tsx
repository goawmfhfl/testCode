import { useState } from "react";
import styled from "styled-components/macro";
import axios from "axios";
import { last } from "lodash";
import { compareDesc } from "date-fns";

import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import NoticeContainer from "@components/common/NoticeContainer";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import {
  loadingSpinnerVisibilityVar,
  modalVar,
  saveShopButtonRefVar,
  systemModalVar,
} from "@cache/index";
import { businessLicenseVar } from "@cache/shopSettings";
import { preventNaNValues } from "@utils/index";
import { showHasServerErrorModal } from "@cache/productManagement/index";

interface Props {
  preventCancel?: boolean;
}

const BusinessLicenseModal = ({ preventCancel }: Props) => {
  const [businessInformation, setBusinessInformation] = useState({
    representativeName: "",
    openingDate: "",
    businessNumber: ["", "", ""],
    businessName: "",
    location: "",
  });

  const {
    representativeName,
    openingDate,
    businessNumber,
    businessName,
    location,
  } = businessInformation;

  const handleChangeInput =
    (inputName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputName.includes("businessNumber")) {
        const inputIndex = last(inputName.split("-"));

        setBusinessInformation(
          (prev: {
            representativeName: string;
            openingDate: string;
            businessNumber: Array<string>;
            businessName: string;
            location: string;
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
      loadingSpinnerVisibilityVar(true);

      // 1. ????????????????????? ????????????
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
          description: (
            <>
              ????????????, ????????????, ????????????????????? ??? <br />
              ???????????? ?????? ????????? ????????????. <br />
              ?????? ??????????????????.
            </>
          ),
          confirmButtonText: "??????",
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

      // 2. ??????????????? ?????? ?????? (????????????????????? ??????)
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
                prmsnYmd: string;
              }>;
            }
          | string;
      };

      console.log(data);

      loadingSpinnerVisibilityVar(false);

      if (typeof data === "string") {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              ?????? ???????????? ????????? ?????????????????????.
              <br />
              ??????????????? ??????????????????
              <br />
              ????????? ?????????????????????.
              <br />
              (?????? ?????? 070-4187-3848)
            </>
          ),
        });

        console.log("?????? ??????: ", data);

        return;
      }

      if (data?.items && data.items.length) {
        data.items.sort((a, b) => {
          return compareDesc(
            new Date(
              Number(a.prmsnYmd.slice(0, 4)),
              Number(a.prmsnYmd.slice(4, 6)),
              Number(a.prmsnYmd.slice(0, 4))
            ),
            new Date(
              Number(b.prmsnYmd.slice(0, 4)),
              Number(b.prmsnYmd.slice(4, 6)),
              Number(b.prmsnYmd.slice(0, 4))
            )
          );
        });

        if (data.items[0]?.mngStateNm === "????????????") {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            icon: "",
            description: (
              <>
                ????????????????????? ??????????????????????????? <br />
                ?????????????????????.
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

              const { bizrno, crno, simTxtnTrgtYnDesc, prmsnMgtNo } =
                latestBusinessLicense;

              businessLicenseVar({
                isConfirmed: true,
                representativeName,
                businessName,
                businessRegistrationNumber: bizrno,
                corporateRegistrationNumber: crno,
                isSimpleTaxpayers: simTxtnTrgtYnDesc,
                companyLocation: location,
                onlineSalesLicense: prmsnMgtNo,
              });

              // save button ref . click
              if (preventCancel) {
                saveShopButtonRefVar().click();
              }
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
      }

      // 3. ??????????????? ???????????? ?????? (??????????????? ????????? ?????? ???????????? ??????, ??????????????? ?????? ??????)
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
              ????????????????????? <br />
              ?????????????????????.
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
              isConfirmed: true,
              representativeName,
              businessName,
              businessRegistrationNumber: businessNumber.join(""),
              corporateRegistrationNumber: "?????? ??????",
              isSimpleTaxpayers: "??????",
              companyLocation: location,
              onlineSalesLicense: "?????? ??????",
            });

            // save button ref . click
            if (preventCancel) {
              saveShopButtonRefVar().click();
            }
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

      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        icon: "",
        description: (
          <>
            ????????????????????? <br />
            ?????????????????????.
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
            isConfirmed: true,
            representativeName,
            businessName,
            businessRegistrationNumber: businessNumber.join(""),
            corporateRegistrationNumber: "?????? ??????",
            isSimpleTaxpayers: "?????? ??????",
            companyLocation: location,
            onlineSalesLicense: "?????? ??????",
          });

          // save button ref . click
          if (preventCancel) {
            saveShopButtonRefVar().click();
          }
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

      showHasServerErrorModal("", "????????? ?????? ??????");
    }
  };

  const handleCancelButtonClick = () => {
    setBusinessInformation({
      representativeName: "",
      openingDate: "",
      businessNumber: ["", "", ""],
      businessName: "",
      location: "",
    });

    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  const hasInputFulfilled =
    Boolean(representativeName) &&
    Boolean(openingDate) &&
    businessNumber.join("").length === 10 &&
    Boolean(businessName) &&
    Boolean(location);
  return (
    <Container>
      {!preventCancel && (
        <CloseButton
          src={closeIconSource}
          onClick={() =>
            modalVar({
              ...modalVar(),
              isVisible: false,
            })
          }
        />
      )}

      <Title>??????????????????/???????????????????????? ????????????</Title>

      {preventCancel ? (
        <NoticeContainer icon={exclamationmarkSrc}>
          ?????????????????? ?????? ????????? ?????? ?????????????????????. ?????? ???????????? ??????
          ????????? ???????????? <br />
          ?????? ???????????? ?????? ?????? ?????? ?????????????????? ????????? ????????? ????????????
          ????????????.
        </NoticeContainer>
      ) : (
        <NoticeContainer icon={exclamationmarkSrc}>
          ??????????????????, ????????? ?????? ?????? ???????????? ?????? ???????????? ???????????????
          ????????? ?????????
          <br />
          ??????????????? ????????? ?????? ?????????.
        </NoticeContainer>
      )}

      <InfoContainer>
        <InputContainer>
          <Label>?????????(?????????)</Label>
          <Input
            onChange={handleChangeInput("businessName")}
            value={businessName}
          />
        </InputContainer>

        <InputContainer>
          <Label>????????????</Label>
          <Input
            onChange={handleChangeInput("representativeName")}
            value={representativeName}
          />
        </InputContainer>

        <InputContainer>
          <Label>????????????</Label>
          <Input
            onChange={handleChangeInput("openingDate")}
            value={openingDate}
            placeholder="YYYYMMDD"
            maxLength={8}
            onKeyDown={preventNaNValues}
          />
        </InputContainer>

        <InputContainer>
          <Label>?????????????????????</Label>

          <BusinessNumber>
            <Input
              onChange={handleChangeInput("businessNumber-0")}
              value={businessNumber[0]}
              maxLength={3}
              onKeyDown={preventNaNValues}
            />
            -
            <Input
              onChange={handleChangeInput("businessNumber-1")}
              value={businessNumber[1]}
              maxLength={2}
              onKeyDown={preventNaNValues}
            />
            -
            <Input
              onChange={handleChangeInput("businessNumber-2")}
              value={businessNumber[2]}
              maxLength={5}
              onKeyDown={preventNaNValues}
            />
          </BusinessNumber>
        </InputContainer>

        <InputContainer className="long">
          <Label>????????? ?????????</Label>
          <Input onChange={handleChangeInput("location")} value={location} />
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
          disabled={!hasInputFulfilled}
        >
          ??????
        </Button>

        {!preventCancel && (
          <Button size="small" full={false} onClick={handleCancelButtonClick}>
            ??????
          </Button>
        )}
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
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;

  & > input {
    padding: 9px 8px 9px 8px;
    width: 168px;
    height: 32px;
  }

  &.long {
    & > input {
      width: 325px;
    }
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
