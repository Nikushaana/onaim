import { useQuery } from "@tanstack/react-query";
import { getWheelById } from "@/features/wheel/api/wheelApi";

export const useOneWheel = (id: string) =>
    useQuery({
        queryKey: ["wheels", id],
        queryFn: () => getWheelById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });