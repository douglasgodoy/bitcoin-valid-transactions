import { CUSTOMERS } from '../../../constants';

export default async function createCustomers(
  dynamoInstance: AWS.DynamoDB.DocumentClient,
): Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput> {
  console.log('creating customers...');
  const tableName = <string>process.env.DYNAMO_TABLE;

  const params = {
    RequestItems: {
      [tableName]: CUSTOMERS.map((customer) => ({
        PutRequest: {
          Item: {
            UserName: customer.UserName,
            PK: customer.WId,
            SK: 'CUSTOMER',
          },
        },
      })),
    },
  };

  return await dynamoInstance.batchWrite(params).promise();
}
