import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  Stack,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { RaffleFormValues } from "@/features/raffle/schemas/raffle.schema";

export default function RafflePrizeFields() {
  const { control, register, setValue, getValues } =
    useFormContext<RaffleFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes",
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue(`prizes.${index}.imageFile`, file, {
      shouldValidate: true,
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 6 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Prizes</Typography>

        {fields.map((field, index) => {
          const imageFile = getValues(`prizes.${index}.imageFile`);
          const imageUrl = getValues(`prizes.${index}.imageUrl`);

          const previewSrc = imageFile
            ? URL.createObjectURL(imageFile)
            : imageUrl;

          return (
            <Paper
              key={field.id}
              variant="outlined"
              sx={{ p: 2, borderRadius: 6 }}
            >
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  {...register(`prizes.${index}.name`)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 6,
                    },
                  }}
                />

                <Stack direction="row" spacing={2}>
                  <Controller
                    name={`prizes.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Type"
                        {...field}
                        sx={{
                          width: 150,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 6,
                          },
                        }}
                      >
                        <MenuItem value="coins">Coins</MenuItem>
                        <MenuItem value="freeSpin">Free Spin</MenuItem>
                        <MenuItem value="bonus">Bonus</MenuItem>
                      </TextField>
                    )}
                  />

                  <TextField
                    label="Amount"
                    type="number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`prizes.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                  />

                  <TextField
                    label="Quantity"
                    type="number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`prizes.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />

                  <IconButton color="error" onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      borderRadius: 20,
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
                    <Typography variant="caption">{imageFile.name}</Typography>
                  )}

                  {previewSrc && (
                    <Box mt={1}>
                      <img
                        src={previewSrc}
                        alt="prize"
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
              </Stack>
            </Paper>
          );
        })}

        <Button
          variant="outlined"
          sx={{
            borderRadius: 20,
          }}
          onClick={() =>
            append({
              name: "",
              type: "coins",
              amount: 1,
              quantity: 1,
              imageUrl: "",
            })
          }
        >
          Add Prize
        </Button>
      </Stack>
    </Paper>
  );
}
