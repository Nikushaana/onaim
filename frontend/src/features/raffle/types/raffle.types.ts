export type RaffleStatus = 'draft' | 'active' | 'drawn' | 'cancelled';

export type PrizeType = 'coins' | 'freeSpin' | 'bonus';

export interface Prize {
  id: string;
  name: string;
  type: PrizeType;
  amount: number;
  quantity: number;
  imageUrl?: string;
}

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
  prizes?: Prize[];
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

export interface RafflePrizePayload {
  name: string;
  type: PrizeType;
  amount: number;
  quantity: number;
  imageUrl?: string;
}

export interface RafflePayload {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: RaffleStatus;
  ticketPrice: number;
  maxTicketsPerUser: number;
  totalTicketLimit: number | null;
  prizes: RafflePrizePayload[];
}