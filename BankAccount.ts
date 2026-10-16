
import { Transaction } from "./Transaction";
import { TransactionType } from "./TransactionType";
import { TransactionManager } from "./TransactionManager";

export abstract class BankAccount {

    private static accounts: Map<string, BankAccount> = new Map();
    private static accountCounter: number = 0;

    protected balance: number;
    protected transactions: Transaction[];

    public readonly accountNumber: string;
    public readonly accountHolder: string;
    public readonly dateCreated: Date;

    private isFrozen: boolean = false;

    constructor(accountHolder: string, initialDeposit: number) {

        if (!BankAccount.isValidMoney(initialDeposit)) {
            throw new Error("Invalid initial deposit amount");
        }

        BankAccount.accountCounter++;

        this.accountNumber = `ACC${String(BankAccount.accountCounter).padStart(3, "0")}`;

        this.accountHolder = accountHolder;
        this.balance = initialDeposit;
        this.transactions = [];
        this.dateCreated = new Date();

        BankAccount.accounts.set(this.accountNumber, this);
    }

    abstract getAccountType(): string;
    abstract getMonthlyFee(): number;
    abstract getInterestRate(): number;

    public deposit(amount: number): boolean {

        if (
            this.isFrozen ||
            !BankAccount.isValidMoney(amount) ||
            amount <= 0
        ) {
            return false;
        }

        this.balance = this.roundMoney(this.balance + amount);

        const transaction = TransactionManager.createTransaction(
            TransactionType.DEPOSIT,
            amount,
            this.balance,
            `Deposited $${amount}`
        );

        this.transactions.push(transaction);

        return true;
    }

    protected canWithdraw(amount: number): boolean {

        return !this.isFrozen &&
            BankAccount.isValidMoney(amount) &&
            amount > 0 &&
            amount <= this.balance;
    }

    protected canTransfer(amount: number): boolean {
        return this.canWithdraw(amount);
    }

    public withdraw(amount: number): boolean {

        if (!this.canWithdraw(amount)) {
            return false;
        }

        this.balance = this.roundMoney(this.balance - amount);

        const transaction = TransactionManager.createTransaction(
            TransactionType.WITHDRAWAL,
            amount,
            this.balance,
            `Withdrew $${amount}`
        );

        this.transactions.push(transaction);

        return true;
    }

    public get currentBalance(): number {
        return this.roundMoney(this.balance);
    }

    public get transactionHistory(): readonly Transaction[] {
        return [...this.transactions];
    }

    public get accountAge(): number {

        const now = new Date();

        const difference = now.getTime() - this.dateCreated.getTime();

        return Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );
    }

    public static findAccount(
        accountNumber: string
    ): BankAccount | undefined {

        return BankAccount.accounts.get(accountNumber);
    }

    public static getTotalAccounts(): number {
        return BankAccount.accounts.size;
    }

    public static getTotalDeposits(): number {

        let total = 0;

        for (const account of BankAccount.accounts.values()) {
            total += account.currentBalance;
        }

        return Math.round(total * 100) / 100;
    }

    public static getAllAccounts(): BankAccount[] {
        return Array.from(BankAccount.accounts.values());
    }

    public transferTo(
        receiver: BankAccount,
        amount: number
    ): boolean {

        if (
            this.isFrozen ||
            receiver.isFrozen ||
            !BankAccount.isValidMoney(amount) ||
            amount <= 0 ||
            this === receiver ||
            !this.canTransfer(amount)
        ) {
            return false;
        }

        this.balance = this.roundMoney(
            this.balance - amount
        );

        receiver.balance = this.roundMoney(
            receiver.balance + amount
        );

        this.onTransferSent();

        const sentTransaction = TransactionManager.createTransaction(
            TransactionType.TRANSFER,
            amount,
            this.balance,
            `Transfer sent to ${receiver.accountNumber}`
        );

        this.transactions.push(sentTransaction);

        const receivedTransaction = TransactionManager.createTransaction(
            TransactionType.TRANSFER,
            amount,
            receiver.balance,
            `Transfer received from ${this.accountNumber}`
        );

        receiver.transactions.push(receivedTransaction);

        return true;
    }

    public applyMonthlyFee(): void {

        const fee = this.getMonthlyFee();

        if (fee <= 0) {
            return;
        }

        this.balance = this.roundMoney(
            this.balance - fee
        );

        const transaction = TransactionManager.createTransaction(
            TransactionType.FEE,
            fee,
            this.balance,
            "Monthly account fee"
        );

        this.transactions.push(transaction);
    }

    public freeze(): void {
        this.isFrozen = true;
    }

    public unfreeze(): void {
        this.isFrozen = false;
    }

    public get frozen(): boolean {
        return this.isFrozen;
    }

    protected onTransferSent(): void {
        // Default behavior: no additional action
    }

    protected roundMoney(amount: number): number {
        return Math.round(amount * 100) / 100;
    }

    protected static isValidMoney(amount: number): boolean {

        return Number.isFinite(amount) &&
            amount >= 0 &&
            Math.abs(
                amount * 100 - Math.round(amount * 100)
            ) < 0.0000001;
    }
}
