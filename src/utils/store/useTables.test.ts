import { renderHook, act } from '@testing-library/react-hooks';
import { getDocs, collection } from "firebase/firestore";
import useTables from './useTables';
import { Table } from "../../types/tableTypes";
import { sortTables } from "../sorting/sortTables";
import { defaultCombined, defaultSortingMethod } from "../../config/settings";


jest.mock("../sorting/sortTables", () => ({
  sortTables: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
}));

jest.mock("../../config/firebase", () => ({
  firestore: {},
}));

const mockTablesData: Table[] = [
  { tableNumber: 2, status: "busy", bill:10, numOfPeople: 2, maxNumOfPeople:4,combinedWith: defaultCombined},
  { tableNumber: 3, status: "cleaning", bill:20, numOfPeople: 0, maxNumOfPeople:1 ,combinedWith: defaultCombined},
  { tableNumber: 4, status: "reserved", bill:30, numOfPeople: 9, maxNumOfPeople:2,combinedWith: defaultCombined},
  { tableNumber: 1, status: "free", bill:0, numOfPeople: 1, maxNumOfPeople:2,combinedWith: defaultCombined},
  { tableNumber: 5, status: "free", bill:29.5, numOfPeople: 10, maxNumOfPeople:5,combinedWith: defaultCombined}
];

describe('useTables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and set tables', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockTablesData.map((table) => ({data: () => table})),
    });

    (collection as jest.Mock).mockReturnValue({});

    const { result, waitForNextUpdate } = renderHook(() => useTables());

    await waitForNextUpdate();

    console.log('Fetched tables:', result.current.tables);

    expect(collection).toHaveBeenCalledWith(expect.anything(), "tables");
    expect(getDocs).toHaveBeenCalledWith({});

    const currentTables = result.current.tables;
    expect(currentTables).toEqual(mockTablesData);

    expect(sortTables).toHaveBeenCalledWith(mockTablesData, defaultSortingMethod);
  });

  it('should handle tableAdded and tableRemoved events', async () => {
    const modifiedTablesData = [...mockTablesData];
    
    (getDocs as jest.Mock).mockResolvedValue({
      docs: modifiedTablesData.map((table) => ({data: () => table})),
    });

    (collection as jest.Mock).mockReturnValue({});

    const { result, waitForNextUpdate } = renderHook(() => useTables());

    await waitForNextUpdate();

    console.log('Initial fetch:', result.current.tables);

    const newTable: Table = { tableNumber: 6, status: "free", bill:0, numOfPeople: 0, maxNumOfPeople:4, combinedWith: defaultCombined };
    modifiedTablesData.push(newTable);
    
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: modifiedTablesData.map((table) => ({data: () => table})),
    });

    act(() => {
      const event = new CustomEvent('tableAdded', {
        detail: { table: newTable }
      });
      window.dispatchEvent(event);
    });

    await waitForNextUpdate();

    console.log('After tableAdded event:', result.current.tables);

    expect(getDocs).toHaveBeenCalledTimes(2);

    const removedTableNumber = 2;
    const updatedTablesData = modifiedTablesData.filter(table => table.tableNumber !== removedTableNumber);
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: updatedTablesData.map((table) => ({
        data: () => table,
      })),
    });

    act(() => {
      const event = new CustomEvent('tableRemoved', {
        detail: { table: { tableNumber: removedTableNumber } }
      });
      window.dispatchEvent(event);
    });

    await waitForNextUpdate();

    console.log('After tableRemoved event:', result.current.tables);

    expect(getDocs).toHaveBeenCalledTimes(3);
  });
});
