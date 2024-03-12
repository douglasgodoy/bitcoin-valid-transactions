import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDBSingleton } from 'src/infra/dynamo/DynamoSingleton';
import { createCustomers } from 'src/modules/Customer';
import { saveTransactions } from 'src/modules/Transaction';

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
