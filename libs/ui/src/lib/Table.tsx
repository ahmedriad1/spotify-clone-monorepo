import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { usePagination, useTable, Column } from 'react-table';

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D> {}

  interface TableInstance<D extends object>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {
    editable: boolean;
  }

  interface TableState<D extends object>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  interface ColumnInterface<D extends object>
    extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {}

  interface ColumnInstance<D extends object>
    extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {}

  interface Cell<D extends object>
    extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  interface Row<D extends object>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {}
}

interface ITableProps<T extends object> {
  columns: Array<Column<T>>;
  deleteRow: (record: T, page: number) => void;
  loading: boolean;
  pageCount: number;
  data: T[];
  setPage: (page: number) => void;
  editLink: (record: T) => string;
}

function Table<T extends object>({
  columns,
  data = [],
  setPage: setControlledPage,
  loading,
  pageCount: controlledPageCount,
  deleteRow,
  editLink,
}: ITableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    flatHeaders,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<T>(
    {
      columns,
      data,
      defaultColumn: {
        Cell: ({ value }: { value: any }) => (
          <span className="text-[rgba(255,255,255,0.6)] text-sm">{value}</span>
        ),
      },
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination
  );

  const deleteRowCallback = useCallback(deleteRow, [deleteRow]);

  useEffect(() => {
    setControlledPage(pageIndex + 1);
    // fetchData({ pageIndex, pageSize })
  }, [setControlledPage, pageIndex]);

  return (
    <>
      <div className="flex flex-col">
        {loading && <p>Loading...</p>}
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-black sm:rounded-md">
              <table className="min-w-full" {...getTableProps()}>
                <thead className="bg-sp-green">
                  <tr>
                    {flatHeaders.map((column) => (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        {...column.getHeaderProps()}
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>

                    {/* {Object.keys(cols).map(columnName => (
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
                      key={columnName}
                    >
                      {columnName}
                    </th>
                  ))} */}
                  </tr>
                </thead>
                {!loading && (
                  <tbody className="bg-black" {...getTableBodyProps()}>
                    {page.map((row, i) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell, cellIdx) => {
                            return (
                              <td
                                className="px-6 py-4 whitespace-nowrap"
                                {...cell.getCellProps()}
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={editLink(row.original)}>
                              <a className="text-[#2f7cdb]">Edit</a>
                            </Link>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() =>
                                deleteRowCallback(row.original, pageIndex + 1)
                              }
                              className="text-red-500"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      {pageCount > 1 && (
        <div className="mt-5 flex justify-between items-center">
          <p className="flex justify-around items-center">
            Page{' '}
            <input
              className="outline-none focus:outline-none w-12 p-1 text-center bg-black font-semibold text-md hover:text-white focus:text-white md:text-basecursor-default flex items-center text-gray-200 appearance-none mx-2"
              type="number"
              value={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />{' '}
            of {pageOptions.length}
          </p>
          {/* <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => gotoPage(0)}
              className={`bg-sp-green text-white rounded p-2 disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={!canPreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`bg-sp-green text-white rounded p-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`bg-sp-green text-white rounded p-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className={`bg-sp-green text-white rounded p-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
