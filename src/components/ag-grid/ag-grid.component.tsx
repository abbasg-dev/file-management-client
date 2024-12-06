import { forwardRef, useCallback, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import {
  ColDef,
  GridReadyEvent,
  RowDoubleClickedEvent,
} from "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./ag-grid.scss";

type gridProps = {
  columns: ColDef[];
  rows: any[] | undefined;
  rowHeight: number;
  autoFit?: boolean;
  multipleSelection?: boolean;
  searchTerm?: string;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
  onGridReady?: (params: GridReadyEvent) => void;
};

const AgGrid = forwardRef((props: gridProps, ref?: any) => {
  const {
    columns,
    rows,
    rowHeight,
    multipleSelection,
    searchTerm,
    onGridReady,
    onRowDoubleClicked,
  } = props;

  const gridRef = useRef<AgGridReact>(null);

  // enables pagination in the grid
  const pagination = true;

  // sets 25 rows per page (default is 100)
  const paginationPageSize = 25;

  useEffect(() => {
    if (!rows && gridRef.current!.api)
      gridRef.current!.api.showLoadingOverlay();
  }, [rows, gridRef]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setQuickFilter(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      onFilterTextBoxChanged();
    }
  }, [onFilterTextBoxChanged, searchTerm]);

  return (
    <AgGridReact
      ref={gridRef}
      rowData={rows}
      columnDefs={columns}
      rowHeight={rowHeight}
      headerHeight={60}
      rowSelection={multipleSelection ? "multiple" : "single"}
      cacheQuickFilter={true}
      onGridReady={onGridReady}
      pagination={pagination}
      paginationPageSize={paginationPageSize}
      onRowDoubleClicked={onRowDoubleClicked}
    />
  );
});

export default AgGrid;
