
import { BankAccount } from "./BankAccount";
import { CheckingAccount } from "./CheckingAccount";
import { SavingsAccount } from "./SavingsAccount";
import { BusinessAccount } from "./BusinessAccount";

export class Bank {

    private bankName: string;
    private lastProcessedMonth: string | null = null;

    constructor(bankName: string) {
        this.bankName = bankName;
    }

    public get name(): string {
        return this.bankName;
    }

    public createCheckingAccount(
        accountHolder: string,
        initialDeposit: number,
        overdraftLimit: number = 0
    ): CheckingAccount {

        return new CheckingAccount(
            accountHolder,
            initialDeposit,
            overdraftLimit
        );
    }

    public createSavingsAccount(
        accountHolder: string,
        initialDeposit: number
    ): SavingsAccount {

        return new SavingsAccount(
            accountHolder,
            initialDeposit
        );
    }

    public createBusinessAccount(
        accountHolder: string,
        businessName: string,
        initialDeposit: number
    ): BusinessAccount {

        return new BusinessAccount(
            accountHolder,
            businessName,
            initialDeposit
        );
    }

    public findAccount(accountNumber: string): BankAccount | undefined {
        return BankAccount.findAccount(accountNumber);
    }

    public getAllAccounts(): BankAccount[] {
        return BankAccount.getAllAccounts();
    }

    public transferMoney(
        fromAccountNumber: string,
        toAccountNumber: string,
        amount: number
    ): boolean {

        const fromAccount = this.findAccount(fromAccountNumber);
        const toAccount = this.findAccount(toAccountNumber);

        if (!fromAccount || !toAccount) {
            return false;
        }

        return fromAccount.transferTo(toAccount, amount);
    }

    public getTotalAccounts(): number {
        return BankAccount.getTotalAccounts();
    }

    public getTotalDeposits(): number {
        return BankAccount.getTotalDeposits();
    }

    public generateReport(): string {

        let report = `Bank Report: ${this.bankName}\n`;

        report += `Total Accounts: ${this.getTotalAccounts()}\n`;

        report += `Total Balance: $${this.getTotalDeposits()}\n`;

        report += "\n--- Account Details ---\n";

        for (const account of this.getAllAccounts()) {

            report += `${account.accountNumber} | `;
            report += `${account.accountHolder} | `;
            report += `${account.getAccountType()} | `;
            report += `$${account.currentBalance}\n`;
        }

        return report;
    }

    public processMonthlyOperations(): void {

        const currentMonth = new Date().toISOString().slice(0, 7);

        if (this.lastProcessedMonth === currentMonth) {
            console.log("Monthly operations already processed.");
            return;
        }

        const accounts = this.getAllAccounts();

        for (const account of accounts) {
            account.applyMonthlyFee();

            if(account instanceof SavingsAccount){
                account.applyMonthlyInterest();
                account.resetMonthlyWithdrawals();
            }

            if(account instanceof BusinessAccount){
                account.applyMonthlyInterest();
            }
        }

        this.lastProcessedMonth = currentMonth;
    }
}
