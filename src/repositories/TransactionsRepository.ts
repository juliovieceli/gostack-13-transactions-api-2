import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();
    const initialValue = 0;

    const sumIncome = transactions.reduce(
      (accumulator, currentValue) =>
        currentValue.type === 'income'
          ? accumulator + Number(currentValue.value)
          : accumulator + 0,
      initialValue,
    );

    const sumOutcome = transactions.reduce(
      (accumulator, currentValue) =>
        currentValue.type === 'outcome'
          ? accumulator + Number(currentValue.value)
          : accumulator + 0,
      initialValue,
    );

    const balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: sumIncome - sumOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
