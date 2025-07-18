// src/types/types.ts
export type Medicine = {
    name: string;
    // destination: number;
    quantity: number;
    location?: { address: string; lat: number; lng: number };
};

export type Delivery = {
    name: string;
    quantity: number;
};

export type DeliveryLocation = {
    location: number;
    deliveries: Delivery[];
};

export type TspResult = {
    cost: number;
    route: number[];
    deliveryDetails: DeliveryLocation[];
};
