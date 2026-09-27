export enum TransactionType {
  BOUGHT_VIA_CREDIT_CARD = "BOUGHT_VIA_CREDIT_CARD",
  RECEIVED_PAYMENT = "RECEIVED_PAYMENT",
  APPLYING_FOR_JOB = "APPLYING_FOR_JOB",
  APPLICATION_FEE_REFUNDED = "APPLICATION_FEE_REFUNDED",
}

export class PointTransaction {
  id: string;
  amount: number;
  type?: TransactionType | "CREDIT" | "DEBIT" | string;
  metadata?: Record<string, any>;
  description?: string;
  createdAt: string;

  constructor(data: Partial<PointTransaction>) {
    this.id = data.id!;
    this.amount = data.amount!;
    this.type = data.type;
    this.metadata = data.metadata;
    this.description = data.description;
    this.createdAt = data.createdAt!;
  }
}

export class FundTransaction {
  id: string;
  amount: number;
  type?: TransactionType | string;
  metadata?: Record<string, any>;
  createdAt: string;

  constructor(data: Partial<FundTransaction>) {
    this.id = data.id!;
    this.amount = data.amount!;
    this.type = data.type;
    this.metadata = data.metadata;
    this.createdAt = data.createdAt!;
  }
}
