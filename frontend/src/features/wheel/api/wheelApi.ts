import { apiGateway } from '@/shared/api/httpClient';
import type { GetWheelsParams, WheelPayload } from '@/features/wheel/types/wheel.types';

export const getWheels = async (params: GetWheelsParams) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.status) query.append("status", params.status);

  const res = await apiGateway.get(`/wheels?${query.toString()}`);
  return res.data;
};

export const createWheel = async (data: WheelPayload) => {
  const res = await apiGateway.post('/wheels', data);
  return res.data;
};

export const getWheelById = async (id: string) => {
  const res = await apiGateway.get(`/wheels/${id}`);
  return res.data;
};

export async function updateWheel(id: string, data: WheelPayload) {
  const res = await apiGateway.patch(`/wheels/${id}`, data);
  return res.data;
}