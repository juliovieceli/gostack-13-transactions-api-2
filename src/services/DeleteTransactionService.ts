import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError("Can't find this trasaction", 404);
    }

    const deleted = await transactionsRepository.delete(id);

    if (!deleted) {
      throw new AppError('Ooops... An error has occurred', 500);
    }
  }
}

export default DeleteTransactionService;
