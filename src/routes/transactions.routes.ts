import { Router } from 'express';

import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import Category from '../models/Category';
import DeleteTransactionService from '../services/DeleteTransactionService';

import uploadConfig from '../config/uploadConfig';

import ImportTransactionsService from '../services/ImportTransactionsService';

interface TransactionsList {
  id: string;
  title: string;
  type: string;
  value: number;
  category: object;
  created_at: Date;
  updated_at: Date;
}

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);

  const balance = await transactionsRepository.getBalance();
  const transactions = await transactionsRepository.find();
  const categories = await categoriesRepository.find();

  const transactionData: TransactionsList[] = transactions.map(transaction => {
    const categoryIndex = categories.findIndex(
      category => category.id === transaction.category_id,
    );

    return {
      id: transaction.id,
      title: transaction.title,
      type: transaction.type,
      value: Number(transaction.value),
      category: categories[categoryIndex],
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
    };
  });

  return response.json({
    transactions: transactionData,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const imported = await importTransactionsService.execute(
      request.file.filename,
    );

    response.json(imported);
  },
);

export default transactionsRouter;
