import RaffleComposer from "@/features/raffle/components/RaffleComposer";
import type { RaffleFormValues } from "@/features/raffle/schemas/raffle.schema";
import { apiGateway } from "@/shared/api/httpClient";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createRaffle } from "@/features/raffle/api/raffleApi";

export default function RaffleCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCreate = async (data: RaffleFormValues) => {
    try {
      const uploadedPrizes = await Promise.all(
        data.prizes.map(async (prize) => {
          if (!prize.imageFile) return prize;

          const formData = new FormData();
          formData.append("file", prize.imageFile);

          const res = await apiGateway.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          return {
            ...prize,
            imageUrl: res.data.url,
          };
        }),
      );

      const finalPayload = {
        ...data,
        prizes: uploadedPrizes.map(({ imageFile, ...rest }) => rest),
      };

      await createRaffle(finalPayload);

      await queryClient.invalidateQueries({ queryKey: ["raffles"] });

      toast.success("Raffle created successfully");

      navigate("/raffles");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create raffle");
    }
  };

  return <RaffleComposer onSubmit={handleCreate} />;
}
