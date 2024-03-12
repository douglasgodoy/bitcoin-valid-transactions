import dotenv from 'dotenv';
import dynamodb from './src/infra/dynamo/dynamodb';
import { DynamoDBSingleton } from './src/infra/dynamo/DynamoSingleton';
import {
  getValidTransactions,
  processTransactions,
} from './src/modules/Transaction';
import { dropTable, storeData } from 'src/utils/helpers';

dotenv.config();

try {
  await dynamodb.startDatabase();
  const databaseInstance = DynamoDBSingleton.getInstance();

  await storeData(databaseInstance);

  const validTransactions = await getValidTransactions(databaseInstance);

  processTransactions(validTransactions);
} catch (error) {
  console.error('An error occurred', error);
} finally {
  dropTable();
}
