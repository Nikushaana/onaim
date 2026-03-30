import { z } from "zod";

// Prize schema
export const rafflePrizeSchema = z.object({
  name: z.string().min(1, "Prize name is required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z.number().int().min(1, "Amount must be at least 1"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  imageFile: z.any().optional(),
});

// Raffle schema
export const raffleSchema = z
  .object({
    name: z.string().min(3).max(80),

    description: z.string().optional(),

    startDate: z.string().min(1),
    endDate: z.string().min(1),
    drawDate: z.string().min(1),

    status: z.enum(["draft", "active", "drawn", "cancelled"]),

    ticketPrice: z.number().positive("Must be positive"),

    maxTicketsPerUser: z
      .number()
      .int()
      .min(1, "Minimum 1 ticket per user"),

    totalTicketLimit: z.number().int().nullable(),

    prizes: z.array(rafflePrizeSchema).min(1),
  })

  // date validations
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })

  .refine((data) => new Date(data.drawDate) > new Date(data.endDate), {
    message: "Draw date must be after end date",
    path: ["drawDate"],
  });

export type RaffleFormValues = z.infer<typeof raffleSchema>;