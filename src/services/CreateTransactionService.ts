import { getRepository, getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    let categoryData: Category;

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('You dont have balance for this operation', 400);
    }
    const checkIfCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkIfCategoryExists) {
      const newCategory = categoryRepository.create({
        title: category,
      });
      categoryData = await categoryRepository.save(newCategory);
    } else {
      categoryData = checkIfCategoryExists;
    }

    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryData.id,
    });

    const transaction = await transactionRepository.save(newTransaction);

    return transaction;
  }
}

export default CreateTransactionService;
