import { useEffect } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import ShipmentTemplateForm from "./ShipmentTemplateForm";
import { overModalVar, systemModalVar } from "@cache/index";
import {
  shipmentTemplateVar,
  initialState as shipmentTemplateInitialState,
} from "@cache/productForm/shipmentTemplate";
import { CreateShipmentInputType } from "@models/product/shipmentTemplate";

interface EditShipmentTemplateModalProps {
  templateId: number;
}

const READ_TEMPLATES = gql`
  query ReadTemplates {
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

const EDIT_SHIPMENT_TEMPLATE = gql`
  mutation EditShipmentTemplate($input: EditShipmentTemplateInput!) {
    editShipmentTemplate(input: $input) {
      ok
      error
    }
  }
`;

const EditShipmentTemplateModal = ({
  templateId,
}: EditShipmentTemplateModalProps) => {
  const client = useApolloClient();

  const [editShipmentTemplate] = useMutation(EDIT_SHIPMENT_TEMPLATE);

  useEffect(() => {
    const {
      getUserShipmentTemplates: { shipmentTemplates },
    }: {
      getUserShipmentTemplates: {
        shipmentTemplates: Array<CreateShipmentInputType & { id: number }>;
      };
    } = client.readQuery({
      query: READ_TEMPLATES,
    });

    const {
      name,
      isBundleShipment,
      type,
      price,
      distantPrice,
      exchangePrice,
      returnPrice,
    } = shipmentTemplates.find((template) => template.id === templateId);

    shipmentTemplateVar({
      name,
      isBundlingEnabled: isBundleShipment,
      shipmentCharge: price,
      shipmentChargeType: type,
      additionalCharge: distantPrice,
      returnCharge: returnPrice,
      exchangeCharge: exchangePrice,
    });

    return () => {
      shipmentTemplateVar({
        ...shipmentTemplateInitialState,
      });
    };
  }, []);

  const handleRegisterButtonClick = () => {
    // eslint-disable-next-line
    (async function () {
      try {
        const {
          name,
          shipmentCharge,
          shipmentChargeType,
          isBundlingEnabled,
          exchangeCharge,
          additionalCharge,
          returnCharge,
        } = shipmentTemplateVar();

        const {
          data: {
            editShipmentTemplate: { ok, error },
          },
        } = (await editShipmentTemplate({
          variables: {
            input: {
              shipmentId: templateId,
              name,
              price: shipmentCharge,
              type: shipmentChargeType,
              isBundleShipment: isBundlingEnabled,
              distantPrice: additionalCharge,
              exchangePrice: exchangeCharge,
              returnPrice: returnCharge,
            },
          },
        })) as {
          data: { editShipmentTemplate: { ok: boolean; error: string | null } };
        };

        if (error) {
          // TODO: system modal로 변경
          alert("템플릿 업데이트 중 에러가 발생하였습니다!");

          return;
        }

        if (ok) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: "템플릿이 수정되었습니다.",
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
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleCancelButtonClick = () => {
    overModalVar({
      ...overModalVar(),
      isVisible: false,
    });
  };

  return (
    <ShipmentTemplateForm
      formTitle={"배송 템플릿 수정하기"}
      handleRegisterButtonClick={handleRegisterButtonClick}
      handleCancelButtonClick={handleCancelButtonClick}
    />
  );
};

export default EditShipmentTemplateModal;
