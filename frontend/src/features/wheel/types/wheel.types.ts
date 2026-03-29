export type WheelStatus = 'draft' | 'active' | 'inactive';

export interface Wheel {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  borderColor: string;
  maxSpinsPerUser: number;
  spinCost: number;
  status: WheelStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetWheelsParams {
  page?: number;
  limit?: number;
  status?: WheelStatus;
}