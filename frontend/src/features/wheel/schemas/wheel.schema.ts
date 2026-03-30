import { z } from "zod";

const hexColor = /^#([0-9A-Fa-f]{6})$/;

export const wheelSegmentSchema = z.object({
  label: z.string().min(1, "Label is required"),

  color: z.string().regex(hexColor, "Invalid hex color"),

  weight: z.number().int().min(1).max(100),

  prizeType: z.enum(["coins", "freeSpin", "bonus", "nothing"]),

  prizeAmount: z.number().int().min(0),

  imageUrl: z.string().url().optional().or(z.literal("")),
  imageFile: z.any().optional(),
})
.refine(
  (seg) => {
    if (seg.prizeType === "nothing") return seg.prizeAmount === 0;
    return seg.prizeAmount > 0;
  },
  {
    message: "Invalid prizeAmount for selected prizeType",
    path: ["prizeAmount"],
  }
);

export const wheelSchema = z
  .object({
    name: z.string().min(3).max(80),

    description: z.string().optional(),

    status: z.enum(["draft", "active", "inactive"]),

    segments: z.array(wheelSegmentSchema).min(2).max(12),

    maxSpinsPerUser: z.number().int().min(1),

    spinCost: z.number().nonnegative(),

    backgroundColor: z.string().regex(hexColor),
    borderColor: z.string().regex(hexColor),
  })
  .refine(
    (data) => {
      const total = data.segments.reduce((sum, s) => sum + s.weight, 0);
      return total === 100;
    },
    {
      message: "Total segment weights must equal 100",
      path: ["segments"],
    }
  );

export type WheelFormValues = z.infer<typeof wheelSchema>;