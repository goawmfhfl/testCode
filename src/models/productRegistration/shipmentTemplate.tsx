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

// TODO: 네이밍 재검토
export interface CreateShipmentInputType {
  id?: number;
  name: string;
  isBundleShipment: boolean;
  type: ShipmentChargeType;
  price: number;
  distantPrice: number;
  returnPrice: number;
  exchangePrice: number;
}
