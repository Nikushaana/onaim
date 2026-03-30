export type LeaderboardStatus = 'draft' | 'active' | 'completed';

export interface Prize {
  id: string;
  rank: number;
  name: string;
  type: string;
  amount: number;
  imageUrl: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: LeaderboardStatus;
  scoringType: string;
  prizes?: Prize[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetLeaderboardsParams {
  page?: number;
  limit?: number;
  status?: LeaderboardStatus;
  sortBy?: keyof Leaderboard;
  order?: 'ASC' | 'DESC';
}

export type PrizeType = "coins" | "freeSpin" | "bonus";

export interface LeaderboardPrizePayload {
  rank: number;
  name: string;
  type: PrizeType;
  amount: number;
  imageUrl?: string;
}

export interface LeaderboardPayload {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: LeaderboardStatus;
  scoringType: "points" | "wins" | "wagered";
  maxParticipants: number;
  prizes: LeaderboardPrizePayload[];
}