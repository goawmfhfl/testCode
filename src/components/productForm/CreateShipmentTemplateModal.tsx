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
            description: "???????????? ?????????????????????.",
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
          // TODO: system modal??? ????????? ?????? ?????? ??????
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
      formTitle={"?????? ????????? ?????????"}
      handleRegisterButtonClick={handleRegisterButtonClick}
      handleCancelButtonClick={handleCancelButtonClick}
      isRegistering={isCreateShipmentTemplateLoading}
    />
  );
};

export default ShipmentTemplateModal;
