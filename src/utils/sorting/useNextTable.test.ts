import { renderHook } from '@testing-library/react-hooks';
import useNextTable from './useNextTable';
import useTables from '../store/useTables';
import { Table } from '../../types/tableType';

jest.mock('../store/useTables'); // Mock the useTables hook

describe('useNextTable', () => {
  it('should calculate the next table number correctly', async () => { // Mark the test function as async
    // Mock the useTables hook to return an array of tables
    const mockTables: Table[] = [
    { tableNumber: 2, status: "busy", bill:10, numOfPeople: 2, maxNumOfPeople:4 },
    { tableNumber: 3, status: "cleaning", bill:20, numOfPeople: 0, maxNumOfPeople:1 },
    { tableNumber: 4, status: "reserved", bill:30, numOfPeople: 9, maxNumOfPeople:2 },
    { tableNumber: 1, status: "free", bill:0, numOfPeople: 1, maxNumOfPeople:2 },
    { tableNumber: 5, status: "free", bill:29.5, numOfPeople: 10, maxNumOfPeople:5 }
    ];
    (useTables as jest.Mock).mockReturnValue(mockTables);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useNextTable());

    // Wait for the hook to finish updating
    await waitForNextUpdate();

    // Get the result
    const newTable = result.current;

    // Calculate the expected next table number
    const lastTableNumber = mockTables.length > 0 ? mockTables[mockTables.length - 1].tableNumber : 0;
    const expectedNextTableNumber = lastTableNumber + 1;

    // Assert that the new table number matches the expected value
    expect(newTable.tableNumber).toBe(expectedNextTableNumber);
  });
});
