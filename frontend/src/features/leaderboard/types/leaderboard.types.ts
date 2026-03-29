export type LeaderboardStatus = 'draft' | 'active' | 'completed';

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: LeaderboardStatus;
  scoringType: string;
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