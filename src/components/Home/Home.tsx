import React, { useState, useEffect } from "react";
import { Table } from "../../types/tableType";
import TableBar from "../TableBar/TableBar";
import useTables from "../../utils/useTables";
import Loading from "../Loading/Loading";
import TableForm from "../TableForm/TableForm";

const Home: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const tablesData = useTables();

  useEffect(() => {
    if (tablesData) {
      setTables(tablesData);
      setLoading(false);
    }
  }, [tablesData]);

  useEffect(() => {
    const handleTableAdded = (event: CustomEvent<{ table: Table }>) => {
      setTables((prevTables) => [...prevTables, event.detail.table]);
    };

    window.addEventListener('tableAdded', handleTableAdded as EventListener);

    return () => {
      window.removeEventListener('tableAdded', handleTableAdded as EventListener);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <ul className="mt-5 px-3 list-unstyled">
        {tables.map((table, index) => (
          <li key={table.id}>
            <TableBar Table={table} />
          </li>
        ))}
      </ul>
      <TableForm />
    </div>
  );
};

export default Home;
