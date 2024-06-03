import { TableAddedEventDetail } from "../types/customEventTypes";
import { Table } from "../types/tableType";

export const dispatchTableAddedEvent = (table: Table) => {
  const event = new CustomEvent<TableAddedEventDetail>('tableAdded', { detail: { table } });
  window.dispatchEvent(event);
};