// src/components/common/Table.tsx
import React from "react";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
  }

  interface TableProps<T extends { _id: string; [key: string]: React.ReactNode }> {
    columns: Column<T>[];
    data: T[];
  }

export function Table<T extends { _id: string }>({ columns, data }: TableProps<T>) {
  return (
    <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              className="px-4 py-2 border-b border-gray-700 text-left font-semibold"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id} className="hover:bg-gray-700/50 transition">
            {columns.map((col, index) => {
              let value: React.ReactNode;
              if (typeof col.accessor === "function") {
                value = col.accessor(row);
              } else {
                value = row[col.accessor] as React.ReactNode;

              }
              return (
                <td key={index} className="px-4 py-2 border-b border-gray-700">
                  {value}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
