import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Chip,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiGateway } from "@/shared/api/httpClient";
import { useOneRaffle } from "@/features/raffle/hooks/useOneRaffle";
import type { RaffleFormValues } from "@/features/raffle/schemas/raffle.schema";
import { updateRaffle } from "@/features/raffle/api/raffleApi";
import RaffleComposer from "@/features/raffle/components/RaffleComposer";
import type { Prize } from "@/features/raffle/types/raffle.types";

export default function RaffleDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useOneRaffle(id!);
  const [isEdit, setIsEdit] = useState(false);

  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="80%" />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={100} height={32} />
          </Stack>
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="50%" />

          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="30%" height={30} />

          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Paper key={i} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="rectangular" width={60} height={60} />

                  <Box sx={{ width: "100%" }}>
                    <Skeleton width="20%" />
                    <Skeleton width="40%" />
                    <Skeleton width="30%" />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Skeleton variant="rectangular" width={100} height={40} />
        </Stack>
      </Paper>
    );
  }
  if (!data) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            Raffle not found
          </Typography>

          <Button
            sx={{ mt: 3 }}
            variant="contained"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    );
  }

  const handleUpdate = async (passedData: RaffleFormValues) => {
    try {
      if (data.status === "drawn") {
        toast.error("Cannot update a drawn raffle");
        return;
      }

      // upload images
      const uploadedPrizes = await Promise.all(
        passedData.prizes.map(async (prize) => {
          // new file upload
          if (prize.imageFile) {
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
          }

          return prize;
        }),
      );

      // remove file objects before sending
      const finalPayload = {
        ...passedData,
        prizes: uploadedPrizes.map(({ imageFile, ...rest }) => rest),
      };

      await updateRaffle(id!, finalPayload);

      await queryClient.invalidateQueries({ queryKey: ["raffles"] });

      toast.success("Raffle updated successfully");

      setIsEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update raffle");
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 6 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {!isEdit ? (
          <Button
            variant="contained"
            onClick={() => setIsEdit(true)}
            sx={{
              backgroundColor: "#06ed6e",
              "&:hover": {
                backgroundColor: "#05c85a",
              },
              borderRadius: 20,
            }}
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              borderRadius: 20,
            }}
            onClick={() => setIsEdit(false)}
          >
            Close Edit
          </Button>
        )}
      </Stack>

      {!isEdit ? (
        <Stack spacing={2}>
          <Typography variant="h5">{data.name}</Typography>

          <Typography>{data.description}</Typography>

          <Stack direction="row" spacing={2}>
            <Chip label={data.status} />
            <Chip
              label={
                data.ticketPrice ? `Ticket: ${data.ticketPrice}` : "No ticket"
              }
            />
          </Stack>

          <Typography>
            Start: {new Date(data.startDate).toLocaleDateString()}
          </Typography>

          <Typography>
            End: {new Date(data.endDate).toLocaleDateString()}
          </Typography>

          <Typography>
            Draw Date: {new Date(data.drawDate).toLocaleDateString()}
          </Typography>

          <Typography>
            Max Tickets Per User: {data.maxTicketsPerUser}
          </Typography>

          <Typography>
            Total Ticket Limit: {data.totalTicketLimit ?? "Unlimited"}
          </Typography>

          <Box>
            <Typography variant="h6">Prizes</Typography>

            <Stack spacing={2}>
              {data.prizes?.map((p: Prize, index: number) => (
                <Paper key={p.id || index} sx={{ p: 2, borderRadius: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      width={60}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />

                    <Box>
                      <Typography>Prize #{index + 1}</Typography>

                      <Typography>{p.name}</Typography>

                      <Typography>
                        {p.amount} ({p.type}) × {p.quantity}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      ) : (
        <RaffleComposer defaultValues={data} isEdit onSubmit={handleUpdate} />
      )}
    </Paper>
  );
}
