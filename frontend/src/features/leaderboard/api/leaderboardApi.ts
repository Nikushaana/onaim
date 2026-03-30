import { apiGateway } from '@/shared/api/httpClient';
import type { GetLeaderboardsParams, LeaderboardPayload } from '@/features/leaderboard/types/leaderboard.types';

export const getLeaderboards = async (params: GetLeaderboardsParams) => {
    const query = new URLSearchParams();

    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.status) query.append("status", params.status);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.order) query.append("order", params.order);

    const res = await apiGateway.get(`/leaderboards?${query.toString()}`);
    return res.data;
};

export const createLeaderboard = async (data: LeaderboardPayload) => {
    const res = await apiGateway.post('/leaderboards', data);
    return res.data;
};

export const getLeaderboardById = async (id: string) => {
  const res = await apiGateway.get(`/leaderboards/${id}`);
  return res.data;
};

export async function updateLeaderboard(id: string, data: LeaderboardPayload) {
  const res = await apiGateway.patch(`/leaderboards/${id}`, data);
  return res.data;
}