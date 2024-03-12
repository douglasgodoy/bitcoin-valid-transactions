import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { Transaction } from '../types';

const tableName = <string>process.env.DYNAMO_TABLE;

export async function saveTransactions(
  filePath: string,
  databaseInstance: AWS.DynamoDB.DocumentClient,
) {
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
              Amount:
                typeof transaction.amount === 'bigint'
                  ? BigInt(transaction.amount)
                  : transaction.amount,
              PK: transaction.address,
              SK: `TRANSACTION#${randomUUID()}`,
              Confirmations: transaction.confirmations,
              Label: transaction.label,
              Category: transaction.category,
              Txid: transaction.txid,
              Blockindex: transaction.blockindex,
              ReceivedAt: transaction.timereceived,
            },
          },
        })),
      },
    };

    await databaseInstance.batchWrite(params).promise();

    startIndex = endIndex;
  }
}
