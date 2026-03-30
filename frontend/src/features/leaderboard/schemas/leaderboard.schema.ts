import { z } from "zod";

//   Prize schema
export const prizeSchema = z.object({
    rank: z.number().int().min(1, "Rank must be at least 1"),
    name: z.string().min(1, "Prize name is required"),
    type: z.enum(["coins", "freeSpin", "bonus"]),
    amount: z.number().int().min(1, "Amount must be at least 1"),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    imageFile: z.any().optional(),
});

//  Leaderboard schema
export const leaderboardSchema = z
    .object({
        title: z
            .string()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title must be at most 100 characters"),

        description: z.string().optional(),

        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),

        status: z.enum(["draft", "active", "completed"]),

        scoringType: z.enum(["points", "wins", "wagered"]),

        maxParticipants: z
            .number()
            .int()
            .min(2, "Minimum 2 participants required"),

        prizes: z
            .array(prizeSchema)
            .min(1, "At least one prize is required"),
    })

    // Cross - field validation: date range
    .refine(
        (data) => new Date(data.endDate) > new Date(data.startDate),
        {
            message: "End date must be after start date",
            path: ["endDate"],
        }
    )

    //  Cross-field validation: prize ranks
    .refine((data) => {
        const ranks = data.prizes.map((p) => p.rank);

        // Unique ranks
        const uniqueRanks = new Set(ranks);
        if (uniqueRanks.size !== ranks.length) return false;

        // Sequential ranks starting from 1
        const sorted = [...ranks].sort((a, b) => a - b);
        return sorted.every((rank, index) => rank === index + 1);
    }, {
        message: "Prize ranks must be unique and sequential starting from 1",
        path: ["prizes"],
    });

//  Types inferred from schema
export type LeaderboardFormValues = z.infer<typeof leaderboardSchema>;
export type Prize = z.infer<typeof prizeSchema> & {
    imageFile?: File;
};