import axios from "./axios";
import {
  FundTransaction,
  Paginated,
  PointTransaction,
  QueryParams,
  TransactionType,
} from "@/types";

const getBalance = async (): Promise<{ points: number; balance: number }> => {
  const response = await axios.get<{ points: number; balance: number }>(
    `/finance/balance`,
  );
  return response.data;
};

const getTransactions = async (
  params: QueryParams,
): Promise<Paginated<PointTransaction>> => {
  const response = await axios.get<Paginated<PointTransaction>>(
    `/finance/transactions`,
    { params },
  );
  return response.data;
};

const getFundTransactions = async (
  params: QueryParams,
): Promise<Paginated<FundTransaction>> => {
  const response = await axios.get<Paginated<FundTransaction>>(
    `/finance/fund-transactions`,
    { params },
  );
  return response.data;
};

const addFunds = async (
  amount: number,
  type?: TransactionType,
  metadata?: Record<string, any>,
): Promise<{ success: boolean }> => {
  const response = await axios.post<{ success: boolean }>(
    `/finance/add-funds`,
    {
      amount,
      type,
      metadata,
    },
  );
  return response.data;
};

const addPoints = async (
  amount: number,
  type?: TransactionType,
  metadata?: Record<string, any>,
): Promise<{ success: boolean }> => {
  const response = await axios.post<{ success: boolean }>(
    `/finance/add-points`,
    {
      amount,
      type,
      metadata,
    },
  );
  return response.data;
};

const topUpFunds = async (amount: number): Promise<{ success: boolean }> => {
  const response = await axios.post<{ success: boolean }>(
    `/finance/top-up-funds`,
    { amount },
  );
  return response.data;
};

const topUpPoints = async (amount: number): Promise<{ success: boolean }> => {
  const response = await axios.post<{ success: boolean }>(
    `/finance/top-up-points`,
    { amount },
  );
  return response.data;
};

export const finance = {
  getBalance,
  getTransactions,
  getFundTransactions,
  addFunds,
  addPoints,
  topUpFunds,
  topUpPoints,
};
