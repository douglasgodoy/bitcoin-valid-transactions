import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TransactionFromDB } from '../types';

export async function getValidTransactions(
  databaseInstance: AWS.DynamoDB.DocumentClient,
): Promise<TransactionFromDB[]> {
  console.log('Getting valid transactions...');
  const params: DocumentClient.QueryInput = {
    TableName: <string>process.env.DATABASE_TABLE,
    IndexName: 'GSI-Category-Confirmations',
    KeyConditionExpression:
      '#category = :category AND #confirmations > :confirmations',
    ExpressionAttributeNames: {
      '#category': 'Category',
      '#confirmations': 'Confirmations',
    },
    ExpressionAttributeValues: {
      ':category': 'receive',
      ':confirmations': 5,
    },
  };

  const response = await databaseInstance.query(params).promise();

  return response.Items as TransactionFromDB[];
}
