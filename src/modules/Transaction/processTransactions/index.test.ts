import { implementCustomerMap, launchResults } from 'src/utils/helpers';
import { processTransactions } from '.';
import { validTransactionsMock } from '../../../../mocks/index';
jest.mock('src/utils/helpers');

const mockImplementCustomerMap = implementCustomerMap as jest.Mock;
const mockLaunchResults = launchResults as jest.Mock;

describe('processTransactions function', () => {
  it('should process transactions and launch results with valid transactions', () => {
    mockImplementCustomerMap.mockReturnValue({
      smallestValidDeposit: 0,
      largestValidDeposit: 100,
    });

    processTransactions(validTransactionsMock);

    expect(mockImplementCustomerMap).toHaveBeenCalledWith(
      validTransactionsMock,
      expect.any(Map),
    );
    expect(mockLaunchResults).toHaveBeenCalledWith(expect.any(Map), 0, 100);
  });
});
