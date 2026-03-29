export type RaffleStatus = 'draft' | 'active' | 'drawn' | 'cancelled';

export interface Raffle {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: RaffleStatus;
  ticketPrice: number;
  maxTicketsPerUser: number;
  totalTicketLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetRafflesParams {
  page?: number;
  limit?: number;
  status?: RaffleStatus;
  startDate?: string;
  endDate?: string;
}