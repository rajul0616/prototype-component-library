// Generic sortable, paginated table. Props: columns[{ key, label, sortable, render(row) }], rows[], onRowClick, pageSize.
import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export default function DataTable({ columns = [], rows = [], onRowClick, pageSize = 10 }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return -1
      if (bVal == null) return 1
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
      return 0
    })
    return sortDir === 'asc' ? sorted : sorted.reverse()
  }, [rows, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = sortedRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  function handleSort(col) {
    if (!col.sortable) return
    if (sortKey === col.key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(col.key)
      setSortDir('asc')
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b border-gray-200 bg-violet-50/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`px-4 py-2.5 font-medium text-gray-600 ${
                    col.sortable ? 'cursor-pointer select-none hover:text-violet-600' : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable ? (
                      sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      ) : (
                        <ChevronsUpDown size={14} className="text-gray-300" />
                      )
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              <>
                {pageRows.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? 'cursor-pointer hover:bg-violet-50/60' : ''}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="truncate px-4 py-2.5 text-gray-700">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                {Array.from({ length: pageSize - pageRows.length }).map((_, i) => (
                  <tr key={`filler-${i}`} aria-hidden="true">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-2.5">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-sm text-gray-500">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-gray-200 px-3 py-1 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-gray-200 px-3 py-1 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
