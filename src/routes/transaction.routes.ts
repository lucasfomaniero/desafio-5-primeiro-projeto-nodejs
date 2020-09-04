import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    return response.json({
      transactions,
      balance: transactionsRepository.getBalance(),
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;
    const transactionService = new CreateTransactionService(
      transactionsRepository,
    );

    const createdTransaction = transactionService.execute({
      title,
      value,
      type,
    });

    if (transactionsRepository.isValidTransaction(createdTransaction)) {
      return response.status(200).json(createdTransaction);
    }
    return response.status(400).json({
      error: `The transaction's value is greater than the account balance.`,
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
