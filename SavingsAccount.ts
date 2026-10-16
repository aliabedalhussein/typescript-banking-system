
import { BankAccount } from "./BankAccount";
import { TransactionManager } from "./TransactionManager";
import { TransactionType } from "./TransactionType";

export class SavingsAccount extends BankAccount {

    private withdrawalsThisMonth: number = 0;

    private static readonly MAX_WITHDRAWALS: number = 6;

    constructor(accountHolder: string, initialDeposit: number) {
        super(accountHolder, initialDeposit);
    }

    public getAccountType(): string {
        return "Savings";
    }

    public getMonthlyFee(): number {
        return 0;
    }

    public getInterestRate(): number {
        return 0.02;
    }

    protected override canWithdraw(amount: number): boolean {
        return super.canWithdraw(amount) &&
               this.withdrawalsThisMonth < SavingsAccount.MAX_WITHDRAWALS;
    }

    public override withdraw(amount: number): boolean {

        const success = super.withdraw(amount);

        if (success) {
            this.withdrawalsThisMonth++;
        }

        return success;
    }

    public applyMonthlyInterest(): void {

        const interest = this.roundMoney(
            this.balance * this.getInterestRate() / 12
        );

        if (interest <= 0) {
            return;
        }

        this.balance = this.roundMoney(
            this.balance + interest
        );

        const transaction = TransactionManager.createTransaction(
            TransactionType.INTEREST,
            interest,
            this.balance,
            "Monthly interest applied"
        );

        this.transactions.push(transaction);
    }

    public getRemainingWithdrawals(): number {
        return SavingsAccount.MAX_WITHDRAWALS - this.withdrawalsThisMonth;
    }

    public resetMonthlyWithdrawals(): void {
        this.withdrawalsThisMonth = 0;
    }

    protected override onTransferSent(): void {
        this.withdrawalsThisMonth++;
    }
}
