import { renderHook } from '@testing-library/react-hooks';
import useNextTable from './useNextTable';
import useTables from '../store/useTables';
import { Table } from '../../types/tableTypes';
import { defaultCombined } from '../../config/settings';
jest.mock('../store/useTables');

describe('useNextTable', () => {
  it('should calculate the next table number correctly', async () => {
    const mockTables: Table[] = [
      { tableNumber: 2, status: "busy", bill:10, numOfPeople: 2, maxNumOfPeople:4,combinedWith: defaultCombined},
      { tableNumber: 3, status: "cleaning", bill:20, numOfPeople: 0, maxNumOfPeople:1 ,combinedWith: defaultCombined},
      { tableNumber: 4, status: "reserved", bill:30, numOfPeople: 9, maxNumOfPeople:2,combinedWith: defaultCombined},
      { tableNumber: 1, status: "free", bill:0, numOfPeople: 1, maxNumOfPeople:2,combinedWith: defaultCombined},
      { tableNumber: 5, status: "free", bill:29.5, numOfPeople: 10, maxNumOfPeople:5,combinedWith: defaultCombined}
    ];

    const loadingTables = false;
    (useTables as jest.Mock).mockReturnValue({ tables: mockTables, loadingTables });

    const { result, waitForNextUpdate } = renderHook(() => useNextTable());

    waitForNextUpdate();

    const { nextTable, loadingNextTable } = result.current;

    expect(loadingNextTable).toBe(false);

    const lastTableNumber = mockTables.length > 0 ? mockTables[mockTables.length - 1].tableNumber : 0;
    const expectedNextTableNumber = lastTableNumber + 1;

    expect(nextTable.tableNumber).toBe(expectedNextTableNumber);
  });
});
