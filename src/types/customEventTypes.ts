import { Table } from "./tableType";

export interface TableAddedEventDetail {
    table: Table;
}
export interface TableRemovedEventDetail {
    table: Table;
}

export interface SortingMethodEvent {
    method: keyof Table;
}
  