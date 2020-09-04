import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;
    // Pode melhorar. Descobrir como.
    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.value;
      } else {
        outcome += transaction.value;
      }
    });
    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    if (
      transaction.type === 'outcome' &&
      transaction.value > this.getBalance().total
    ) {
      throw new Error('The transaction value is greater than account balance.');
    }
    this.transactions.push(transaction);
    return transaction;
  }

  public isValidTransaction(transaction: Transaction): boolean {
    console.log(this.getBalance());

    const isValid =
      transaction.type === 'outcome'
        ? this.getBalance().total >= transaction.value
        : transaction.value > 0;
    console.log(isValid);

    return isValid;
  }
}

export default TransactionsRepository;
