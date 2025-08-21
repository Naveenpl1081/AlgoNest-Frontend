import { TableProps } from "../../types/component.types";

const Table = <T extends object>({
  data,
  columns,
  currentPage,
  pageSize = 5,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-slate-800 bg-slate-900 text-white table-auto">
        <thead className="bg-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-center border-b border-slate-700 text-slate-200 font-medium tracking-wider uppercase text-sm"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {data.length === 0 ? (
          <tbody>
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-slate-400 bg-slate-900"
              >
                No data found.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-slate-800 transition-colors duration-150 ease-in-out"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-6 py-4 border-b border-slate-800 text-sm text-slate-300 text-center"
                  >
                    {col.render
                      ? col.render(
                          row,
                          (currentPage - 1) * pageSize + rowIndex 
                        )
                      : String(row[col.key as keyof T])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Table;
