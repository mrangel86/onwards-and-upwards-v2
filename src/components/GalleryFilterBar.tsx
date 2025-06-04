import React from 'react';

interface Filter {
  label: string;
  value?: string;
  options?: Array<{ label: string; value: string }>;
}

interface GalleryFilterBarProps {
  filters: Filter[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
}

const GalleryFilterBar: React.FC<GalleryFilterBarProps> = ({ 
  filters, 
  selectedFilter = 'all',
  onFilterChange 
}) => {
  const filter = filters[0]; // Assuming single filter for now
  
  if (!filter?.options || filter.options.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <select
        value={selectedFilter}
        onChange={(e) => onFilterChange?.(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-700 min-w-[200px]"
      >
        <option value="all">All Locations</option>
        {filter.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GalleryFilterBar;