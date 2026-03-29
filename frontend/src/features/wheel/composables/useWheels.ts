import { useQuery } from '@tanstack/react-query';
import { getWheels } from '@/features/wheel/api/wheelApi';
import type { GetWheelsParams } from '@/features/wheel/types/wheel.types';

export const useWheels = (params: GetWheelsParams) =>
  useQuery({
    queryKey: ['wheels', params],
    queryFn: () => getWheels(params),
  });