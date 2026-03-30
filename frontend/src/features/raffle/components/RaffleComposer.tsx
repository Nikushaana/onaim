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
  raffleSchema,
  type RaffleFormValues,
} from "@/features/raffle/schemas/raffle.schema";
import RafflePrizeFields from "@/features/raffle/components/RafflePrizeFields";
import { useEffect } from "react";

type Props = {
  defaultValues?: RaffleFormValues;
  onSubmit: (data: RaffleFormValues) => void;
  isEdit?: boolean;
};

export default function RaffleComposer({
  defaultValues,
  onSubmit,
  isEdit = false,
}: Props) {
  const methods = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      drawDate: "",
      status: "draft",
      ticketPrice: 1,
      maxTicketsPerUser: 1,
      totalTicketLimit: null,
      prizes: [
        {
          name: "",
          type: "coins",
          amount: 1,
          quantity: 1,
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

  const onSubmitHandler = (data: RaffleFormValues) => {
    onSubmit(data);
    methods.reset(data);
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 6 }}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack spacing={2}>
            <Typography variant="h6">
              {isEdit ? "Edit Raffle" : "Create Raffle"}
            </Typography>

            <TextField
              label="Name"
              {...register("name")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.name}
              helperText={errors.name?.message}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              InputLabelProps={{ shrink: true }}
              {...register("startDate")}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              {...register("endDate")}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />
            <TextField
              type="date"
              label="Draw Date"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              {...register("drawDate")}
              error={!!errors.drawDate}
              helperText={errors.drawDate?.message}
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
                  <MenuItem value="drawn">Drawn</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              )}
            />

            <TextField
              label="Ticket Price"
              type="number"
              {...register("ticketPrice", { valueAsNumber: true })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.ticketPrice}
              helperText={errors.ticketPrice?.message}
            />

            <TextField
              label="Max Tickets Per User"
              type="number"
              {...register("maxTicketsPerUser", { valueAsNumber: true })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.maxTicketsPerUser}
              helperText={errors.maxTicketsPerUser?.message}
            />

            <TextField
              label="Total Ticket Limit"
              type="number"
              {...register("totalTicketLimit", { valueAsNumber: true })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.totalTicketLimit}
              helperText={errors.totalTicketLimit?.message}
            />

            <RafflePrizeFields />

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
