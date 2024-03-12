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
        sum: Number(customerMap.get(key).sum) + Number(transaction.Amount),
        count: customerMap.get(key).count + 1,
      });
    } else {
      customerMap.set(key, {
        sum: Number(transaction.Amount),
        count: 1,
      });
    }

    smallestValidDeposit = Math.min(smallestValidDeposit, transaction.Amount);
    largestValidDeposit = Math.max(largestValidDeposit, transaction.Amount);
  }

  const noReference = customerMap.get(undefined);
  customerMap.delete(undefined);

  console.log(
    '-------------------------RESULT---------------------------------',
  );

  for (const customerName of Object.values(CUSTOMERS_MAP)) {
    console.log(
      `Deposited for ${customerName}: count=${
        customerMap.get(customerName).count
      } sum=${customerMap.get(customerName).sum}`,
    );
  }

  console.log(
    `Deposited without reference: count=${noReference.count} sum=${noReference.sum}`,
  );

  console.log(`Smallest valid deposit: ${smallestValidDeposit}`);

  console.log(`Largest valid deposit: ${largestValidDeposit}`);
  console.log(
    '---------------------------------------------------------------',
  );
}
