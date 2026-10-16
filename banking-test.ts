
import {
    Bank,
    BankAccount,
    CheckingAccount,
    SavingsAccount,
    BusinessAccount,
    TransactionType
} from "./main";

console.log("🏦 BANKING SYSTEM - COMPLETE TEST DRIVER");
console.log("=".repeat(55));

let passed = 0;
let failed = 0;

function test(name: string, condition: boolean): void {
    if (condition) {
        console.log(`✓ PASS: ${name}`);
        passed++;
    } else {
        console.log(`✗ FAIL: ${name}`);
        failed++;
    }
}

function section(title: string): void {
    console.log(`\n${"=".repeat(55)}`);
    console.log(title);
    console.log("=".repeat(55));
}

try {

    // ==========================================
    // TEST 1: BANK CREATION
    // ==========================================

    section("TEST 1: BANK CREATION");

    const bank = new Bank("First National Bank");

    test("Bank created", bank.name === "First National Bank");

    // ==========================================
    // TEST 2: ACCOUNT CREATION
    // ==========================================

    section("TEST 2: ACCOUNT CREATION");

    const checking: CheckingAccount =
        bank.createCheckingAccount("Alice Johnson", 1000, 500);

    const savings: SavingsAccount =
        bank.createSavingsAccount("Bob Smith", 5000);

    const business: BusinessAccount =
        bank.createBusinessAccount(
            "Charlie Brown",
            "Charlie's Shop",
            10000
        );

    test("Checking account created", checking.getAccountType() === "Checking");
    test("Savings account created", savings.getAccountType() === "Savings");
    test("Business account created", business.getAccountType() === "Business");

    test("Checking initial balance", checking.currentBalance === 1000);
    test("Savings initial balance", savings.currentBalance === 5000);
    test("Business initial balance", business.currentBalance === 10000);

    test("Checking overdraft available", checking.getAvailableBalance() === 1500);

    console.log("Checking:", checking.accountNumber);
    console.log("Savings:", savings.accountNumber);
    console.log("Business:", business.accountNumber);

    // ==========================================
    // TEST 3: BASIC TRANSACTIONS
    // ==========================================

    section("TEST 3: DEPOSITS AND WITHDRAWALS");

    test("Checking deposit $500", checking.deposit(500) === true);

    test("Checking balance after deposit", checking.currentBalance === 1500);

    test("Checking overdraft withdrawal $2000",
        checking.withdraw(2000) === true);

    test("Checking balance after withdrawal",
        checking.currentBalance === -500);

    test("Checking available balance",
        checking.getAvailableBalance() === 0);

    test("Reject withdrawal beyond overdraft",
        checking.withdraw(100) === false);

    // ==========================================
    // TEST 4: SAVINGS WITHDRAWAL LIMITS
    // ==========================================

    section("TEST 4: SAVINGS WITHDRAWAL LIMITS");

    for (let i = 1; i <= 6; i++) {
        test(`Savings withdrawal ${i}`,
            savings.withdraw(100) === true);
    }

    test("Reject 7th savings withdrawal",
        savings.withdraw(100) === false);

    test("Remaining withdrawals = 0",
        savings.getRemainingWithdrawals() === 0);

    test("Savings balance = $4400",
        savings.currentBalance === 4400);

    // ==========================================
    // TEST 5: SAVINGS INTEREST
    // ==========================================

    section("TEST 5: SAVINGS INTEREST");

    savings.applyMonthlyInterest();

    // 4400 * 0.02 / 12 = 7.33
    test("Savings interest calculated",
        savings.currentBalance === 4407.33);

    test("Savings annual interest rate = 2%",
        savings.getInterestRate() === 0.02);

    savings.resetMonthlyWithdrawals();

    test("Savings withdrawal limit reset",
        savings.getRemainingWithdrawals() === 6);

    // ==========================================
    // TEST 6: BUSINESS TRANSACTION FEES
    // ==========================================

    section("TEST 6: BUSINESS TRANSACTION FEES");

    test("Business deposit $1000",
        business.deposit(1000) === true);

    // 10000 + 1000 - 0.10
    test("Business deposit fee applied",
        business.currentBalance === 10999.90);

    test("Business withdrawal $500",
        business.withdraw(500) === true);

    // 10999.90 - 500 - 0.10
    test("Business withdrawal fee applied",
        business.currentBalance === 10499.80);

    test("Business monthly fee = $25",
        business.getMonthlyFee() === 25);

    // ==========================================
    // TEST 7: TRANSFERS
    // ==========================================

    section("TEST 7: ACCOUNT TRANSFERS");

    test("Transfer $1000 from Savings to Checking",
        bank.transferMoney(
            savings.accountNumber,
            checking.accountNumber,
            1000
        ) === true);

    test("Savings balance after transfer",
        savings.currentBalance === 3407.33);

    test("Checking balance after transfer",
        checking.currentBalance === 500);

    test("Reject transfer to same account",
        checking.transferTo(checking, 100) === false);

    test("Reject transfer to unknown account",
        bank.transferMoney(
            checking.accountNumber,
            "FAKE123",
            100
        ) === false);

    // ==========================================
    // TEST 8: STATIC ACCOUNT MANAGEMENT
    // ==========================================

    section("TEST 8: STATIC ACCOUNT MANAGEMENT");

    test("Total accounts = 3",
        BankAccount.getTotalAccounts() === 3);

    test("Find checking account",
        BankAccount.findAccount(checking.accountNumber) === checking);

    test("Find unknown account",
        BankAccount.findAccount("FAKE123") === undefined);

    test("Get all accounts",
        BankAccount.getAllAccounts().length === 3);

    console.log(
        "Total balances:",
        BankAccount.getTotalDeposits().toFixed(2)
    );

    // ==========================================
    // TEST 9: TRANSACTION HISTORY
    // ==========================================

    section("TEST 9: TRANSACTION HISTORY");

    test("Checking has transactions",
        checking.transactionHistory.length > 0);

    test("Savings has transactions",
        savings.transactionHistory.length > 0);

    test("Business has transactions",
        business.transactionHistory.length > 0);

    const businessFees = business.transactionHistory.filter(
        transaction => transaction.type === TransactionType.FEE
    );

    test("Business fee transactions recorded",
        businessFees.length === 2);

    console.log("\nLast 3 checking transactions:");

    checking.transactionHistory.slice(-3).forEach(transaction => {
        console.log(
            `${transaction.id} | ${transaction.type} | $${transaction.amount}`
        );
    });

    // ==========================================
    // TEST 10: ACCOUNT FREEZING
    // ==========================================

    section("TEST 10: ACCOUNT FREEZING");

    checking.freeze();

    test("Checking account frozen",
        checking.frozen === true);

    test("Reject deposit while frozen",
        checking.deposit(100) === false);

    test("Reject withdrawal while frozen",
        checking.withdraw(100) === false);

    test("Reject transfer while frozen",
        checking.transferTo(savings, 100) === false);

    checking.unfreeze();

    test("Checking account unfrozen",
        checking.frozen === false);

    test("Deposit after unfreeze",
        checking.deposit(100) === true);

    // ==========================================
    // TEST 11: MONEY VALIDATION
    // ==========================================

    section("TEST 11: MONEY VALIDATION");

    test("Reject negative deposit",
        checking.deposit(-100) === false);

    test("Reject negative withdrawal",
        checking.withdraw(-100) === false);

    test("Reject NaN deposit",
        checking.deposit(NaN) === false);

    test("Reject Infinity deposit",
        checking.deposit(Infinity) === false);

    test("Reject fractional-cent deposit",
        checking.deposit(0.001) === false);

    test("Reject fractional-cent withdrawal",
        checking.withdraw(0.001) === false);

    test("Reject fractional-cent transfer",
        checking.transferTo(savings, 0.001) === false);

    try {
        bank.createSavingsAccount("Invalid", Infinity);

        test("Reject invalid initial deposit", false);

    } catch {
        test("Reject invalid initial deposit", true);
    }

    // ==========================================
    // TEST 12: MONTHLY OPERATIONS
    // ==========================================

    section("TEST 12: MONTHLY OPERATIONS");

    const checkingBefore = checking.currentBalance;
    const savingsBefore = savings.currentBalance;
    const businessBefore = business.currentBalance;

    bank.processMonthlyOperations();

    test("Checking monthly fee applied",
        checking.currentBalance === checkingBefore - 5);

    test("Savings monthly interest applied",
        savings.currentBalance > savingsBefore);

    test("Business monthly operations applied",
        business.currentBalance !== businessBefore);

    const balancesAfterFirstRun = [
        checking.currentBalance,
        savings.currentBalance,
        business.currentBalance
    ];

    bank.processMonthlyOperations();

    test("Monthly operations not repeated",
        checking.currentBalance === balancesAfterFirstRun[0] &&
        savings.currentBalance === balancesAfterFirstRun[1] &&
        business.currentBalance === balancesAfterFirstRun[2]);

    // ==========================================
    // TEST 13: ACCOUNT AGE
    // ==========================================

    section("TEST 13: ACCOUNT AGE");

    test("Checking account age is valid",
        checking.accountAge >= 0);

    test("Savings account age is valid",
        savings.accountAge >= 0);

    test("Business account age is valid",
        business.accountAge >= 0);

    // ==========================================
    // TEST 14: BANK REPORT
    // ==========================================

    section("TEST 14: BANK REPORT");

    const report = bank.generateReport();

    console.log(report);

    test("Report contains bank name",
        report.includes("First National Bank"));

    test("Report contains checking account",
        report.includes(checking.accountNumber));

    test("Report contains savings account",
        report.includes(savings.accountNumber));

    test("Report contains business account",
        report.includes(business.accountNumber));

    // ==========================================
    // FINAL SUMMARY
    // ==========================================

    section("FINAL TEST SUMMARY");

    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${passed + failed}`);

    console.log("\nAdditional features not yet tested:");
    console.log("- Daily withdrawal limits: NOT IMPLEMENTED");
    console.log("- Monthly account statements: NOT IMPLEMENTED");
    console.log("- Account filtering by holder/type: NOT IMPLEMENTED");

    if (failed === 0) {
        console.log("\n🎉 ALL IMPLEMENTED FEATURE TESTS PASSED!");
    } else {
        console.log("\n⚠️ SOME TESTS FAILED. REVIEW THE RESULTS.");
    }

} catch (error) {

    console.error("\n❌ TEST FAILED WITH ERROR:");

    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }
}
