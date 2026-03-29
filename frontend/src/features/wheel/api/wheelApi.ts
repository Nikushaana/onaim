import { apiGateway } from '@/shared/api/httpClient';
import type { GetWheelsParams } from '@/features/wheel/types/wheel.types';

export const getWheels = async (params: GetWheelsParams) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.status) query.append("status", params.status);

  const res = await apiGateway.get(`/wheels?${query.toString()}`);
  return res.data;
};