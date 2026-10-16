# TypeScript Banking System

A console-based banking system built with **TypeScript**, demonstrating Object-Oriented Programming (OOP) principles through account management, financial transactions, and banking operations.

## Features

### Account Management
- Create Checking, Savings, and Business accounts
- Generate unique account numbers
- Search and manage accounts
- Freeze and unfreeze accounts
- Track account balances and transaction history

### Banking Operations
- Deposit and withdraw funds
- Transfer money between accounts
- Checking account overdraft support
- Savings account monthly withdrawal limits
- Business account transaction fees
- Monthly account maintenance fees
- Monthly interest calculations
- Bank statistics and reports

### Validation
- Reject invalid transaction amounts
- Prevent transactions on frozen accounts
- Enforce withdrawal and overdraft limits
- Prevent transfers to the same account
- Prevent duplicate monthly processing within a bank instance

## Technologies

- TypeScript
- Node.js
- Object-Oriented Programming (OOP)

## OOP Concepts Demonstrated

- **Abstraction:** Abstract `BankAccount` class
- **Inheritance:** Specialized account classes
- **Encapsulation:** Private and protected properties
- **Polymorphism:** Overridden methods for different account types
- **Interfaces and Enums:** Structured transaction data and types
- **Static Members:** Account registry and transaction management

## Testing

The Banking System includes a comprehensive test driver covering 14 testing sections.

**Test Results:**
- 69 tests passed
- 0 tests failed
- 100% pass rate for implemented features covered by the tests

Run the tests using:

```bash
npm run banking
```

## Future Improvements

- Daily withdrawal limits
- Monthly account statements
- Account filtering by holder and type
- Persistent database storage

## Project Purpose

This project was developed as a practical TypeScript and Object-Oriented Programming exercise to strengthen software engineering skills through real-world-inspired banking operations.

*Educational project — not intended for production banking use.*
