import React from 'react';
import type { SortConfig, SortDirection } from '../../types';
import ChevronDownIcon from '../icons/ChevronDownIcon';

interface SortableTableHeaderProps<T> {
  label: string;
  sortKey: keyof T;
  sortConfig: SortConfig<T> | null;
  onSort: (key: keyof T) => void;
  disabled?: boolean;
}

const SortableTableHeader = <T,>({
  label,
  sortKey,
  sortConfig,
  onSort,
  disabled = false
}: SortableTableHeaderProps<T>) => {
  const isSorted = sortConfig?.key === sortKey;
  const direction = sortConfig?.direction;

  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="group inline-flex items-center"
        disabled={disabled}
      >
        {label}
        <span
          className={`ml-2 flex-none rounded ${
            isSorted && !disabled
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-400 invisible group-hover:visible'
          }`}
        >
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${
              isSorted && direction === 'ascending' ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>
    </th>
  );
};

export default SortableTableHeader;
