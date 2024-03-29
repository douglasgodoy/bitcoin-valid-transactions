import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { Transaction } from '../types';

const tableName = <string>process.env.DATABASE_TABLE;

export async function saveTransactions(
  filePath: string,
  databaseInstance: AWS.DynamoDB.DocumentClient,
) {
  console.log('Storing transactions data...');

  const content = (await readFile(filePath)).toString();
  const { transactions } = JSON.parse(content);

  const batchSize = 25;
  const totalTransactions = transactions.length;
  let startIndex = 0;

  while (startIndex < totalTransactions) {
    const endIndex = Math.min(startIndex + batchSize, totalTransactions);
    const batchTransactions = transactions.slice(startIndex, endIndex);

    const params = {
      RequestItems: {
        [tableName]: batchTransactions.map((transaction: Transaction) => ({
          PutRequest: {
            Item: {
              Amount: Number(transaction.amount),
              PK: transaction.address,
              SK: `TRANSACTION#${randomUUID()}`,
              Confirmations: transaction.confirmations,
              Label: transaction.label,
              Category: transaction.category,
              Blockindex: transaction.blockindex,
              ReceivedAt: transaction.timereceived,
              Txid: transaction.txid,
            },
          },
        })),
      },
    };

    await databaseInstance.batchWrite(params).promise();

    startIndex = endIndex;
  }
}
