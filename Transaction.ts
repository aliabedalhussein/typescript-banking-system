import { TransactionType } from "./TransactionType";

export interface Transaction{
    id: string;
    type: TransactionType;
    amount: number;
    balance: number;
    timestamp: Date;
    description: string;
}