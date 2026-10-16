
import { BankAccount } from "./BankAccount";
import { TransactionManager } from "./TransactionManager";
import { TransactionType } from "./TransactionType";

export class BusinessAccount extends BankAccount {

    private businessName: string;
    private transactionFee: number = 0.10;

    constructor(
        accountHolder: string,
        businessName: string,
        initialDeposit: number
    ) {
        super(accountHolder, initialDeposit);

        this.businessName = businessName;
    }

    public getAccountType(): string {
        return "Business";
    }

    public getMonthlyFee(): number {
        return 25;
    }

    public getInterestRate(): number {
        return 0.01;
    }

    public getBusinessName(): string {
        return this.businessName;
    }

    public override deposit(amount: number): boolean {

        if (
            this.frozen ||
            !BankAccount.isValidMoney(amount) ||
            amount <= 0
        ) {
            return false;
        }

        const success = super.deposit(amount);

        if (success) {

            this.balance = this.roundMoney(
                this.balance - this.transactionFee
            );

            const transaction = TransactionManager.createTransaction(
                TransactionType.FEE,
                this.transactionFee,
                this.balance,
                "Business deposit transaction fee"
            );

            this.transactions.push(transaction);
        }

        return success;
    }

    protected override canWithdraw(amount: number): boolean {

        return super.canWithdraw(amount) &&
            this.roundMoney(amount + this.transactionFee) <= this.balance;
    }

    protected override canTransfer(amount: number): boolean {

        return super.canTransfer(amount) &&
            this.roundMoney(amount + this.transactionFee) <= this.balance;
    }

    public override withdraw(amount: number): boolean {

        if (!this.canWithdraw(amount)) {
            return false;
        }

        const success = super.withdraw(amount);

        if (success) {

            this.balance = this.roundMoney(
                this.balance - this.transactionFee
            );

            const transaction = TransactionManager.createTransaction(
                TransactionType.FEE,
                this.transactionFee,
                this.balance,
                "Business withdrawal transaction fee"
            );

            this.transactions.push(transaction);
        }

        return success;
    }

    public processTransaction(
        amount: number,
        type: TransactionType
    ): boolean {

        if (type === TransactionType.DEPOSIT) {
            return this.deposit(amount);
        }

        if (type === TransactionType.WITHDRAWAL) {
            return this.withdraw(amount);
        }

        return false;
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
            "Monthly business interest"
        );

        this.transactions.push(transaction);
    }

    protected override onTransferSent(): void {

        this.balance = this.roundMoney(
            this.balance - this.transactionFee
        );

        const transaction = TransactionManager.createTransaction(
            TransactionType.FEE,
            this.transactionFee,
            this.balance,
            "Business transfer fee"
        );

        this.transactions.push(transaction);
    }
}
