import axios from "./axios";
import { Paginated, QueryParams } from "@/types";

export interface PointTransaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt: string;
}

const getBalance = async (): Promise<{ points: number; balance: number }> => {
  const response = await axios.get<{ points: number; balance: number }>(`/finance/balance`);
  return response.data;
};

const getTransactions = async (
  params: QueryParams
): Promise<Paginated<PointTransaction>> => {
  const response = await axios.get<Paginated<PointTransaction>>(
    `/finance/transactions`,
    { params }
  );
  return response.data;
};

export const finance = {
  getBalance,
  getTransactions,
};
