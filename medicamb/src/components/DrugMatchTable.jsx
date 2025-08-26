import React from 'react';

const DrugMatchTable = ({ matches, onSelect }) => (
  <table className="min-w-full bg-white border rounded shadow">
    <thead>
      <tr>
        <th className="py-2 px-4 border-b">Name</th>
        <th className="py-2 px-4 border-b">Query</th>
        <th className="py-2 px-4 border-b">Score</th>
        <th className="py-2 px-4 border-b"></th>
      </tr>
    </thead>
    <tbody>
      {matches.map((m, i) => (
        <tr key={i} className="hover:bg-blue-50">
          <td className="py-2 px-4 border-b font-semibold">{m.name}</td>
          <td className="py-2 px-4 border-b">{m.query}</td>
          <td className="py-2 px-4 border-b">{m.score.toFixed(3)}</td>
          <td className="py-2 px-4 border-b">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              onClick={() => onSelect(m)}
            >
              Details
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default DrugMatchTable;