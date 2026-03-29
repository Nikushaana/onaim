import { apiGateway } from '@/shared/api/httpClient';
import type { GetRafflesParams } from '@/features/raffle/types/raffle.types';

export const getRaffles = async (params: GetRafflesParams) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.status) query.append("status", params.status);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);

  const res = await apiGateway.get(`/raffles?${query.toString()}`);
  return res.data;
};