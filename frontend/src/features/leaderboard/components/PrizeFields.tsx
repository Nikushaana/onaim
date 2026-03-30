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
import type { LeaderboardFormValues } from "@/features/leaderboard/schemas/leaderboard.schema";

export default function PrizeFields() {
  const { control, register, setValue, getValues } =
    useFormContext<LeaderboardFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes",
  });

  const handleRemove = (index: number) => {
    remove(index);

    const updated = getValues("prizes").map((p, i) => ({
      ...p,
      rank: i + 1,
    }));

    setValue("prizes", updated, { shouldValidate: true });
  };

  const handleAdd = () => {
    append({
      rank: fields.length + 1,
      name: "",
      type: "coins",
      amount: 1,
      imageUrl: "",
      imageFile: undefined,
    });
  };

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
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Rank"
                    type="number"
                    sx={{
                      width: 100,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`prizes.${index}.rank`, {
                      valueAsNumber: true,
                    })}
                  />

                  <TextField
                    label="Name"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`prizes.${index}.name`)}
                  />

                  <IconButton color="error" onClick={() => handleRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>

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
                      width: 150,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 6,
                      },
                    }}
                    {...register(`prizes.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                  />

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
              </Stack>
            </Paper>
          );
        })}

        <Button
          variant="outlined"
          onClick={handleAdd}
          sx={{
            borderRadius: 20,
          }}
        >
          Add Prize
        </Button>
      </Stack>
    </Paper>
  );
}
