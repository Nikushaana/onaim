import { useQuery } from '@tanstack/react-query';
import { getLeaderboards } from '@/features/leaderboard/api/leaderboardApi';
import type { GetLeaderboardsParams } from '@/features/leaderboard/types/leaderboard.types';

export const useLeaderboards = (params: GetLeaderboardsParams) =>
    useQuery({
        queryKey: ["leaderboards", params],
        queryFn: () => getLeaderboards(params),
    });