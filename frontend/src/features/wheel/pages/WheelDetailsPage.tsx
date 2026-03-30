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
import { useOneWheel } from "@/features/wheel/hooks/useOneWheel";
import type { WheelFormValues } from "@/features/wheel/schemas/wheel.schema";
import { updateWheel } from "@/features/wheel/api/wheelApi";
import WheelForm from "@/features/wheel/components/WheelForm";
import WheelPreview from "@/features/wheel/components/WheelPreview";
import type { WheelSegment } from "@/features/wheel/types/wheel.types";

export default function WheelDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useOneWheel(id!);
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
            Wheel not found
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

  const handleUpdate = async (data: WheelFormValues) => {
    try {
      // upload images
      const uploadedSegments = await Promise.all(
        data.segments.map(async (segment) => {
          // new file upload
          if (segment.imageFile) {
            const formData = new FormData();
            formData.append("file", segment.imageFile);

            const res = await apiGateway.post("/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const { url } = res.data;

            return {
              ...segment,
              imageUrl: url,
            };
          }

          return segment;
        }),
      );

      // remove file objects before sending
      const finalPayload = {
        ...data,
        segments: uploadedSegments.map(({ imageFile, ...rest }) => rest),
      };

      await updateWheel(id!, finalPayload);

      await queryClient.invalidateQueries({ queryKey: ["wheels"] });

      toast.success("Wheel updated successfully");

      setIsEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wheel");
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
            <Chip label={`Spin Cost: ${data.spinCost}`} />
          </Stack>

          <Typography>Max Spins Per User: {data.maxSpinsPerUser}</Typography>

          <Typography>
            Background Color:{" "}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 20,
                height: 20,
                backgroundColor: data.backgroundColor,
                border: "1px solid #ccc",
                ml: 1,
                verticalAlign: "middle",
              }}
            />
          </Typography>

          <Typography>
            Border Color:{" "}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 20,
                height: 20,
                backgroundColor: data.borderColor,
                border: "1px solid #ccc",
                ml: 1,
                verticalAlign: "middle",
              }}
            />
          </Typography>

          {/* segments */}
          <Box>
            <Typography variant="h6">Segments</Typography>

            <Stack spacing={2}>
              {data.segments?.map((s: WheelSegment) => (
                <Paper key={s.id} sx={{ p: 2, borderRadius: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img
                      src={s.imageUrl}
                      alt={s.label}
                      width={60}
                      height={60}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />

                    <Box>
                      <Typography>{s.label}</Typography>

                      <Typography>Weight: {s.weight}</Typography>

                      <Typography>
                        {s.prizeAmount} ({s.prizeType})
                      </Typography>

                      <Typography>
                        Color:{" "}
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 14,
                            height: 14,
                            backgroundColor: s.color,
                            border: "1px solid #ccc",
                            ml: 1,
                            verticalAlign: "middle",
                          }}
                        />
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
          <WheelPreview segments={data.segments} />
        </Stack>
      ) : (
        <WheelForm defaultValues={data} isEdit onSubmit={handleUpdate} />
      )}
    </Paper>
  );
}
