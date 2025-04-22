
import React from "react";
import { Button } from "@/components/ui/button";

interface FilterDef {
  label: string;
}

const GalleryFilterBar: React.FC<{ filters: FilterDef[] }> = ({ filters }) => (
  <div className="flex items-center gap-3 mb-7 md:mb-10 w-full">
    {filters.map((filter) => (
      <Button
        key={filter.label}
        variant="outline"
        size="sm"
        className="rounded-full px-5 py-2 text-sm border-gray-300 text-gray-700 hover:bg-accent hover:text-white transition"
        type="button"
        disabled
      >
        {filter.label}
      </Button>
    ))}
  </div>
);

export default GalleryFilterBar;
