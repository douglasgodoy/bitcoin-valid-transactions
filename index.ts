import dotenv from 'dotenv';
import dynamodb from './src/infra/dynamo/dynamodb';
import createCustomers from './src/modules/Customer/createCustomers';
import { DynamoDBSingleton } from './src/infra/dynamo/DynamoSingleton';
import {
  getValidTransactions,
  processTransactions,
  saveTransactions,
} from './src/modules/Transaction';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

dotenv.config();

try {
  console.log('started...');
  await dynamodb.startDatabase();
  const databaseInstance = DynamoDBSingleton.getInstance();

  createCustomers(databaseInstance);
  await saveAllTransactions(databaseInstance);
  const validTransactions = await getValidTransactions(databaseInstance);

  processTransactions(validTransactions);
} catch (error) {
  console.error('An error occurred', error);
} finally {
  console.warn('dropping table..');

  await DynamoDBSingleton.getDatabase()
    .deleteTable({
      TableName: <string>process.env.DYNAMO_TABLE,
    })
    .promise();
}

async function saveAllTransactions(databaseInstance: DocumentClient) {
  return await Promise.all([
    saveTransactions('./transactions-1.json', databaseInstance),
    saveTransactions('./transactions-2.json', databaseInstance),
  ]);
}
