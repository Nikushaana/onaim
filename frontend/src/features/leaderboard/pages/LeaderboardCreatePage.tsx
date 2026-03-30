import { Container } from "@mui/material";
import LeaderboardForm from "@/features/leaderboard/components/LeaderboardForm";
import type { LeaderboardFormValues } from "@/features/leaderboard/schemas/leaderboard.schema";
import { apiGateway } from "@/shared/api/httpClient";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createLeaderboard } from "@/features/leaderboard/api/leaderboardApi";

export default function LeaderboardCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCreate = async (data: LeaderboardFormValues) => {
    try {
      // upload images
      const uploadedPrizes = await Promise.all(
        data.prizes.map(async (prize) => {
          if (!prize.imageFile) return prize;

          const formData = new FormData();
          formData.append("file", prize.imageFile);

          const res = await apiGateway.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const { url } = res.data;

          return {
            ...prize,
            imageUrl: url,
          };
        }),
      );

      // remove File objects
      const finalPayload = {
        ...data,
        prizes: uploadedPrizes.map(({ imageFile, ...rest }) => rest),
      };

      // create leaderboard
      await createLeaderboard(finalPayload);

      await queryClient.invalidateQueries({ queryKey: ["leaderboards"] });

      toast.success("Leaderboard created successfully");

      navigate("/");
    } catch (err) {
      console.error(err);

      toast.error("Failed to create leaderboard");
    }
  };

  return <LeaderboardForm onSubmit={handleCreate} />;
}
