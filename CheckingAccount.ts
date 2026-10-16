
import { BankAccount } from "./BankAccount";

export class CheckingAccount extends BankAccount {

    private overdraftLimit: number;

    constructor(
        accountHolder: string,
        initialDeposit: number,
        overdraftLimit: number = 0
    ) {
        super(accountHolder, initialDeposit);

        if (!BankAccount.isValidMoney(overdraftLimit)) {
            throw new Error("Invalid overdraft limit");
        }

        this.overdraftLimit = overdraftLimit;
    }

    public getAccountType(): string {
        return "Checking";
    }

    public getMonthlyFee(): number {
        return 5;
    }

    public getInterestRate(): number {
        return 0;
    }

    protected override canWithdraw(amount: number): boolean {
        return !this.frozen &&
            BankAccount.isValidMoney(amount) &&
            amount > 0 &&
            amount <= this.balance + this.overdraftLimit;
    }

    public setOverdraftLimit(limit: number): void {
        if (BankAccount.isValidMoney(limit)) {
            this.overdraftLimit = limit;
        }
    }

    public getAvailableBalance(): number {
        return this.roundMoney(this.balance + this.overdraftLimit);
    }
}
