
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const FilterBar: React.FC = () => (
  <div className="flex items-center gap-3 mb-7 md:mb-10 w-full animate-fade-in">
    <Button
      variant="outline"
      size="sm"
      className="rounded-full px-5 py-2 text-sm border-gray-300 text-gray-700 hover:bg-accent hover:text-white transition flex items-center gap-2"
      type="button"
      disabled
    >
      <Filter size={16} className="mr-1" />
      Filter by location
    </Button>
  </div>
);

export default FilterBar;
