import { TransactionFromDB } from '../types';
import { implementCustomerMap, launchResults } from 'src/utils/helpers';

export function processTransactions(transactions: TransactionFromDB[]) {
  const customerMap = new Map();

  let { smallestValidDeposit, largestValidDeposit } = implementCustomerMap(
    transactions,
    customerMap,
  );

  launchResults(customerMap, smallestValidDeposit, largestValidDeposit);
}
