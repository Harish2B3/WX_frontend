import React from 'react';
import { RecentFile } from '../types';
import { InfoIcon } from '../constants/icons';

const SpreadsheetEditor: React.FC<{ file: RecentFile }> = ({ file }) => {
  const columns = Array.from({ length: 15 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div className="h-full w-full flex flex-col bg-mono-gray-dark overflow-hidden p-4">
      <div className="flex-shrink-0 flex items-center gap-2 p-2 bg-yellow-900/50 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm shadow mb-4">
          <InfoIcon />
          <span>This is a read-only preview of <span className="font-semibold text-mono-text-primary">{file.name}</span>. Full functionality requires download.</span>
      </div>
      
      {/* Mock Formula Bar */}
      <div className="flex-shrink-0 flex items-center bg-mono-gray-mid border border-mono-border rounded-t-lg">
        <div className="p-2 border-r border-mono-border text-mono-text-secondary text-sm font-mono w-24 text-center">A1</div>
        <div className="p-2 text-mono-text-primary text-sm font-mono flex-grow"></div>
      </div>
      
      {/* Spreadsheet Grid */}
      <div className="flex-grow w-full bg-mono-gray-mid border-x border-b border-mono-border rounded-b-lg overflow-auto">
        <table className="w-full border-collapse table-fixed">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 bg-mono-gray-dark p-1 border-r border-b border-mono-border z-20 w-16 text-center"></th>
              {columns.map(col => (
                <th key={col} className="bg-mono-gray-dark p-2 border-r border-b border-mono-border font-semibold text-mono-text-secondary min-w-[100px]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(rowNum => (
              <tr key={rowNum}>
                <td className="sticky left-0 bg-mono-gray-dark p-2 border-r border-b border-mono-border font-semibold text-mono-text-secondary text-center w-16 z-10">{rowNum}</td>
                {columns.map(col => {
                    return (
                        <td key={`${col}${rowNum}`} className="border-r border-b border-mono-border p-2 truncate whitespace-nowrap hover:bg-accent-purple/10 cursor-default"></td>
                    )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetEditor;
