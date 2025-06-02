"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { DataTablePaginationCommon } from "./DataTablePaginationCommon";
import { DataTableViewOptionsCommon } from "./DataTableViewOptionsCommon";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export function DataTableCommon({
  filters = [],
  selectedFilter,
  setSelectedFilter,
  columns,
  data = [],
  isLoading = false,
  // pageSize= 10,
  // pageIndex= 0,
  // onPageSizeChange,
  // onPageChange,
  totalDataCount = 0,
  // onSortChange, // New prop for handling sort changes
  onFetchData,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [tablePagination, setTablePagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const pageSize = tablePagination.pageSize;
  const pageIndex = tablePagination.pageIndex;
  // Calculate total pages for server-side pagination
  const totalPages = Math.ceil(totalDataCount / pageSize);

  // Effect to call API when sorting changes
  useEffect(() => {
    if (sorting.length > 0 && onSortChange) {
      onSortChange(sorting);
    }
  }, [sorting]);
  useEffect(() => {
    // if (!openEditModal) {
    const offset = tablePagination.pageIndex * tablePagination.pageSize;
    const limit = tablePagination.pageSize;
    if (onFetchData) onFetchData(offset, limit);
    // }
  }, [tablePagination.pageIndex, tablePagination.pageSize]);
  const onPageSizeChange = (newPageSize) => {
    setTablePagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 0, // Reset to first page when changing page size
    }));
  };

  const onPageChange = (newPageIndex) => {
    setTablePagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
  };

  const onSortChange = async (newSorting) => {
    const [sort] = newSorting;
    try {
      await dispatch(
        getAllBankAccounts({ offset: 0, limit: 10, sort: sort })
      ).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  // Custom sorting handler
  const handleSortingChange = (updater) => {
    let newSorting;

    if (typeof updater === "function") {
      newSorting = updater(sorting);
    } else {
      newSorting = updater;
    }

    setSorting(newSorting);

    // You can also call the API directly here if you prefer
    // if (newSorting.length > 0 && onSortChange) {
    //   onSortChange(newSorting);
    // }
  };

  const table = useReactTable({
    data,
    columns,
    // Configure for server-side pagination:
    manualPagination: true,
    pageCount: totalPages,
    // Add manual sorting
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },

    // Connect table state to parent component
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex,
          pageSize,
        });

        if (newPagination.pageIndex !== pageIndex) {
          onPageChange(newPagination.pageIndex);
        }

        if (newPagination.pageSize !== pageSize) {
          onPageSizeChange(newPagination.pageSize);
        }
      }
    },
  });

  return (
    <div className={` overflow-y-hidden  mt-4 bg-white rounded-lg border`}>
      {/* py-2  px-5 */}
      {filters.length > 0 && (
        <div className="flex items-center p-2">
          <div className="flex items-center border rounded-md">
            {filters.map((filter, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => setSelectedFilter(filter.name)}
                className={`!rounded-none flex items-center gap-4 ${
                  selectedFilter === filter.name ? "bg-[#F5F5F5]" : "bg-none"
                }  ${
                  index !== filters.length - 1 ? "border-r" : "border-none"
                }`}
              >
                <span>{filter.name}</span>
                <span
                  className={` rounded-md min-w-6 min-h-6 flex items-center justify-center  ${
                    selectedFilter === filter.name
                      ? "bg-[#1D2939] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {filter.count}
                </span>
              </Button>
            ))}
          </div>

          <DataTableViewOptionsCommon table={table} />
          {/* <DataTableViewOptionsCommon table={table} /> */}
        </div>
      )}
      <div className="rounded-md">
        <div className="w-full min-w-full">
          <Table>
            <TableHeader className=" bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex flex-col gap-2">
                      {[...Array(pageSize || 5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <div className="py-1 border-t bg-gray-50">
          <DataTablePaginationCommon
            table={table}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            onPageChange={onPageChange}
            totalCount={totalDataCount}
            currentDataCount={data.length}
          />
        </div> */}
      </div>
    </div>
  );
}
