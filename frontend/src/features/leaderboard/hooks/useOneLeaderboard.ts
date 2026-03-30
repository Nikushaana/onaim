import { useQuery } from "@tanstack/react-query";
import { getLeaderboardById } from "@/features/leaderboard/api/leaderboardApi";

export const useOneLeaderboard = (id: string) =>
    useQuery({
        queryKey: ["leaderboards", id],
        queryFn: () => getLeaderboardById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });