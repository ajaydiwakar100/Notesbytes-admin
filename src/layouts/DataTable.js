import React, { useState, useMemo } from "react";

const DataTable = ({ columns = [], data = [], startIndex = 0 }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    if (!key) return;

    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      // Numeric sort
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return sortConfig.direction === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      // String sort
      return sortConfig.direction === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    return sorted;
  }, [data, sortConfig]);

  return (
    <div className="table-responsive">
      <table className="table table-bordered admin-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  cursor: col.accessor ? "pointer" : "default",
                  whiteSpace: "nowrap",
                }}
                onClick={() => col.accessor && handleSort(col.accessor)}
              >
                {col.header}{" "}
                {col.accessor && (
                  <span>
                    {sortConfig.key === col.accessor ? (
                      sortConfig.direction === "asc" ? (
                        <i className="fa fa-sort-asc ml-1"></i>
                      ) : (
                        <i className="fa fa-sort-desc ml-1"></i>
                      )
                    ) : (
                      <i className="fa fa-sort text-muted ml-1"></i>
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr key={row._id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render
                      ? col.render(row, startIndex + rowIndex)
                      : col.accessor === "index"
                      ? startIndex + rowIndex + 1
                      : row[col.accessor] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
