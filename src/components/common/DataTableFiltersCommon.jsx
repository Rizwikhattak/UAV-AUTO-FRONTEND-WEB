import { Button } from "@/components/ui/button";
import React from "react";

const DataTableFiltersCommon = ({
  filters,
  selectedFilter,
  handleFilterChange,
}) => {
  return (
    <div className="flex items-center gap-3">
      {filters?.map((filter, index) => {
        return (
          <Button
            key={index}
            variant="gray"
            className={`${
              filter === selectedFilter ? "bg-primary-custom" : "bg-gray-400"
            } text-white hover:bg-primary-custom`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </Button>
        );
      })}
    </div>
  );
};

export default DataTableFiltersCommon;
