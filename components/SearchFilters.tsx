import React from 'react';
import { SearchFilters } from '../types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

const SearchFilterComponent: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const FilterSelect: React.FC<{
    name: keyof SearchFilters;
    label: string;
    value: string;
    options: { value: string; label: string }[];
  }> = ({ name, label, value, options }) => (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-mono-text-secondary mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleSelectChange}
        className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
  
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'folder', label: 'Folder' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'document', label: 'Document' },
  ];

  const dateOptions = [
    { value: 'any', label: 'Any time' },
    { value: 'day', label: 'Past 24 hours' },
    { value: 'week', label: 'Past week' },
    { value: 'month', label: 'Past month' },
    { value: 'year', label: 'Past year' },
  ];

  const sizeOptions = [
    { value: 'any', label: 'Any size' },
    { value: 'small', label: '< 1 MB' },
    { value: 'medium', label: '1 - 100 MB' },
    { value: 'large', label: '100 MB - 1 GB' },
    { value: 'xlarge', label: '> 1 GB' },
  ];

  return (
    <div className="glossy-card rounded-xl p-4 w-72 border border-mono-border/50">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-mono-text-primary">Search Filters</h3>
            <button
              onClick={onClearFilters}
              className="text-xs font-medium text-accent-purple-light hover:underline"
            >
              Clear All
            </button>
        </div>

        <div className="space-y-4">
            <FilterSelect name="type" label="File Type" value={filters.type} options={typeOptions} />
            <FilterSelect name="dateRange" label="Date Modified" value={filters.dateRange} options={dateOptions} />
            <FilterSelect name="sizeRange" label="File Size" value={filters.sizeRange} options={sizeOptions} />
        </div>
    </div>
  );
};

export default SearchFilterComponent;