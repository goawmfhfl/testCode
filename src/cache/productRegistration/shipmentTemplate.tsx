import { makeVar } from "@apollo/client";

import {
  ShipmentChargeType,
  ShipmentTemplateType,
  CreateShipmentInputType,
} from "@models/productRegistration/shipmentTemplate";

export const initialState = {
  name: "",
  isBundlingEnabled: false,
  shipmentChargeType: ShipmentChargeType.Free,
  shipmentCharge: 0,
  additionalCharge: 0,
  returnCharge: 0,
  exchangeCharge: 0,
};

export const selectedTemplateInitialState = {
  id: "",
  name: "",
  isBundleShipment: false,
  type: ShipmentChargeType.Free,
  price: 0,
  distantPrice: 0,
  returnPrice: 0,
  exchangePrice: 0,
};

export const shipmentTemplateVar = makeVar<ShipmentTemplateType>(initialState);

export const shipmentTemplatesVar = makeVar<Array<CreateShipmentInputType>>([]);
