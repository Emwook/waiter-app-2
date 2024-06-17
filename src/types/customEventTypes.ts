import { GroupingMethod, Table } from "./tableTypes";

export interface TableAddedEventDetail {
    table: Table;
}
export interface TableRemovedEventDetail {
    table: Table;
}

export interface SortingMethodEvent {
    method: keyof Table;
}
export interface RefetchTablesEvent {
    table: Table;
}
export interface CombinedTablesEvent {
    tables: Table[];
}

export interface GroupingMethodEvent {
    method: GroupingMethod;
}

export interface SelectedTableEvent {
    table: Table;
}
  