import { apiGateway } from '@/shared/api/httpClient';
import type { GetRafflesParams, RafflePayload } from '@/features/raffle/types/raffle.types';

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

export const createRaffle = async (data: RafflePayload) => {
  const res = await apiGateway.post('/raffles', data);
  return res.data;
};

export const getRaffleById = async (id: string) => {
  const res = await apiGateway.get(`/raffles/${id}`);
  return res.data;
};

export async function updateRaffle(id: string, data: RafflePayload) {
  const res = await apiGateway.patch(`/raffles/${id}`, data);
  return res.data;
}