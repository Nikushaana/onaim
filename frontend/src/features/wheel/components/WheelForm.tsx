import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  wheelSchema,
  type WheelFormValues,
} from "@/features/wheel/schemas/wheel.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WheelSegmentFields from "@/features/wheel/components/WheelSegmentFields";
import WheelPreview from "@/features/wheel/components/WheelPreview";
import { useEffect } from "react";

type Props = {
  defaultValues?: WheelFormValues;
  onSubmit: (data: WheelFormValues) => void;
  isEdit?: boolean;
};

export default function WheelForm({
  defaultValues,
  onSubmit,
  isEdit = false,
}: Props) {
  const methods = useForm<WheelFormValues>({
    resolver: zodResolver(wheelSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      status: "draft",
      backgroundColor: "#ffffff",
      borderColor: "#000000",
      spinCost: 0,
      maxSpinsPerUser: 1,
      segments: [
        {
          label: "",
          color: "#ff0000",
          weight: 50,
          prizeType: "coins",
          prizeAmount: 1,
          imageUrl: "",
        },
        {
          label: "",
          color: "#00ff00",
          weight: 50,
          prizeType: "coins",
          prizeAmount: 1,
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

  const onSubmitHandler = (data: WheelFormValues) => {
    onSubmit(data);
    methods.reset(data);
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 3, borderRadius: 6 }}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack spacing={2}>
            <Typography variant="h6">
              {isEdit ? "Edit Wheel" : "Create Wheel"}
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
              {...register("description")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                },
              }}
              error={!!errors.description}
              helperText={errors.description?.message}
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
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              )}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Background Color"
                type="color"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 6,
                  },
                }}
                {...register("backgroundColor")}
                error={!!errors.backgroundColor}
                helperText={errors.backgroundColor?.message}
              />
              <TextField
                label="Border Color"
                type="color"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 6,
                  },
                }}
                {...register("borderColor")}
                error={!!errors.borderColor}
                helperText={errors.borderColor?.message}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Spin Cost"
                type="number"
                {...register("spinCost", { valueAsNumber: true })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 6,
                  },
                }}
                error={!!errors.spinCost}
                helperText={errors.spinCost?.message}
              />
              <TextField
                label="Max Spins Per User"
                type="number"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 6,
                  },
                }}
                {...register("maxSpinsPerUser", {
                  valueAsNumber: true,
                })}
                error={!!errors.maxSpinsPerUser}
                helperText={errors.maxSpinsPerUser?.message}
              />
            </Stack>

            <WheelSegmentFields />

            {errors.segments?.message && (
              <Typography color="error">
                {errors.segments.message as string}
              </Typography>
            )}

            <WheelPreview useForm />

            <Button
              type="submit"
              sx={{
                borderRadius: 6,
              }}
              variant="contained"
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
