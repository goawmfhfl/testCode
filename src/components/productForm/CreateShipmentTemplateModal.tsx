import { gql, useMutation } from "@apollo/client";

import ShipmentTemplateForm from "./ShipmentTemplateForm";
import { overModalVar, systemModalVar } from "@cache/index";
import { CreateShipmentInputType } from "@models/product/shipmentTemplate";
import {
  shipmentTemplateVar,
  initialState as shipmentTemplateInitialState,
} from "@cache/productForm/shipmentTemplate";
import { GET_SHIPMENT_TEMPLATES } from "@graphql/queries/getShipmentTemplates";

const CREATE_SHIPMENT_TEMPLATE = gql`
  mutation CreateShipmentTemplate($input: CreateShipmentTemplateInput!) {
    createShipmentTemplate(input: $input) {
      ok
      error
    }
  }
`;

const ShipmentTemplateModal = () => {
  const [createShipmentTemplate, { loading: isCreateShipmentTemplateLoading }] =
    useMutation<
      { createShipmentTemplate: { ok: boolean; error: string } },
      { input: CreateShipmentInputType }
    >(CREATE_SHIPMENT_TEMPLATE, {
      refetchQueries: [
        {
          query: GET_SHIPMENT_TEMPLATES,
        },
        "GetAllShipmentTemplates",
      ],
    });

  const handleRegisterButtonClick = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async function (): Promise<void> {
        const {
          name,
          isBundlingEnabled,
          shipmentChargeType,
          shipmentCharge,
          additionalCharge,
          returnCharge,
          exchangeCharge,
        } = shipmentTemplateVar();

        const input = {
          name,
          isBundleShipment: isBundlingEnabled,
          type: shipmentChargeType,
          price: Number(shipmentCharge),
          distantPrice: Number(additionalCharge),
          returnPrice: Number(returnCharge),
          exchangePrice: Number(exchangeCharge),
        };

        const {
          data: {
            createShipmentTemplate: { ok, error },
          },
        } = await createShipmentTemplate({
          variables: {
            input,
          },
        });

        if (ok) {
          shipmentTemplateVar({
            ...shipmentTemplateInitialState,
          });

          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: "템플릿이 등록되었습니다.",
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });

              overModalVar({
                ...overModalVar(),
                isVisible: false,
              });
            },
          });
        }

        if (error) {
          // TODO: system modal로 템플릿 생성 에러 알림
          console.log(error);

          return;
        }
      })();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelButtonClick = () => {
    overModalVar({
      ...overModalVar(),
      isVisible: false,
    });
  };

  return (
    <ShipmentTemplateForm
      formTitle={"배송 템플릿 만들기"}
      handleRegisterButtonClick={handleRegisterButtonClick}
      handleCancelButtonClick={handleCancelButtonClick}
      isRegistering={isCreateShipmentTemplateLoading}
    />
  );
};

export default ShipmentTemplateModal;
