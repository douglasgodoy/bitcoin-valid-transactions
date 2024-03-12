import AWS from 'aws-sdk';
import { DatabaseType } from './types';

const dynamodb: DatabaseType = {
  startDatabase: async () => {
    await dynamodb.createTableIfNotExists();
  },

  createTableIfNotExists: async () => {
    const db = new AWS.DynamoDB({
      region: process.env.DB_REGION,
      endpoint: process.env.DB_URI,
    });

    const params = {
      TableName: <string>process.env.DYNAMO_TABLE,

      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'Confirmations', AttributeType: 'N' },
        { AttributeName: 'Category', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' }, // WalletAdress
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI-SK',
          KeySchema: [{ AttributeName: 'SK', KeyType: 'HASH' }],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-Confirmations',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'Confirmations', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-Category-Confirmations',
          KeySchema: [
            { AttributeName: 'Category', KeyType: 'HASH' },
            { AttributeName: 'Confirmations', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 5,
      },
    };

    const response = await db.createTable(params).promise();
    const err = response.$response.error;
    if (err) {
      if (err.code === 'ResourceInUseException') {
        return console.log('Table already exists');
      }

      if (err.code === 'ResourceNotFoundException') {
        await db
          .createTable(params, (err) => {
            if (err) {
              console.error('Error creating table:', err);
            } else {
              console.log('Table created successfully:');
            }
          })
          .promise();
      } else {
        console.error('Error describing table:', JSON.stringify(err, null, 2));
      }
    } else {
      console.log('Table already exists');
    }
  },
};

export default dynamodb;
