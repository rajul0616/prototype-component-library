// Generic sortable, paginated, resizable table. Props: columns[{ key, label, sortable, render(row) }], rows[], onRowClick, pageSize. Columns split the container evenly until the user drags a resize handle.
import { useMemo, useRef, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const MIN_COL_WIDTH = 80

export default function DataTable({ columns = [], rows = [], onRowClick, pageSize = 10 }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  // Empty until the user drags a resize handle — until then columns split the container evenly with no horizontal scroll.
  const [colWidths, setColWidths] = useState({})
  const thRefs = useRef({})
  const isCustomized = Object.keys(colWidths).length > 0

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

  const tableWidth = isCustomized
    ? columns.reduce((sum, col) => sum + (colWidths[col.key] ?? MIN_COL_WIDTH), 0)
    : undefined

  function handleSort(col) {
    if (!col.sortable) return
    if (sortKey === col.key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(col.key)
      setSortDir('asc')
    }
  }

  function startResize(e, key) {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX

    // First-ever resize: snapshot every column's current rendered width so switching
    // to fixed pixel widths doesn't jump the other columns around.
    let baseWidths = colWidths
    if (!isCustomized) {
      baseWidths = Object.fromEntries(
        columns.map((c) => [c.key, thRefs.current[c.key]?.offsetWidth ?? MIN_COL_WIDTH]),
      )
      setColWidths(baseWidths)
    }
    const startWidth = baseWidths[key] ?? MIN_COL_WIDTH

    function onMouseMove(moveEvent) {
      const nextWidth = Math.max(MIN_COL_WIDTH, startWidth + (moveEvent.clientX - startX))
      setColWidths((prev) => ({ ...prev, [key]: nextWidth }))
    }
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table
          className={`table-fixed text-left text-sm ${isCustomized ? '' : 'w-full'}`}
          style={isCustomized ? { width: tableWidth } : undefined}
        >
          {isCustomized ? (
            <colgroup>
              {columns.map((col) => (
                <col key={col.key} style={{ width: colWidths[col.key] }} />
              ))}
            </colgroup>
          ) : null}
          <thead className="border-b border-gray-200 bg-violet-50/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  ref={(el) => {
                    thRefs.current[col.key] = el
                  }}
                  onClick={() => handleSort(col)}
                  className={`relative px-4 py-2.5 font-medium text-gray-600 ${
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
                  <div
                    onMouseDown={(e) => startResize(e, col.key)}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none hover:bg-violet-300"
                  />
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
                      <td key={col.key} className="px-4 py-2.5 text-gray-700">
                        {col.render ? col.render(row) : <TruncatedText>{row[col.key]}</TruncatedText>}
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

// Shows a tooltip with the full value, but only once the text actually overflows its cell.
function TruncatedText({ children }) {
  const ref = useRef(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const [hovered, setHovered] = useState(false)

  function handleMouseEnter() {
    if (ref.current) setIsTruncated(ref.current.scrollWidth > ref.current.clientWidth)
    setHovered(true)
  }

  return (
    <div className="relative">
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        className="block truncate"
      >
        {children}
      </span>
      {hovered && isTruncated ? (
        <div className="absolute left-0 top-full z-20 mt-1 max-w-xs whitespace-normal break-words rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg">
          {children}
        </div>
      ) : null}
    </div>
  )
}
