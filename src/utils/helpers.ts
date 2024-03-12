import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { CUSTOMERS_MAP } from 'src/constants';
import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import { createCustomers } from 'src/modules/Customer';
import { saveTransactions } from 'src/modules/Transaction';
import { TransactionFromDB } from 'src/modules/Transaction/types';

export async function saveAllTransactions(databaseInstance: DocumentClient) {
  return await Promise.all([
    saveTransactions('./transactions-1.json', databaseInstance),
    saveTransactions('./transactions-2.json', databaseInstance),
  ]);
}

export function dropTable() {
  console.warn('dropping table..');

  DynamoDBSingleton.getDatabase()
    .deleteTable({
      TableName: <string>process.env.DATABASE_TABLE,
    })
    .promise();
}

export async function storeData(databaseInstance: DocumentClient) {
  await Promise.all([
    createCustomers(databaseInstance),
    saveAllTransactions(databaseInstance),
  ]);
}

export function implementCustomerMap(
  transactions: TransactionFromDB[],
  customerMap: Map<string, any>,
) {
  let smallestValidDeposit = Infinity;
  let largestValidDeposit = 0;

  for (const transaction of transactions || []) {
    const key = CUSTOMERS_MAP[transaction.PK] || 'noReference';

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
  return { smallestValidDeposit, largestValidDeposit };
}

export function launchResults(
  customerMap: Map<any, any>,
  smallestValidDeposit: number,
  largestValidDeposit: number,
) {
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

  const noReference = customerMap.get('noReference');
  console.log(
    `Deposited without reference: count=${noReference.count} sum=${noReference.sum}`,
  );
  console.log(`Smallest valid deposit: ${smallestValidDeposit}`);
  console.log(`Largest valid deposit: ${largestValidDeposit}`);

  console.log(
    '---------------------------------------------------------------',
  );
}
