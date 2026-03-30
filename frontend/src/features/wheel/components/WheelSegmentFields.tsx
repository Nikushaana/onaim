import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { WheelFormValues } from "@/features/wheel/schemas/wheel.schema";
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function WheelSegmentFields() {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<WheelFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "segments",
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue(`segments.${index}.imageFile`, file, {
      shouldValidate: true,
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 6 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Segments</Typography>

        {fields.map((field, index) => {
          const segmentError = errors.segments?.[index];

          const imageFile = getValues(`segments.${index}.imageFile`);
          const imageUrl = getValues(`segments.${index}.imageUrl`);

          const previewSrc = imageFile
            ? URL.createObjectURL(imageFile)
            : imageUrl;

          return (
            <Paper key={field.id} sx={{ p: 2, borderRadius: 6 }}>
              <Stack spacing={2}>
                {/* Row 1 */}
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="Label"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`segments.${index}.label`)}
                    error={!!segmentError?.label}
                    helperText={segmentError?.label?.message}
                  />

                  <TextField
                    fullWidth
                    label="Color"
                    type="color"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`segments.${index}.color`)}
                    error={!!segmentError?.color}
                    helperText={segmentError?.color?.message}
                  />

                  <TextField
                    label="Weight"
                    type="number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`segments.${index}.weight`, {
                      valueAsNumber: true,
                    })}
                    error={!!segmentError?.weight}
                    helperText={segmentError?.weight?.message}
                  />
                </Stack>

                {/* Row 2 */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Controller
                    name={`segments.${index}.prizeType`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Type"
                        {...field}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 6,
                          },
                        }}
                      >
                        <MenuItem value="coins">Coins</MenuItem>
                        <MenuItem value="freeSpin">Free Spin</MenuItem>
                        <MenuItem value="bonus">Bonus</MenuItem>
                        <MenuItem value="nothing">Nothing</MenuItem>
                      </TextField>
                    )}
                  />

                  <TextField
                    label="Prize Amount"
                    type="number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`segments.${index}.prizeAmount`, {
                      valueAsNumber: true,
                    })}
                  />

                  {/* Image Upload */}
                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        borderRadius: 6,
                      }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, index)}
                      />
                    </Button>

                    {imageFile && (
                      <Typography variant="caption">
                        {imageFile.name}
                      </Typography>
                    )}

                    {previewSrc && (
                      <Box>
                        <img
                          src={previewSrc}
                          alt="segment"
                          width={60}
                          height={60}
                          style={{
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </Box>
                    )}
                  </Stack>

                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          );
        })}

        <Button
          variant="outlined"
          sx={{
            borderRadius: 6,
          }}
          onClick={() =>
            append({
              label: "",
              color: "#000000",
              weight: 0,
              prizeType: "coins",
              prizeAmount: 1,
              imageUrl: "",
              imageFile: undefined,
            })
          }
        >
          Add Segment
        </Button>
      </Stack>
    </Paper>
  );
}
