import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import format from "date-fns/format";
import styled, { useTheme } from "styled-components/macro";
import { gql, useQuery, useMutation, useReactiveVar } from "@apollo/client";

import CreateShipmentTemplateModal from "@components/ProductRegistration/CreateShipmentTemplateModal";
import EditShipmentTemplateModal from "@components/ProductRegistration/EditShipmentTemplateModal";
import Button from "@components/common/Button";
import { modalVar, overModalVar, systemModalVar } from "@cache/index";
import closeIconSource from "@icons/close.svg";
import { ShipmentChargeType } from "@models/shipmentTemplate";

const GET_SHIPMENT_TEMPLATES = gql`
  query GetAllShipmentTemplates {
    getUserShipmentTemplates {
      ok
      error
      shipmentTemplates {
        id
        name
        createdAt
        updatedAt
        type
        price
        distantPrice
        returnPrice
        exchangePrice
        isBundleShipment
      }
    }
  }
`;

const DELETE_SHIPMENT_TEMPLATE = gql`
  mutation DeleteShipmentTemplate($input: DeleteShipmentTemplateInput!) {
    deleteShipmentTemplate(input: $input) {
      ok
      error
    }
  }
`;

const ShipmentChargeTemplateModal = () => {
  const theme = useTheme();

  const { loading, error, data, refetch } = useQuery<{
    getUserShipmentTemplates: {
      ok: boolean;
      error: string;
      shipmentTemplates: Array<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: ShipmentChargeType;
        name: string;
        price: number;
        distantPrice: number;
        returnPrice: number;
        exchangePrice: number;
        isBundleShipment: boolean;
      }>;
    };
  }>(GET_SHIPMENT_TEMPLATES);

  const [deleteShipmentTemplate] = useMutation<
    {
      deleteShipmentTemplate: {
        ok: boolean;
        error: string;
      };
    },
    {
      input: { id: number };
    }
  >(DELETE_SHIPMENT_TEMPLATE);

  const [lastRowRef, setLastRowRef] = useState<HTMLElement>(null);
  const [templateHeaders] = useState<Array<{ id: string; headerName: string }>>(
    [
      { id: uuidv4(), headerName: "템플릿명" },
      { id: uuidv4(), headerName: "수정일" },
      { id: uuidv4(), headerName: "수정/삭제" },
    ]
  );

  const overModal = useReactiveVar(overModalVar);

  useEffect(() => {
    // eslint-disable-next-line
    (async function () {
      await refetch();
    })();
  }, [overModal.isVisible]);

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

  const handleEditButtonClick =
    (templateId: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      overModalVar({
        ...overModalVar(),
        isVisible: true,
        component: <EditShipmentTemplateModal templateId={templateId} />,
      });
    };

  const handleDeleteButtonClick =
    (templateId: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      // eslint-disable-next-line
      (async (): Promise<void> => {
        const {
          data: {
            deleteShipmentTemplate: { ok, error },
          },
        } = await deleteShipmentTemplate({
          variables: {
            input: { id: templateId },
          },
        });

        if (ok) {
          await refetch();

          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: "템플릿이 삭제되었습니다.",
          });
        }

        if (error) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: "템플릿 삭제에 실패하였습니다.",
          });
        }
      })();
    };

  const shipmentTemplates = data?.getUserShipmentTemplates?.shipmentTemplates;

  if (error) {
    // TODO: system modal로 처리
    // alert("배송 템플릿을 불러오는 도중 에러가 발생하였습니다!");
  }

  return (
    <Container>
      <CloseButton src={closeIconSource} onClick={handleCloseButtonClick} />

      <CreateShipmentTemplateButton
        onClick={handleCreateShipmentTemplateButtonClick}
      >
        배송 템플릿 만들기
      </CreateShipmentTemplateButton>

      <TemplateListTable>
        <tbody>
          <TemplateHeader>
            {templateHeaders.map(
              (
                { id, headerName }: { id: null | string; headerName: string },
                headerIndex
              ) => {
                const lastRowCell = lastRowRef?.children[
                  headerIndex
                ] as HTMLElement | null;

                const width = lastRowCell?.getBoundingClientRect().width;

                return (
                  <TemplateCell key={id} width={width ? `${width}px` : ""}>
                    {headerName}
                  </TemplateCell>
                );
              }
            )}
          </TemplateHeader>

          <tr>
            <td colSpan={3}>
              <TemplateList>
                <table>
                  <tbody>
                    {shipmentTemplates?.map(
                      ({ id, name, updatedAt }, index, shipmentTemplates) => {
                        const isFirstRow = index === 0;
                        const isLastRow =
                          index + 1 === shipmentTemplates.length;

                        return (
                          <TemplateRow
                            key={id}
                            ref={(ref) => isLastRow && setLastRowRef(ref)}
                          >
                            <TemplateCell
                              className={clsx([
                                isFirstRow && "cell--top-end",
                                "cell--left-end",
                                isLastRow && "cell--low-end",
                              ])}
                            >
                              {name}
                            </TemplateCell>

                            <TemplateCell
                              className={clsx([
                                isFirstRow ? "cell--top-end" : "",
                                isLastRow && "cell--low-end",
                              ])}
                            >
                              {format(new Date(updatedAt), "yyyy-MM-dd")}
                            </TemplateCell>

                            <TemplateCell
                              className={clsx([
                                isFirstRow && "cell--top-end",
                                isLastRow && "cell--low-end",
                                "cell--button-container",
                                "cell--right-end",
                              ])}
                            >
                              <EditButton
                                size="small"
                                color={"white"}
                                backgroundColor={theme.palette.grey700}
                                onClick={handleEditButtonClick(id)}
                              >
                                수정
                              </EditButton>
                              <DeleteButton
                                size="small"
                                onClick={handleDeleteButtonClick(id)}
                              >
                                삭제
                              </DeleteButton>
                            </TemplateCell>
                          </TemplateRow>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </TemplateList>
            </td>
          </tr>
        </tbody>
      </TemplateListTable>
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

const TemplateListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

const TemplateList = styled.div`
  overflow: auto;
  max-height: 364px;
`;

const TemplateRow = styled.tr`
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 14px;

  align-items: center;
  letter-spacing: 0.1px;
`;

const TemplateHeader = styled(TemplateRow)`
  background-color: ${({ theme: { palette } }) => palette.grey400};
  width: 504px;

  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
`;

const TemplateCell = styled.td<{ width?: string }>`
  width: ${({ width }) => (width ? width : "100%")};
  min-width: 100px;
  height: 40px;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;

  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  &.cell--button-container {
    padding: 4px 13px;

    & > button {
      display: inline-block;
    }
  }

  &.cell--left-end {
    border-left: 0px;
  }

  &.cell--right-end {
    border-right: 0px;
  }

  &.cell--top-end {
    border-top: 0px;
  }

  &.cell--low-end {
    border-bottom: 0px;
  }
`;

const EditButton = styled(Button)``;

const DeleteButton = styled(Button)``;

export default ShipmentChargeTemplateModal;
