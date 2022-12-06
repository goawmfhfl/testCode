export enum ShipmentChargeType {
  Charged = "CHARGE",
  Free = "FREE",
}

// 내부적으로 관리되는 template
export interface ShipmentTemplateType {
  name: string;
  isBundlingEnabled: boolean;
  shipmentChargeType: ShipmentChargeType;
  shipmentCharge: number;
  additionalCharge: number;
  returnCharge: number;
  exchangeCharge: number;
}

// 서버에 저장될, 혹은 저장되었던 template
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
