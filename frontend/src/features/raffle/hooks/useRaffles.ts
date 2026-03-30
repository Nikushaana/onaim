import { useQuery } from '@tanstack/react-query';
import { getRaffles } from '@/features/raffle/api/raffleApi';
import type { GetRafflesParams } from '@/features/raffle/types/raffle.types';

export const useRaffles = (params: GetRafflesParams) =>
    useQuery({
        queryKey: ['raffles', params],
        queryFn: () => getRaffles(params),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });