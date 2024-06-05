import { SortingMethodEvent, TableAddedEventDetail, TableRemovedEventDetail } from "../types/customEventTypes";
import { Table } from "../types/tableType";

export const dispatchTableAddedEvent = (table: Table) => {
  const event = new CustomEvent<TableAddedEventDetail>('tableAdded', { detail: { table } });
  window.dispatchEvent(event);
};

export const dispatchTableRemovedEvent = (table: Table) => {
  const event = new CustomEvent<TableRemovedEventDetail>('tableRemoved', { detail: { table } });
  window.dispatchEvent(event);
};

export const dispatchSortingMethodEvent = (method: keyof Table) => {
  const event = new CustomEvent<SortingMethodEvent>('methodChanged', { detail: { method } });
  window.dispatchEvent(event);
};