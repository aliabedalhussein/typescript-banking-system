import { Transaction } from "./Transaction";
import { TransactionType } from "./TransactionType";

export class TransactionManager{
    private static transactionCount: number = 0;

    static generateTransactionId(): string {
        this.transactionCount++;

        return `TXN${String(this.transactionCount).padStart(6,"0")}`;
    }

    static createTransaction(
        type: TransactionType,
        amount: number,
        balance: number ,
        description: string
    ): Transaction{
        return{
            id: this.generateTransactionId(),
            type:type,
            amount: amount,
            balance: balance,
            timestamp: new Date(),
            description: description
        };
    }
}