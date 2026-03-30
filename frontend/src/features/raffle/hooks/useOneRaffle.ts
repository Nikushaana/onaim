import { useQuery } from "@tanstack/react-query";
import { getRaffleById } from "@/features/raffle/api/raffleApi";

export const useOneRaffle = (id: string) =>
    useQuery({
        queryKey: ["raffles", id],
        queryFn: () => getRaffleById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });