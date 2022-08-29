export enum ShipmentChargeType {
  Charged = "CHARGE",
  Free = "FREE",
}

export interface ShipmentTemplateType {
  name: string;
  isBundlingEnabled: boolean;
  shipmentChargeType: ShipmentChargeType;
  shipmentCharge: number;
  additionalCharge: number;
  returnCharge: number;
  exchangeCharge: number;
}

export interface CreateShipmentInputType {
  name: string;
  isBundleShipment: boolean;
  type: ShipmentChargeType;
  price: number;
  distantPrice: number;
  returnPrice: number;
  exchangePrice: number;
}
