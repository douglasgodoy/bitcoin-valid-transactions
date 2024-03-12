import { CUSTOMERS_MAP } from 'src/constants';
import { TransactionFromDB } from '../types';

export function processTransactions(transactions?: TransactionFromDB[]) {
  const customerMap = new Map();

  let smallestValidDeposit = Infinity;
  let largestValidDeposit = 0;

  for (const transaction of transactions || []) {
    const key = CUSTOMERS_MAP[transaction.PK];
    if (customerMap.has(key)) {
      customerMap.set(key, {
        sum: BigInt(customerMap.get(key).sum) + BigInt(transaction.Amount),
        count: customerMap.get(key).count + 1,
      });
    } else {
      customerMap.set(key, {
        sum: BigInt(transaction.Amount),
        count: 1,
      });
    }

    smallestValidDeposit = Math.min(smallestValidDeposit, transaction.Amount);
    largestValidDeposit = Math.max(largestValidDeposit, transaction.Amount);
  }

  const noReference = customerMap.get(undefined);
  customerMap.delete(undefined);

  for (const [customer, value] of customerMap) {
    // TODO - SORT EQUAL TO TEST
    console.log(
      `Deposited for ${customer}: count=${value.count} sum=${value.sum}}`,
    );
  }

  console.log(
    `Deposited without reference: count=${noReference.count} sum=${noReference.sum}}`,
  );

  console.log(`Smallest valid deposit: ${smallestValidDeposit}`);

  console.log(`Largest valid deposit: ${largestValidDeposit}`);
}
