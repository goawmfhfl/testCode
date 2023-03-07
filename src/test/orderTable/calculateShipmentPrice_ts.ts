import { ShipmentType } from "@constants/sale";
export interface NewOrderItems {
  merchantUid: string;
  merchantItemUid: string;
  colorIndex: number;
  isBundleShipment: boolean;
  shipmentPrice: number;
  shipmentDistantPrice: number;

  orderByShop: {
    bundleShipmentPrice: number;
    bundleShipmentDistantPrice: number;
    bundleShipmentType: ShipmentType;
    bundleOrderItemTotalPrice: number;
    shipmentConditionalPrice: number;
  };
}

export const TC1: Array<Array<NewOrderItems>> = [
  [
    {
      merchantUid: "0",
      merchantItemUid: "0",
      colorIndex: 0,
      isBundleShipment: true,
      shipmentPrice: 3000,
      shipmentDistantPrice: 5000,

      orderByShop: {
        bundleShipmentPrice: 3000,
        bundleShipmentDistantPrice: 5000,
        bundleShipmentType: ShipmentType.CHARGE,
        bundleOrderItemTotalPrice: 3000,
        shipmentConditionalPrice: 3000,
      },
    },
    {
      merchantUid: "0",
      merchantItemUid: "0",
      colorIndex: 0,
      isBundleShipment: true,
      shipmentPrice: 3100,
      shipmentDistantPrice: 5000,

      orderByShop: {
        bundleShipmentPrice: 3000,
        bundleShipmentDistantPrice: 5000,
        bundleShipmentType: ShipmentType.CHARGE,
        bundleOrderItemTotalPrice: 3000,
        shipmentConditionalPrice: 3000,
      },
    },
    {
      merchantUid: "0",
      merchantItemUid: "0",
      colorIndex: 0,
      isBundleShipment: true,
      shipmentPrice: 3200,
      shipmentDistantPrice: 5000,

      orderByShop: {
        bundleShipmentPrice: 3000,
        bundleShipmentDistantPrice: 5000,
        bundleShipmentType: ShipmentType.CHARGE,
        bundleOrderItemTotalPrice: 3000,
        shipmentConditionalPrice: 3000,
      },
    },
    {
      merchantUid: "0",
      merchantItemUid: "0",
      colorIndex: 0,
      isBundleShipment: true,
      shipmentPrice: 3300,
      shipmentDistantPrice: 5000,

      orderByShop: {
        bundleShipmentPrice: 3000,
        bundleShipmentDistantPrice: 5000,
        bundleShipmentType: ShipmentType.CHARGE,
        bundleOrderItemTotalPrice: 3000,
        shipmentConditionalPrice: 3000,
      },
    },
  ],
];

// 2번 상품 2개 상품 묶음 처리
// 4번 상품 3개 상품 묶음 처리

export const TC2 = [
  {
    merchantUid: "0",
    colorIndex: 0,
    isBundleShipment: true,
  },
  {
    merchantUid: "0",
    colorIndex: 0,
    isBundleShipment: false,
  },
  {
    merchantUid: "1",
    colorIndex: 0,
    isBundleShipment: true,
  },
  {
    merchantUid: "1",
    colorIndex: 0,
    isBundleShipment: true,
  },
  {
    merchantUid: "2",
    colorIndex: 0,
    isBundleShipment: true,
  },
  {
    merchantUid: "3",
    colorIndex: 0,
    isBundleShipment: true,
  },
  {
    merchantUid: "4",
    colorIndex: 0,
    isBundleShipment: true,
  },
  {
    merchantUid: "4",
    colorIndex: 0,
    isBundleShipment: true,
  },
  {
    merchantUid: "4",
    colorIndex: 0,
    isBundleShipment: true,
  },
];
