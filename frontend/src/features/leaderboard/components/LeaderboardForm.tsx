import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import {
  leaderboardSchema,
  type LeaderboardFormValues,
} from "@/features/leaderboard/schemas/leaderboard.schema";
import PrizeFields from "@/features/leaderboard/components/PrizeFields";
import { useEffect } from "react";

type Props = {
  defaultValues?: LeaderboardFormValues;
  onSubmit: (data: LeaderboardFormValues) => void;
  isEdit?: boolean;
};

export default function LeaderboardForm({
  defaultValues,
  onSubmit,
  isEdit = false,
}: Props) {
  const methods = useForm<LeaderboardFormValues>({
    resolver: zodResolver(leaderboardSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "draft",
      scoringType: "points",
      maxParticipants: 2,
      prizes: [
        {
          rank: 1,
          name: "",
          type: "coins",
          amount: 1,
          imageUrl: "",
        },
      ],
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = methods;

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const onSubmitHandler = (data: LeaderboardFormValues) => {
    onSubmit(data);
    methods.reset(data);
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 6 }}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack spacing={2}>
            <Typography variant="h6">
              {isEdit ? "Edit Leaderboard" : "Create Leaderboard"}
            </Typography>

            <TextField
              label="Title"
              {...register("title")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              {...register("description")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              {...register("startDate")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />

            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              {...register("endDate")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Status"
                  {...field}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 6,
                    },
                  }}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="scoringType"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Scoring Type"
                  {...field}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 6,
                    },
                  }}
                >
                  <MenuItem value="points">Points</MenuItem>
                  <MenuItem value="wins">Wins</MenuItem>
                  <MenuItem value="wagered">Wagered</MenuItem>
                </TextField>
              )}
            />

            <TextField
              type="number"
              label="Max Participants"
              {...register("maxParticipants", { valueAsNumber: true })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.maxParticipants}
              helperText={errors.maxParticipants?.message}
            />

            {/* Prizes */}
            <PrizeFields />

            {errors.prizes && (
              <Typography color="error">
                {errors.prizes.message as string}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: 20,
              }}
              disabled={!isValid || isSubmitting}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </FormProvider>
  );
}
