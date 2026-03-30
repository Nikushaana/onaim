export type WheelStatus = 'draft' | 'active' | 'inactive';

export type PrizeType = "coins" | "freeSpin" | "bonus" | "nothing";

export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  weight: number;
  imageUrl: string;
  prizeType: PrizeType;
  prizeAmount: number;
}

export interface Wheel {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  borderColor: string;
  maxSpinsPerUser: number;
  spinCost: number;
  status: WheelStatus;
  segments?: WheelSegment[];
  createdAt: string;
  updatedAt: string;
}

export interface GetWheelsParams {
  page?: number;
  limit?: number;
  status?: WheelStatus;
}

export interface WheelSegmentPayload {
  label: string;
  color: string;
  weight: number;
  prizeType: PrizeType;
  prizeAmount: number;
  imageUrl?: string;
}

export interface WheelPayload {
  name: string;
  description?: string;
  backgroundColor: string;
  borderColor: string;
  maxSpinsPerUser: number;
  spinCost: number;
  status: WheelStatus;
  segments: WheelSegmentPayload[];
}