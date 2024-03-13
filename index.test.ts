import dynamodb from './src/infra/dynamo/dynamodb';
import { DynamoDBSingleton } from './src/infra/dynamo/DynamoSingleton';
import {
  getValidTransactions,
  processTransactions,
} from './src/modules/Transaction';
import { main } from './index';
import { validTransactionsMock } from './mocks';
import { dropTable, storeData } from './src/utils/helpers';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('./src/infra/dynamo/dynamodb', () => ({
  startDatabase: jest.fn(),
}));

jest.mock('./src/infra/dynamo/DynamoSingleton', () => ({
  DynamoDBSingleton: {
    getInstance: jest.fn(),
  },
}));

jest.mock('./src/modules/Transaction', () => ({
  getValidTransactions: jest.fn(),
  processTransactions: jest.fn(),
}));

jest.mock('src/utils/helpers', () => ({
  dropTable: jest.fn(),
  storeData: jest.fn(),
}));

const mockDynamoSingleton = DynamoDBSingleton.getInstance as jest.Mock;
const getValidTransactionsMock = getValidTransactions as jest.Mock;

describe('Main file tests', () => {
  it('should start the database, retrieve valid transactions, process them, and drop the table', async () => {
    mockDynamoSingleton.mockReturnValueOnce({});

    getValidTransactionsMock.mockResolvedValueOnce(validTransactionsMock);

    await main();

    expect(dynamodb.startDatabase).toHaveBeenCalled();
    expect(DynamoDBSingleton.getInstance).toHaveBeenCalled();
    expect(storeData).toHaveBeenCalledWith({});
    expect(getValidTransactions).toHaveBeenCalledWith({});
    expect(processTransactions).toHaveBeenCalledWith(validTransactionsMock);
    expect(dropTable).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    (dynamodb.startDatabase as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    try {
      await main();
    } catch (error) {
      expect(error).toBe('Database error');
    }

    expect(dropTable).toHaveBeenCalled();
  });
});
