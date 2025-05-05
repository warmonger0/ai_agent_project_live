interface TableProps {
    headers: string[];
    children: React.ReactNode;
  }
  
  const Table = ({ headers, children }: TableProps) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
  
  export default Table;
  