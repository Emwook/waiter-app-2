import { sortTables } from "./sortTables";

describe("sortTables function", () => {
  const table1 = { tableNumber: 1, status: "free", bill:0, numOfPeople: 1, maxNumOfPeople:2 };
  const table2 = { tableNumber: 2, status: "busy", bill:10, numOfPeople: 2, maxNumOfPeople:4 };
  const table3 = { tableNumber: 3, status: "cleaning", bill:20, numOfPeople: 0, maxNumOfPeople:1 };
  const table4 = { tableNumber: 4, status: "reserved", bill:30, numOfPeople: 9, maxNumOfPeople:2 };
  const table5 = { tableNumber: 5, status: "free", bill:29.5, numOfPeople: 10, maxNumOfPeople:5 };

  const unsortedTables = [table3, table1, table4, table2, table5];
  
  it("should sort tables by table number in ascending order", () => {
    const sortedTables = sortTables(unsortedTables, "tableNumber");
    expect(sortedTables).toEqual([table1, table2, table3, table4, table5]);
  });

  it("should sort tables by status based on status order", () => {
    const sortedTables = sortTables(unsortedTables, "status");
    expect(sortedTables).toEqual([table2, table1, table5, table3, table4]);
  });

  it("should sort tables by bill in descending order", () => {
    const sortedTables = sortTables(unsortedTables, "bill");
    expect(sortedTables).toEqual([table4, table5, table3, table2, table1]);
  });
  it("should sort tables by number of people in descending order", () => {
    const sortedTables = sortTables(unsortedTables, "numOfPeople");
    expect(sortedTables).toEqual([table5, table4, table2, table1, table3]);
  });
  it("should sort tables by maximum number of people in descending order", () => {
    const sortedTables = sortTables(unsortedTables, "maxNumOfPeople");
    expect(sortedTables).toEqual([table5, table2, table1, table4, table3]);
  });

});
