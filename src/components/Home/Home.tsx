import React, { useState, useEffect } from "react";
import { Table } from "../../types/tableType";
import TableBar from "../TableBar/TableBar";
import useTables from "../../utils/store/useTables";
import Loading from "../Loading/Loading";
import TableForm from "../TableForm/TableForm";
import SortingPanel from "../SortingPanel/SortingPanel";
import { sortTables } from "../../utils/sorting/sortTables";
import { defaultSortingMethod } from "../../config/settings";

const Home: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {tables: tablesData} = useTables();
  const [sortingMethod, setSortingMethod] = useState <keyof Table>(defaultSortingMethod);

  useEffect(() => {
    setLoading(true);
    if (tablesData) {
      setTables(sortTables(tablesData, sortingMethod));
      setLoading(false);
    }
  }, [tablesData, sortingMethod]);

  useEffect(() => {
    const handleTableAdded = (event: CustomEvent<{ table: Table }>) => {
      setTables((prevTables) => [...prevTables, event.detail.table]);
    };

    window.addEventListener('tableAdded', handleTableAdded as EventListener);

    return () => {
      window.removeEventListener('tableAdded', handleTableAdded as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleTableRemoved = (event: CustomEvent<{ table: Table }>) => {
      setTables((prevTables) => prevTables.filter(table => table.tableNumber !== event.detail.table.tableNumber));
    };

    window.addEventListener('tableRemoved', handleTableRemoved as EventListener);

    return () => {
      window.removeEventListener('tableRemoved', handleTableRemoved as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleSortingMethodChange = (event: CustomEvent<{ method: keyof Table }>) => {
      setSortingMethod(event.detail.method);
      console.log('method changed to: ', event.detail.method);
    };
    window.addEventListener('methodChanged', handleSortingMethodChange as EventListener);

    return () => {
      window.removeEventListener('methodChanged', handleSortingMethodChange as EventListener);
    };
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <SortingPanel sortingMethod={sortingMethod}/>
      <ul className="mt-1 px-3 list-unstyled">
        {tables.map((table, index) => (
          <li key={table.tableNumber}>
            <TableBar Table={table} />
          </li>
        ))}
      </ul>
      <TableForm />
    </div>
  );
};

export default Home;
